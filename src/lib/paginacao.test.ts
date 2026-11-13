import { describe, expect, it } from "vitest";
import { paginar } from "./paginacao";
const itens = Array.from({ length: 45 }, (_, i) => i);
describe("paginar", () => {
  it("mostra 20 por página", () => expect(paginar(itens, 1, 20).itens).toHaveLength(20));
  it("última página traz o resto", () => expect(paginar(itens, 3, 20).itens).toEqual([40, 41, 42, 43, 44]));
  it("página além do fim volta à última", () => expect(paginar(itens, 9, 20).pagina).toBe(3));
  it("lista vazia tem uma página", () => expect(paginar([], 1, 20).totalPaginas).toBe(1));
});
