<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use semantic Liquid Glass tokens and translucent shared surfaces globally; this keeps light/dark themes consistent and avoids one-off visual styling.
- Keep the governance assistant available globally as a right-side floating panel while retaining its dedicated threaded route for long sessions.
- Visibilidade por área (perfil × escopo) centralizada em src/lib/acesso.ts (useCarteiraVisivel); telas nunca leem a carteira bruta para listar/somar — garante que listas, busca e KPIs respeitem o acesso.
- A marca do produto é Keller Hub; a organização continua personalizável e independente da marca do produto.
- Project work items and contextual updates live in the persistent project-work store and inherit the parent project's effective access, keeping execution details aligned with area governance.
- Authentication is enforced globally through Lovable Cloud, while administrative roles stay in a separate RLS-protected role table to prevent client-side privilege escalation.
- The sign-in presentation reads the shared portal identity settings, while authentication providers remain explicit and unavailable providers cannot be selected.
- AI engine settings are persisted server-side and can only be changed by the designated AI owner after current-password confirmation, so provider configuration never trusts browser storage or general administrative roles.
- Load the global governance assistant after the primary interface becomes idle; this keeps AI dependencies out of the critical rendering path.
