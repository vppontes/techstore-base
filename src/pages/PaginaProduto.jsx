import { useState } from 'react'
import { Link, useParams } from 'react-router'

const STORAGE_KEY = 'techstore-lista-espera'

export default function PaginaProduto({ produtos, onAdicionar }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemInteresse, setMensagemInteresse] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('')

  function registrarInteresse(evento) {
    evento.preventDefault()

    const nomeFormatado = nome.trim()
    const emailFormatado = email.trim()
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFormatado)

    if (!nomeFormatado) {
      setTipoMensagem('erro')
      setMensagemInteresse('Informe seu nome para entrar na lista de espera.')
      return
    }

    if (!emailValido) {
      setTipoMensagem('erro')
      setMensagemInteresse('Informe um e-mail válido.')
      return
    }

    const listaEspera = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const jaRegistrado = listaEspera.some(
      (item) => item.id === produto.id && item.email.toLowerCase() === emailFormatado.toLowerCase(),
    )

    if (jaRegistrado) {
      setTipoMensagem('sucesso')
      setMensagemInteresse('Você já está na lista de espera deste produto.')
      return
    }

    listaEspera.push({
      id: produto.id,
      nome: nomeFormatado,
      email: emailFormatado.toLowerCase(),
      produto: produto.title,
      data: new Date().toISOString(),
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(listaEspera))
    setNome('')
    setEmail('')
    setTipoMensagem('sucesso')
    setMensagemInteresse('Cadastro realizado. Seu nome foi registrado na lista de espera.')
  }

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .filter((item) => Number(item.estoque ?? 0) > 0)
    .filter((item) => Number.isFinite(Number(item.price)) && Number(item.price) > 0)
    .slice(0, 4)

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          {produto.estoque === 0 && (
            <form className="form-notificacao" onSubmit={registrarInteresse}>
              <p className="alerta-estoque">Produto esgotado no momento.</p>

              <label htmlFor="nome-interesse" className="rotulo">
                Nome
              </label>
              <div className="campo-notificacao">
                <input
                  id="nome-interesse"
                  type="text"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  placeholder="Seu nome"
                  className="campo-email"
                />
              </div>

              <label htmlFor="email-interesse" className="rotulo">
                E-mail
              </label>
              <div className="campo-notificacao">
                <input
                  id="email-interesse"
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="seu@email.com"
                  className="campo-email"
                />
                <button type="submit" className="botao botao-secundario">
                  Registrar interesse
                </button>
              </div>

              {mensagemInteresse && (
                <p className={`mensagem-notificacao ${tipoMensagem}`}>{mensagemInteresse}</p>
              )}
            </form>
          )}

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={produto.estoque === 0}
          >
            Adicionar ao carrinho
          </button>

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
