// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function quantidadeNoCarrinho(carrinho, produtoId) {
  return carrinho.filter((produto) => produto.id === produtoId).length
}

export function podeAdicionarAoCarrinho(carrinho, produto) {
  if (!produto) return false

  const estoque = Number(produto.estoque ?? 0)
  if (estoque <= 0) return false

  return quantidadeNoCarrinho(carrinho, produto.id) < estoque
}

export function removerUmaUnidadeCarrinho(carrinho, produtoId) {
  const indice = carrinho.findIndex((produto) => String(produto.id) === String(produtoId))

  if (indice === -1) {
    return carrinho
  }

  return [...carrinho.slice(0, indice), ...carrinho.slice(indice + 1)]
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => total + Number(produto.price), 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => String(item.produto.id) === String(produto.id))
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
