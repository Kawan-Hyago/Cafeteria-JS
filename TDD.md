# Registro do ciclo TDD

Cada bloco abaixo segue o ciclo exigido: TESTE → FALHA → IMPLEMENTAÇÃO → TESTE PASSANDO → REFACTOR.

## Rodada 1 — RED

Os cinco arquivos de teste foram escritos antes de qualquer arquivo em `src/`.

```
FAIL tests/carrinho.test.js   Cannot find module '../src/carrinho.js'
FAIL tests/produtos.test.js   Cannot find module '../src/produtos.js'
FAIL tests/pedido.test.js     Cannot find module '../src/pedido.js'
FAIL tests/storage.test.js    Cannot find module '../src/storage.js'
FAIL tests/relatorio.test.js  Cannot find module '../src/relatorio.js'
Test Suites: 5 failed, 5 total
Tests:       0 total
```

## Rodada 1 — GREEN

Implementação mínima de `moeda.js`, `produtos.js`, `carrinho.js`, `storage.js`, `pedido.js` e `relatorio.js`.

```
Test Suites: 5 passed, 5 total
Tests:       82 passed, 82 total
```

## Rodada 1 — REFACTOR

- `arredondar` estava duplicada (em `carrinho.js` e `moeda.js`): mantida apenas em `moeda.js` e importada onde necessário.
- Valores mágicos da taxa extraídos para `TAXA_PERCENTUAL` e `TAXA_MAXIMA`.
- `ID_INICIAL` extraído em `pedido.js`.
- Testes executados novamente: 82 passando.

## Cobertura por regra

| Regra | Funções | Arquivo de teste |
| --- | --- | --- |
| 1. Pesquisa | `buscarProdutos` | `produtos.test.js` |
| 2. Categoria | `filtrarPorCategoria` | `produtos.test.js` |
| Carga do cardápio | `carregarProdutos` | `produtos.test.js` |
| 3. Carrinho | `adicionarAoCarrinho` | `carrinho.test.js` |
| 4. Quantidade | `alterarQuantidade`, `removerDoCarrinho` | `carrinho.test.js` |
| 5. Subtotal | `calcularSubtotal` | `carrinho.test.js` |
| 6. Taxa | `calcularTaxa` | `carrinho.test.js` |
| 7. Total | `calcularTotal` | `carrinho.test.js` |
| 8. LocalStorage | `salvarCarrinho`, `carregarCarrinho`, `salvarPedidos`, `carregarPedidos` | `storage.test.js` |
| 9. Pedido | `gerarPedido` | `pedido.test.js` |
| Relatório | `gerarRelatorio` | `relatorio.test.js` |

## Casos extremos cobertos

- `calcularSubtotal([])` retorna 0.
- `removerDoCarrinho(carrinho, 999)` mantém o carrinho.
- `alterarQuantidade(carrinho, 1, 0)` remove o item.
- `buscarProdutos(produtos, "hambúrguer")` retorna `[]`.
- `calcularTaxa(0)` retorna 0.
- JSON corrompido no `localStorage` retorna lista vazia.
- Pedido com carrinho vazio ou sem forma de pagamento lança erro.

## Checklist de refatoração (seção 34 do laboratório)

1. Funções com uma única responsabilidade: sim.
2. Trechos duplicados: removidos (`arredondar`).
3. Valores mágicos: extraídos para constantes.
4. Nomes claros: sim.
5. Armazenamento separado das regras: `storage.js`.
6. DOM separado das regras: `ui.js` e `app.js`.
7. Funções testáveis sem navegador: sim (somente `storage.js` usa `localStorage`, simulado pelo jsdom).
8. Casos extremos testados: sim.
9. Carrinho alterado de forma previsível: funções imutáveis, com testes que garantem isso.
10. Funciona após atualizar a página: o carrinho é carregado do `localStorage` na inicialização.
