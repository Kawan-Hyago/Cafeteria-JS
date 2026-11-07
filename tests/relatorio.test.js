import { gerarRelatorio } from "../src/relatorio.js";
import { formatarMoeda, arredondar } from "../src/moeda.js";

const produtos = [
  { id: 1, nome: "Espresso", categoria: "Bebidas quentes" },
  { id: 2, nome: "Bolo de Cenoura", categoria: "Bolos" },
  { id: 3, nome: "Pão na Chapa", categoria: "Pães" }
];

const pedidos = [
  { id: 1001, total: 20, itens: [{ id: 1, nome: "Espresso", preco: 6.5, quantidade: 3 }] },
  { id: 1002, total: 10.5, itens: [{ id: 2, nome: "Bolo de Cenoura", preco: 11.9, quantidade: 1 }, { id: 1, nome: "Espresso", preco: 6.5, quantidade: 1 }] },
  { id: 1003, total: 7.75, itens: [{ id: 3, nome: "Pão na Chapa", preco: 7.5, quantidade: 1 }] }
];

describe("gerarRelatorio", () => {
  test("deve contar os pedidos", () => {
    expect(gerarRelatorio(pedidos, produtos).totalPedidos).toBe(3);
  });

  test("deve somar o faturamento", () => {
    expect(gerarRelatorio(pedidos, produtos).faturamento).toBe(38.25);
  });

  test("deve calcular o ticket médio", () => {
    expect(gerarRelatorio(pedidos, produtos).ticketMedio).toBe(12.75);
  });

  test("deve identificar o produto mais vendido", () => {
    expect(gerarRelatorio(pedidos, produtos).produtoMaisVendido).toBe("Espresso");
  });

  test("deve identificar a categoria mais vendida", () => {
    expect(gerarRelatorio(pedidos, produtos).categoriaMaisVendida).toBe("Bebidas quentes");
  });

  test("deve retornar valores neutros quando não houver pedidos", () => {
    expect(gerarRelatorio([], produtos)).toEqual({
      totalPedidos: 0,
      faturamento: 0,
      ticketMedio: 0,
      produtoMaisVendido: null,
      categoriaMaisVendida: null
    });
  });

  test("deve ignorar itens sem categoria conhecida no cálculo de categoria", () => {
    const resultado = gerarRelatorio(pedidos, []);
    expect(resultado.categoriaMaisVendida).toBeNull();
    expect(resultado.produtoMaisVendido).toBe("Espresso");
  });
});

describe("moeda", () => {
  test("deve formatar valores em reais", () => {
    expect(formatarMoeda(40.64)).toMatch(/R\$\s?40,64/);
    expect(formatarMoeda(1287.5)).toMatch(/R\$\s?1\.287,50/);
  });

  test("deve arredondar para duas casas", () => {
    expect(arredondar(1.005)).toBe(1.01);
    expect(arredondar(0.1 + 0.2)).toBe(0.3);
  });
});
