# Café & Código

Sistema web de cafeteria em HTML5, CSS3 e JavaScript puro (módulos ES), desenvolvido com TDD seguindo o laboratório "Café & Código".

## Como executar

```
npm install
npm test
npm start
```

Depois abra `http://localhost:8080`. O cardápio é carregado com `fetch()`, por isso o projeto precisa ser servido por HTTP (não funciona abrindo o `index.html` direto pelo sistema de arquivos).

## Estrutura

```
cafeteria-tdd/
├── index.html
├── style.css
├── app.js
├── package.json
├── TDD.md
├── data/
│   └── produtos.json
├── src/
│   ├── moeda.js
│   ├── produtos.js
│   ├── carrinho.js
│   ├── pedido.js
│   ├── relatorio.js
│   ├── storage.js
│   └── ui.js
└── tests/
    ├── produtos.test.js
    ├── carrinho.test.js
    ├── pedido.test.js
    ├── relatorio.test.js
    └── storage.test.js
```

- `src/` (exceto `ui.js` e `storage.js`) contém regras de negócio puras, testáveis sem navegador.
- `src/storage.js` isola o `localStorage`.
- `src/ui.js` concentra toda a manipulação do DOM.
- `app.js` conecta estado, regras, armazenamento e interface.

## Regras implementadas

- Busca por nome ou descrição, sem diferenciar maiúsculas/minúsculas nem acentos.
- Filtro por categoria (Todos, Bebidas quentes, Bebidas frias, Pães, Bolos).
- Carrinho com itens consolidados e controle de quantidade (quantidade 0 remove o item).
- Subtotal = soma de preço × quantidade.
- Taxa de serviço = 5% do subtotal, limitada a R$ 10,00.
- Total = subtotal + taxa.
- Carrinho persistido em `cafeteria_carrinho`; pedidos em `cafeteria_pedidos`.
- Finalização gera pedido (id, data, itens, subtotal, taxa, total, formaPagamento), salva, limpa o carrinho e exibe mensagem de sucesso.
- Desafios extras: histórico "Meus pedidos" e "Resumo das vendas".

O pagamento é apenas uma simulação acadêmica; nenhum dado bancário real é solicitado.
