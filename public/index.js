class Jogo {
  constructor(
    nome, 
    anoLancamento, 
    desenvolvedor, 
    plataforma, 
    genero, 
    jogadores, 
    jogadoresRegistrados
  ) {
    this.nome = nome
    this.anoLancamento = anoLancamento || 0
    this.desenvolvedor = desenvolvedor || "Desconhecido"
    this.plataforma = plataforma || "Não informado"
    this.genero = genero || "Não informado"
    this.jogadores = jogadores || 1
    this.jogadoresRegistrados = jogadoresRegistrados || "Sem jogadores cadastrados"
  }
  
  tempoDeLancamento(anoAtual) {
    return anoAtual - this.anoLancamento
  }
  avaliar(nota) {
    this.nota = nota
  }
  descrever(descricao) {
    if (descricao.length < 100) {
      console.log("A descrição deve ter pelo menos 100 caracteres")
    } else {
      this.descricao = descricao
    }
  }
  // Método a escolha de vocês!
  cadastrarJogadores(jogador) {
    this.jogadores = this.jogadores || []
    this.jogadores.push(jogador)
  }
}

function mostrarItem(item) {
  return `
    <div style="border: 2px gold solid; padding: 10px 30px; margin: 10px 0; border-radius: 20px;">
      <p>Nome do jogo: ${item.nome}</p>
      <p>Ano de Lançamento: ${item.ano_lancamento}</p>
      <p>Desenvolvedor: ${item.desenvolvedor}</p>
      <p>Gênero: ${item.genero}</p>
      <p>Plataforma: ${item.plataforma}</p>
      <p>Quantidade de Jogadores: ${item.jogadores}</p>
      <p>Jogadores Registrados: ${item.jogadores_registrados}</p>
      <div style="display: flex; flex-direction: row;">
        <button 
          id="deletar-${item.id}"
          onclick="removerItem(${item.id})"
          class="apagar"
        >Apagar</button>
      </div>
    </div>
  `
}

const ENDERECO_BASE = "/api/biblioteca"
const biblioteca = document.getElementById("main");
const bibliotecaItens = [] // Colchetes vazios
const formulario = document.getElementById("formulario");
let idItemEditado = null;

function limparFormulario() { formulario.reset() }

async function adicionarItem(dadosItem) {
  const resposta = await fetch(ENDERECO_BASE, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(dadosItem)
  })

  if (!resposta.ok) { throw new Error("Falha em adicionar item a biblioteca") }

  limparFormulario()
  carregarItens()
}

async function enviarFormulario() {
  const dadosFormulario = new FormData(formulario)
  const dadosItem = {
    nome: dadosFormulario.get("input-nome"),
    ano_lancamento: dadosFormulario.get("input-ano")
      ? parseInt(dadosFormulario.get("input-ano"))
      : null,
    desenvolvedor: dadosFormulario.get("input-desenvolvedor") || null,
    genero: dadosFormulario.get("input-genero") || null,
    plataforma: dadosFormulario.get("input-plataforma") || null,
    jogadores: dadosFormulario.get("input-jogadores")
      ? parseInt(dadosFormulario.get("input-jogadores"))
      : null,
    jogadores_registrados: dadosFormulario.get("input-registrados") || null,
  }

  console.log(dadosItem)

  if (!dadosItem.nome.trim()) {
    mostrarErro("Nomear o item é obrigatório.")
    return;
  }

  try {
    await adicionarItem(dadosItem)
  } catch (erro) {
    mostrarErro("Falha em adicionar item: " + erro.message)
  }
}

async function carregarItens() {
  mostrarCarregamento()
  esconderErro()

  try {
    const resposta = await fetch(ENDERECO_BASE)
    if (!resposta.ok) {
      throw new Error("Falha em receber os itens da biblioteca.")
    }

    const resultado = await resposta.json()
    mostrarBiblioteca(resultado.data || [])
  } catch (erro) {
    mostrarErro("Falha em carregar itens da biblioteca: " + erro.message)
  }
}

function mostrarBiblioteca(itens) {
  esconderCarregamento()
  let listaDeItens = ""

  console.log(itens)

  itens.forEach((item) => {
    listaDeItens += mostrarItem(item)
  })
  
  biblioteca.innerHTML = listaDeItens
}

async function removerItem(id) {
  let confirmacao = confirm("Deseja mesmo remover este item?")
  if (!confirmacao) { return }

  try {
    const resposta = await fetch(`${ENDERECO_BASE}/${id}`, {
      method: "DELETE",
    })

    if (!resposta.ok) { throw new Error("Falha em remover item da biblioteca")}

    carregarItens()
  } catch (erro) {
    mostrarErro("Falha em remover item: " + erro.message)
  }
}

/**
  * @param {string} mensagemErro 
  */
function mostrarErro(mensagemErro) {
  const divErro = document.getElementById("erro")
  divErro.textContent = mensagemErro
  divErro.style.display = "block"

  setTimeout(() => { esconderErro()}, 5000)
}

function esconderErro() {
  document.getElementById("erro").style.display = "none"
}

function mostrarCarregamento() {
  document.getElementById("carregamento").style.display = "block"
  biblioteca.style.display = "none"
}

function esconderCarregamento() {
  document.getElementById("carregamento").style.display = "none"
  biblioteca.style.display = "grid"
  biblioteca.style.gridTemplateColumns = "repeat(2, 1fr)"
  biblioteca.style.gridGap = "0px 20px"
}

function inicializar() {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault()
    enviarFormulario()
  })

  document.getElementById("input-recarregar").addEventListener("click", () => {
    carregarItens()
  })

  document.getElementById("input-cancelar").addEventListener("click", () => {
    limparFormulario()
  })

  carregarItens()
}

inicializar()
