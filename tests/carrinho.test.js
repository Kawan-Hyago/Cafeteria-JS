import {
  adicionarAoCarrinho,
  removerDoCarrinho,
  alterarQuantidade,
  calcularSubtotal,
  calcularTaxa,
  calcularTotal,
  contarItens,
  TAXA_MAXIMA
} from "../src/carrinho.js";

const espresso = { id: 1, nome: "Espresso", preco: 6.5 };
const cappuccino = { id: 2, nome: "Cappuccino Italiano", preco: 12.9 };
const bolo = { id: 3, nome: "Bolo de Chocolate", preco: 12.9 };

describe("adicionarAoCarrinho", () => {
  test("deve adicionar um produto ao carrinho", () => {
    const resultado = adicionarAoCarrinho([], espresso);
    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toEqual({ id: 1, nome: "Espresso", preco: 6.5, quantidade: 1 });
  });

  test("não deve criar outro item quando o produto já existe", () => {
    let carrinho = [];
    carrinho = adicionarAoCarrinho(carrinho, espresso);
    carrinho = adicionarAoCarrinho(carrinho, espresso);
    expect(carrinho).toHaveLength(1);
    expect(carrinho[0].quantidade).toBe(2);
  });

  test("deve manter itens distintos separados", () => {
    let carrinho = adicionarAoCarrinho([], espresso);
    carrinho = adicionarAoCarrinho(carrinho, cappuccino);
    expect(carrinho).toHaveLength(2);
  });

  test("não deve alterar o carrinho original", () => {
    const original = [{ ...espresso, quantidade: 1 }];
    const resultado = adicionarAoCarrinho(original, espresso);
    expect(original[0].quantidade).toBe(1);
    expect(resultado).not.toBe(original);
  });

  test("deve usar o nome como identificador quando o produto não tiver id", () => {
    const semId = { nome: "Café Coado", preco: 5 };
    let carrinho = adicionarAoCarrinho([], semId);
    carrinho = adicionarAoCarrinho(carrinho, semId);
    expect(carrinho).toHaveLength(1);
    expect(carrinho[0].quantidade).toBe(2);
  });

  test("não deve copiar campos extras do produto para o carrinho", () => {
    const completo = { ...espresso, descricao: "Intenso", foto: "x.png", categoria: "Bebidas quentes" };
    expect(Object.keys(adicionarAoCarrinho([], completo)[0]).sort()).toEqual(["id", "nome", "preco", "quantidade"]);
  });
});

describe("removerDoCarrinho", () => {
  test("deve remover um produto do carrinho", () => {
    const carrinho = [{ ...espresso, quantidade: 1 }];
    expect(removerDoCarrinho(carrinho, 1)).toHaveLength(0);
  });

  test("deve manter o carrinho quando o produto não existir", () => {
    const carrinho = [{ ...espresso, quantidade: 1 }];
    expect(removerDoCarrinho(carrinho, 999)).toEqual(carrinho);
  });

  test("não deve alterar o carrinho original", () => {
    const carrinho = [{ ...espresso, quantidade: 1 }];
    removerDoCarrinho(carrinho, 1);
    expect(carrinho).toHaveLength(1);
  });

  test("deve remover apenas o produto indicado", () => {
    const carrinho = [{ ...espresso, quantidade: 1 }, { ...cappuccino, quantidade: 2 }];
    const resultado = removerDoCarrinho(carrinho, 1);
    expect(resultado).toEqual([{ ...cappuccino, quantidade: 2 }]);
  });
});

describe("alterarQuantidade", () => {
  const criar = quantidade => [{ ...espresso, quantidade }];

  test("de 1 para 2", () => {
    expect(alterarQuantidade(criar(1), 1, 2)[0].quantidade).toBe(2);
  });

  test("de 2 para 5", () => {
    expect(alterarQuantidade(criar(2), 1, 5)[0].quantidade).toBe(5);
  });

  test("de 5 para 1", () => {
    expect(alterarQuantidade(criar(5), 1, 1)[0].quantidade).toBe(1);
  });

  test("de 1 para 0 remove o item", () => {
    expect(alterarQuantidade(criar(1), 1, 0)).toEqual([]);
  });

  test("quantidade negativa remove o item", () => {
    expect(alterarQuantidade(criar(3), 1, -2)).toEqual([]);
  });

  test("id inexistente mantém o carrinho", () => {
    expect(alterarQuantidade(criar(2), 999, 4)).toEqual(criar(2));
  });

  test("quantidade que não seja inteiro mantém o carrinho", () => {
    expect(alterarQuantidade(criar(2), 1, 1.5)).toEqual(criar(2));
    expect(alterarQuantidade(criar(2), 1, NaN)).toEqual(criar(2));
    expect(alterarQuantidade(criar(2), 1, "abc")).toEqual(criar(2));
  });

  test("não deve alterar o carrinho original", () => {
    const original = criar(2);
    alterarQuantidade(original, 1, 7);
    expect(original[0].quantidade).toBe(2);
  });
});

describe("calcularSubtotal", () => {
  test("deve calcular o subtotal", () => {
    const carrinho = [{ preco: 10, quantidade: 2 }, { preco: 15, quantidade: 1 }];
    expect(calcularSubtotal(carrinho)).toBe(35);
  });

  test("carrinho vazio deve retornar 0", () => {
    expect(calcularSubtotal([])).toBe(0);
  });

  test("deve calcular o exemplo do laboratório", () => {
    const carrinho = [{ ...cappuccino, quantidade: 2 }, { ...bolo, quantidade: 1 }];
    expect(calcularSubtotal(carrinho)).toBe(38.7);
  });

  test("deve evitar erros de ponto flutuante", () => {
    expect(calcularSubtotal([{ preco: 0.1, quantidade: 3 }])).toBe(0.3);
  });
});

describe("calcularTaxa", () => {
  test("taxa deve ser 5% do subtotal", () => {
    expect(calcularTaxa(100)).toBe(5);
  });

  test("taxa não pode ultrapassar 10 reais", () => {
    expect(calcularTaxa(500)).toBe(10);
    expect(calcularTaxa(300)).toBe(10);
    expect(TAXA_MAXIMA).toBe(10);
  });

  test("subtotal zero deve gerar taxa zero", () => {
    expect(calcularTaxa(0)).toBe(0);
  });

  test("subtotal negativo deve gerar taxa zero", () => {
    expect(calcularTaxa(-50)).toBe(0);
  });

  test("deve arredondar para duas casas decimais", () => {
    expect(calcularTaxa(38.7)).toBe(1.94);
  });

  test("deve atingir exatamente o limite com subtotal de 200", () => {
    expect(calcularTaxa(200)).toBe(10);
  });
});

describe("calcularTotal", () => {
  test("deve somar subtotal e taxa", () => {
    expect(calcularTotal(100, 5)).toBe(105);
  });

  test("deve retornar zero quando subtotal e taxa forem zero", () => {
    expect(calcularTotal(0, 0)).toBe(0);
  });

  test("deve calcular o exemplo do laboratório", () => {
    expect(calcularTotal(38.7, 1.94)).toBe(40.64);
  });
});

describe("contarItens", () => {
  test("deve somar as quantidades do carrinho", () => {
    const carrinho = [{ ...espresso, quantidade: 2 }, { ...cappuccino, quantidade: 3 }];
    expect(contarItens(carrinho)).toBe(5);
  });

  test("carrinho vazio deve retornar 0", () => {
    expect(contarItens([])).toBe(0);
  });
});
