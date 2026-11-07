import { gerarPedido, proximoId, ID_INICIAL } from "../src/pedido.js";

const agora = new Date("2026-10-29T15:30:00.000Z");

describe("gerarPedido", () => {
  test("deve gerar um pedido corretamente", () => {
    const carrinho = [{ id: 1, nome: "Espresso", preco: 6.5, quantidade: 2 }];
    const pedido = gerarPedido(carrinho, "Pix");
    expect(pedido.formaPagamento).toBe("Pix");
    expect(pedido.subtotal).toBe(13);
    expect(pedido.taxa).toBe(0.65);
    expect(pedido.total).toBe(13.65);
  });

  test("deve possuir todos os campos exigidos", () => {
    const carrinho = [{ id: 1, nome: "Espresso", preco: 6.5, quantidade: 1 }];
    const pedido = gerarPedido(carrinho, "Dinheiro");
    expect(Object.keys(pedido).sort()).toEqual(["data", "formaPagamento", "id", "itens", "subtotal", "taxa", "total"]);
  });

  test("deve reproduzir o exemplo do laboratório", () => {
    const carrinho = [
      { id: 2, nome: "Cappuccino Italiano", preco: 12.9, quantidade: 2 },
      { id: 3, nome: "Bolo de Chocolate", preco: 12.9, quantidade: 1 }
    ];
    const pedido = gerarPedido(carrinho, "Pix", { agora });
    expect(pedido).toEqual({
      id: 1001,
      data: "2026-10-29T15:30:00.000Z",
      itens: carrinho,
      subtotal: 38.7,
      taxa: 1.94,
      total: 40.64,
      formaPagamento: "Pix"
    });
  });

  test("deve usar o próximo id a partir dos pedidos existentes", () => {
    const carrinho = [{ id: 1, nome: "Espresso", preco: 6.5, quantidade: 1 }];
    const pedido = gerarPedido(carrinho, "Pix", { pedidos: [{ id: 1001 }, { id: 1005 }] });
    expect(pedido.id).toBe(1006);
  });

  test("deve registrar a data informada em formato ISO", () => {
    const carrinho = [{ id: 1, nome: "Espresso", preco: 6.5, quantidade: 1 }];
    expect(gerarPedido(carrinho, "Pix", { agora }).data).toBe(agora.toISOString());
  });

  test("não deve compartilhar referências com o carrinho", () => {
    const carrinho = [{ id: 1, nome: "Espresso", preco: 6.5, quantidade: 1 }];
    const pedido = gerarPedido(carrinho, "Pix");
    pedido.itens[0].quantidade = 99;
    expect(carrinho[0].quantidade).toBe(1);
  });

  test("deve lançar erro com carrinho vazio", () => {
    expect(() => gerarPedido([], "Pix")).toThrow("carrinho");
  });

  test("deve lançar erro sem forma de pagamento", () => {
    const carrinho = [{ id: 1, nome: "Espresso", preco: 6.5, quantidade: 1 }];
    expect(() => gerarPedido(carrinho, "")).toThrow("pagamento");
  });
});

describe("proximoId", () => {
  test("deve começar em 1001 quando não houver pedidos", () => {
    expect(proximoId([])).toBe(ID_INICIAL);
    expect(ID_INICIAL).toBe(1001);
  });

  test("deve incrementar o maior id existente", () => {
    expect(proximoId([{ id: 1003 }, { id: 1001 }, { id: 1002 }])).toBe(1004);
  });
});
