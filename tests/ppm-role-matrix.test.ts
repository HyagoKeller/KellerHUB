import { afterAll, expect, test } from 'bun:test';
import { PGlite } from '@electric-sql/pglite';
import { readFile, readdir } from 'node:fs/promises';

const db = new PGlite();
afterAll(() => db.close());
const bootstrap = db.exec(`
CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}'::jsonb) $$;
GRANT USAGE ON SCHEMA auth TO authenticated,anon,service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated,anon,service_role;
CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}');
CREATE TYPE public.app_role AS ENUM ('superadmin','admin','moderator','user');
CREATE TABLE public.user_roles(id uuid DEFAULT gen_random_uuid(),user_id uuid,role public.app_role);
GRANT SELECT ON public.user_roles TO authenticated;
CREATE TABLE public.portal_settings(id text PRIMARY KEY,config jsonb,updated_by uuid);
ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.app_settings(id text PRIMARY KEY,config jsonb DEFAULT '{}',updated_by uuid,created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now());
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE ON public.app_settings TO authenticated;
CREATE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at:=now(); RETURN NEW; END $$;
`).then(async () => {
  for (const name of (await readdir('drizzle/migrations')).filter(n => /^\d+.*\.sql$/.test(n)).sort()) {
    if (['0000','0003','0004'].some(prefix => name.startsWith(prefix))) continue;
    const source = (await readFile(`drizzle/migrations/${name}`, 'utf8')).replace(/ALTER PUBLICATION[^;]*;/g,'');
    await db.exec(source);
  }
});
function adapter() {
  const sql: any = async (parts: TemplateStringsArray, ...values: unknown[]) => {
    const query = parts.reduce((text, part, index) => text + part + (index < values.length ? `$${index + 1}` : ''), '');
    return (await db.query(query, values)).rows;
  };
  sql.savepoint = async (run: (s: any) => Promise<unknown>) => {
    await db.exec('SAVEPOINT denied_operation');
    try { const result = await run(sql); await db.exec('RELEASE SAVEPOINT denied_operation'); return result; }
    catch(error) { await db.exec('ROLLBACK TO SAVEPOINT denied_operation'); await db.exec('RELEASE SAVEPOINT denied_operation'); throw error; }
  };
  return sql;
}
const id = (n: number) => `f1300000-0000-4000-8000-${String(n).padStart(12, '0')}`;

// All fixtures, temporary roles and operations are rolled back, including audit rows.
async function scenario(role: string, check: (sql: any, user: string, other: string) => Promise<void>) {
  await bootstrap;
  await db.exec('BEGIN');
  const sql = adapter();
  try {
    await sql`insert into auth.users(id,email) values(${id(100)},'test-a@example.invalid'),(${id(101)},'test-b@example.invalid')`;
    await sql`insert into public.profiles(id,email,display_name) values(${id(100)},'test-a@example.invalid','Teste A'),(${id(101)},'test-b@example.invalid','Teste B')`;
    await sql`insert into public.ppm_usuarios(user_id) values(${id(100)}),(${id(101)})`;
    const users = await sql`select id from public.profiles order by created_at limit 2`;
    if (users.length !== 2) throw new Error('São necessárias duas contas existentes para validar isolamento.');
    const [user, other] = users.map(row => row.id);
    await sql`delete from public.ppm_papeis where user_id=${user}`;
    await sql`insert into public.ppm_papeis(user_id,papel) values(${user},${role})`;
    await sql`update public.ppm_usuarios set ativo=true where user_id=${user}`;
    await sql`insert into public.areas(id,nome,sigla) values(${id(1)},'Teste transacional A','TTA'),(${id(2)},'Teste transacional B','TTB')`;
    await sql`insert into public.area_membros(area_id,usuario_id) values(${id(1)},${user}),(${id(2)},${other})`;
    await sql`insert into public.portfolios(id,area_id,nome) values(${id(3)},${id(1)},'Teste carteira A'),(${id(4)},${id(2)},'Teste carteira B')`;
    await sql`insert into public.programas(id,portfolio_id,nome) values(${id(5)},${id(3)},'Teste programa')`;
    await sql`insert into public.projetos(id,programa_id,nome) values(${id(6)},${id(5)},'Teste projeto')`;
    await sql`insert into public.projeto_elementos(id,projeto_id,nome,responsavel_id) values(${id(7)},${id(6)},'Atribuído a mim',${user}),(${id(8)},${id(6)},'Atribuído a outro',${other})`;
    await sql`insert into public.projeto_subelementos(id,projeto_id,elemento_id,nome,responsavel_id) values(${id(9)},${id(6)},${id(7)},'Subitem atribuído',${user})`;
    await sql`select set_config('request.jwt.claim.sub',${user},true),set_config('request.jwt.claims',${JSON.stringify({sub:user,role:'authenticated'})},true)`;
    await sql`set local role authenticated`;
    await check(sql, user, other);
    // Force transaction rollback without treating successful checks as failures.
    } finally { await db.exec('ROLLBACK'); }
}
async function denied(sql: any, operation: (s: any) => Promise<unknown>) {
  let blocked = false;
  try { await sql.savepoint(async (s: any) => {
    const result = await operation(s);
    if (Array.isArray(result) && result.length === 0) throw new Error('Filtered by access policy');
  }); } catch (error) {
    if (error instanceof Error && error.message === 'Filtered by access policy') blocked = true;
    else if (typeof error === 'object' && error !== null && 'code' in error && ['42501','P0001'].includes(String(error.code))) blocked = true;
    else throw error;
  }
  expect(blocked).toBe(true);
}

