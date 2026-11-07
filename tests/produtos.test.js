import { readFileSync } from "node:fs";
import { buscarProdutos, filtrarPorCategoria, carregarProdutos } from "../src/produtos.js";

const catalogo = [
  { id: 1, nome: "Cappuccino", descricao: "Café cremoso", preco: 12, categoria: "Bebidas quentes" },
  { id: 2, nome: "Bolo de Chocolate", descricao: "Bolo macio", preco: 10, categoria: "Bolos" },
  { id: 3, nome: "Iced Latte", descricao: "Espresso e leite gelado, cremoso", preco: 14, categoria: "Bebidas frias" },
  { id: 4, nome: "Pão de Queijo", descricao: "Assado na hora", preco: 7, categoria: "Pães" }
];

describe("buscarProdutos", () => {
  test("deve encontrar produtos pelo nome", () => {
    const resultado = buscarProdutos(catalogo, "cappuccino");
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe("Cappuccino");
  });

  test("deve encontrar pelo nome ignorando maiúsculas e minúsculas", () => {
    expect(buscarProdutos(catalogo, "CAPPUCCINO")).toHaveLength(1);
  });

  test("deve encontrar pela descrição", () => {
    const resultado = buscarProdutos(catalogo, "cremoso");
    expect(resultado.map(p => p.nome)).toEqual(["Cappuccino", "Iced Latte"]);
  });

  test("deve retornar array vazio quando nada for encontrado", () => {
    expect(buscarProdutos(catalogo, "pizza")).toEqual([]);
    expect(buscarProdutos(catalogo, "hambúrguer")).toEqual([]);
  });

  test("deve ignorar acentos na busca", () => {
    expect(buscarProdutos(catalogo, "cafe")).toHaveLength(1);
    expect(buscarProdutos(catalogo, "PÃO")).toHaveLength(1);
  });

  test("deve retornar todos os produtos quando o termo estiver vazio", () => {
    expect(buscarProdutos(catalogo, "")).toHaveLength(4);
    expect(buscarProdutos(catalogo, "   ")).toHaveLength(4);
    expect(buscarProdutos(catalogo, undefined)).toHaveLength(4);
  });

  test("não deve alterar o array original", () => {
    const copia = [...catalogo];
    buscarProdutos(catalogo, "bolo");
    expect(catalogo).toEqual(copia);
  });
});

describe("filtrarPorCategoria", () => {
  test("deve retornar somente bebidas quentes", () => {
    const resultado = filtrarPorCategoria(catalogo, "Bebidas quentes");
    expect(resultado).toHaveLength(1);
    expect(resultado.every(p => p.categoria === "Bebidas quentes")).toBe(true);
  });

  test("deve retornar somente bebidas frias", () => {
    const resultado = filtrarPorCategoria(catalogo, "Bebidas frias");
    expect(resultado.every(p => p.categoria === "Bebidas frias")).toBe(true);
    expect(resultado).toHaveLength(1);
  });

  test("deve retornar somente pães", () => {
    const resultado = filtrarPorCategoria(catalogo, "Pães");
    expect(resultado.every(p => p.categoria === "Pães")).toBe(true);
    expect(resultado).toHaveLength(1);
  });

  test("deve retornar somente bolos", () => {
    const resultado = filtrarPorCategoria(catalogo, "Bolos");
    expect(resultado.every(p => p.categoria === "Bolos")).toBe(true);
    expect(resultado).toHaveLength(1);
  });

  test("deve retornar todos quando a categoria for Todos", () => {
    expect(filtrarPorCategoria(catalogo, "Todos")).toHaveLength(4);
  });

  test("deve retornar array vazio para categoria inexistente", () => {
    expect(filtrarPorCategoria(catalogo, "Pizzas")).toEqual([]);
  });
});

describe("carregarProdutos", () => {
  test("deve carregar o cardápio usando fetch", async () => {
    const fetchFalso = async () => ({ ok: true, json: async () => catalogo });
    const resultado = await carregarProdutos("./data/produtos.json", fetchFalso);
    expect(resultado).toEqual(catalogo);
  });

  test("deve lançar erro quando a resposta não for bem-sucedida", async () => {
    const fetchFalso = async () => ({ ok: false, status: 404 });
    await expect(carregarProdutos("./x.json", fetchFalso)).rejects.toThrow();
  });
});

describe("data/produtos.json", () => {
  const dados = JSON.parse(readFileSync(new URL("../data/produtos.json", import.meta.url), "utf8"));

  test("deve conter exatamente 50 produtos", () => {
    expect(dados).toHaveLength(50);
  });

  test("deve respeitar a distribuição por categoria", () => {
    const contagem = categoria => filtrarPorCategoria(dados, categoria).length;
    expect(contagem("Bebidas quentes")).toBe(13);
    expect(contagem("Bebidas frias")).toBe(12);
    expect(contagem("Pães")).toBe(13);
    expect(contagem("Bolos")).toBe(12);
  });

  test("deve ter ids únicos e todos os campos obrigatórios", () => {
    expect(new Set(dados.map(p => p.id)).size).toBe(50);
    dados.forEach(p => {
      expect(typeof p.nome).toBe("string");
      expect(typeof p.descricao).toBe("string");
      expect(typeof p.foto).toBe("string");
      expect(typeof p.preco).toBe("number");
      expect(typeof p.categoria).toBe("string");
    });
  });

  test("a busca por café deve retornar os produtos esperados", () => {
    const nomes = buscarProdutos(dados, "café").map(p => p.nome);
    ["Espresso Clássico", "Espresso Duplo", "Café com Leite", "Café com Canela", "Iced Coffee", "Frapê de Café", "Bolo de Café"]
      .forEach(nome => expect(nomes).toContain(nome));
  });
});
