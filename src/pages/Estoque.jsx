const STORAGE_KEY = 'techstore-lista-espera'

// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos }) {
  const listaEspera = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const listaPorProduto = listaEspera.reduce((acumulador, item) => {
    (acumulador[String(item.id)] ??= []).push({ nome: item.nome, email: item.email })
    return acumulador
  }, {})

  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Lista de espera</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => {
              const interessados = listaPorProduto[String(produto.id)] || []

              return (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                    {produto.estoque > 0 && produto.estoque < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                  <td>
                    {interessados.length === 0 ? (
                      <span className="texto-secundario">Nenhum</span>
                    ) : (
                      <ul className="lista-espera">
                        {interessados.map((interessado, index) => (
                          <li key={`${produto.id}-${interessado.email}-${index}`}>
                            <strong>{interessado.nome}</strong>
                            <span>{interessado.email}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