for (const role of ['tecnico','gestor']) {
  test(`${role}: área restrita externa e metadados não são expostos`, () => scenario(role, async sql => {
    const rows = await sql`select id from public.portfolios where id in (${id(3)},${id(4)})`;
    expect(rows.map((r: any) => r.id)).toEqual([id(3)]);
    const [row] = await sql`select public.ppm_snapshot() as snapshot`;
    expect(row.snapshot.objetos[id(4)]).toBeUndefined();
    expect(row.snapshot.permissoes[id(4)]).toBeUndefined();
    await denied(sql,s => s`update public.portfolios set nome='Indevido' where id=${id(4)} returning id`);
  }));
}
for (const role of ['auditor','alta_administracao']) {
  test(`${role}: leitura transversal sem edição ou criação`, () => scenario(role, async sql => {
    expect((await sql`select id from public.portfolios where id in (${id(3)},${id(4)})`).length).toBe(2);
    await denied(sql,s => s`update public.portfolios set nome='Indevido' where id=${id(3)} returning id`);
    await denied(sql,s => s`insert into public.projeto_elementos(projeto_id,nome) values(${id(6)},'Indevido') returning id`);
    await denied(sql,s => s`delete from public.projeto_elementos where id=${id(7)} returning id`);
    await denied(sql,s => s`select public.ppm_alterar_acesso(${id(3)},'{"visibilidade":"publica"}'::jsonb)`);
  }));
}
test('Técnico: altera só o item atribuído e não reatribui nem exclui', () => scenario('tecnico', async (sql, user, other) => {
  expect((await sql`update public.projeto_elementos set progresso=42 where id=${id(7)} returning progresso`)[0].progresso).toBe('42');
  await denied(sql,s => s`update public.projeto_elementos set progresso=99 where id=${id(8)} returning id`);
  await denied(sql,s => s`update public.projeto_elementos set responsavel_id=${other} where id=${id(7)} returning id`);
  await denied(sql,s => s`delete from public.projeto_elementos where id=${id(7)} returning id`);
  await denied(sql,s => s`insert into public.projetos(programa_id,nome) values(${id(5)},'Indevido') returning id`);
}));
test('Técnico: não move subelemento para outro elemento', () => scenario('tecnico', async sql => {
  await denied(sql,s => s`update public.projeto_subelementos set elemento_id=${id(8)} where id=${id(9)} returning id`);
}));
test('Gestor: edita conteúdo na própria área, sem conceder acesso ou mover subelementos', () => scenario('gestor', async sql => {
  expect((await sql`update public.portfolios set nome='Alteração autorizada' where id=${id(3)} returning nome`)[0].nome).toBe('Alteração autorizada');
  await denied(sql,s => s`select public.ppm_alterar_acesso(${id(3)},'{"visibilidade":"publica"}'::jsonb)`);
  await denied(sql,s => s`update public.projeto_subelementos set elemento_id=${id(8)} where id=${id(9)} returning id`);
}));
test('Administrador/PMO: administra conteúdo e vínculos sem receber papel de IA', () => scenario('administrador_pmo', async sql => {
  expect((await sql`update public.projeto_subelementos set elemento_id=${id(8)} where id=${id(9)} returning elemento_id`)[0].elemento_id).toBe(id(8));
  expect((await sql`select public.ppm_tem_papel('ai_owner') as allowed`)[0].allowed).toBe(false);
}));
test('Conta inativa: bloqueia leitura e consulta compartilhada', () => scenario('tecnico', async (sql,user) => {
  await sql`reset role`;
  await sql`update public.ppm_usuarios set ativo=false where user_id=${user}`;
  await sql`set local role authenticated`;
  expect((await sql`select id from public.portfolios where id=${id(3)}`).length).toBe(0);
  await denied(sql,s => s`select public.ppm_snapshot()`);
}));

test('Técnico: pai privado bloqueia filhos mesmo com convite no filho', () => scenario('tecnico', async (sql,user) => {
  await sql`reset role`;
  await sql`update public.objetos_acesso set visibilidade='privada' where id=${id(3)}`;
  await sql`update public.objetos_acesso set convidados=${JSON.stringify([{usuarioId:user,nivel:'Editar tudo'}])}::jsonb where id=${id(6)}`;
  await sql`set local role authenticated`;
  expect((await sql`select id from public.projetos where id=${id(6)}`).length).toBe(0);
  expect((await sql`select id from public.projeto_elementos where id=${id(7)}`).length).toBe(0);
}));
test('Gestor: compartilhamento externo permite leitura, não edição', () => scenario('gestor', async sql => {
  await sql`reset role`;
  await sql`update public.objetos_acesso set visibilidade='compartilhada',compartilhado_com=ARRAY[${id(1)}::uuid] where id=${id(4)}`;
  await sql`set local role authenticated`;
  expect((await sql`select id from public.portfolios where id=${id(4)}`).length).toBe(1);
  await denied(sql,s => s`update public.portfolios set nome='Indevido' where id=${id(4)} returning id`);
}));
test('Técnico: não concede a si mesmo papel administrativo ou de IA', () => scenario('tecnico', async (sql,user) => {
  for (const role of ['administrador_pmo','ai_owner']) {
    await denied(sql,s => s`insert into public.ppm_papeis(user_id,papel) values(${user},${role}) returning id`);
  }
}));
test('Técnico: não grava configurações de IA diretamente', () => scenario('tecnico', async (sql,user) => {
  await denied(sql,s => s`insert into public.app_settings(id,config,updated_by) values('ai','{}',${user}) returning id`);
}));
