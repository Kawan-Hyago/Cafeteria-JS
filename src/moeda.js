export const arredondar = valor => Math.round((valor + Number.EPSILON) * 100) / 100;

const formatadorBRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatarMoeda = valor => formatadorBRL.format(valor);
