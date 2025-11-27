class Personagem {
  constructor(
    nome, 
    classe,
    vida,
    nivel,
    ataque,
    defesa,
    dataDeEntrada,
    ativo
  ) {
    this.nome = nome || "Sem nome" 
    this.vida = vida || 100
    this.classe = classe || "Sem classe"
    this.nivel = nivel || 1
    this.ataque = ataque || 10
    this.defesa = defesa || 10
    this.ativo = ativo || false
    this.dataDeEntrada = new Date(dataDeEntrada) || new Date()
    this.desempenho = null
    this.descricao = null
    this.melhorEquipe = []
  }
  
  tempoDesdeAquisicao() {
    const divisorMilisegundos = 24*60*60*1000
    let tempoDesdeAquisicao = new Date() - this.dataDeEntrada
    tempoDesdeAquisicao = Math.floor(tempoDesdeAquisicao / divisorMilisegundos)
    return tempoDesdeAquisicao
  }

  avaliar(desempenho) {
    switch (desempenho) {
      case desempenho < 0:
        this.desempenho = 0
        break;
      case desempenho > 10:
        this.desempenho = 10
        break;
      default:
        this.desempenho = desempenho
        break;
    }
  }

  descrever(descricao) {
    if (descricao.length < 20) {
      window.alert("A descrição deve ter pelo menos 20 caracteres")
    } else {
      this.descricao = descricao
    }
  }

  adicionarEquipe(personagem) {
      this.melhorEquipe = this.melhorEquipe || []
      this.melhorEquipe.push(personagem)
  }
}

const ENDERECO_BASE = "/api/biblioteca"
const biblioteca = document.getElementById("main");
const bibliotecaItens = [] // Colchetes vazios
const formulario = document.getElementById("formulario");
let idItemEditado = null;

function mostrarItem(item) {
  const personagem = new Personagem(
    item.nome,
    item.classe,
    item.vida,
    item.nivel,
    item.ataque,
    item.defesa,
    item.dataDeEntrada,
    item.ativo,
  )

  if (item.desempenho) { personagem.avaliar(item.desempenho) }
  if (item.descricao) { personagem.descrever(item.descricao) }
  if (item.melhorEquipe) {
    let equipe
    if (item.melhorEquipe !== "[object Object]") {
      equipe = JSON.parse(item.melhorEquipe)
      equipe.forEach((integrante) => {
        personagem.adicionarEquipe(integrante)
      })
    }
  }

  return `
    <div 
      style="
        border: 2px gold solid; 
        padding: 10px 30px; 
        margin: 10px 0; 
        border-radius: 20px;
      "
    >
      <p>Nome: ${personagem.nome}</p>
      <p>Classe: ${personagem.classe}</p>
      <p>Vida total: ${personagem.vida}</p>
      <p>Nível: ${personagem.nivel}</p>
      <p>Ataque: ${personagem.ataque}</p>
      <p>Defesa: ${personagem.defesa}</p>
      <p>Ativo/a: ${personagem.ativo ? "Sim" : "Não"}</p>
      <p>Data de aquisição: 
      ${personagem.dataDeEntrada
          .toLocaleString()
          .split(",")[0]
      }</p>
      <p>Tempo desde aquisição: ${personagem.tempoDesdeAquisicao()} dias</p>
      ${personagem.desempenho
        ? "<p>Desempenho: " + personagem.desempenho + "</p>"
        : ""
      }
      ${personagem.melhorEquipe.length > 0 
        ? "<p>Melhores parceiros/as: " + personagem.melhorEquipe + "</p>" 
        : ""
      }
      ${personagem.descricao
        ? "<p>Descrição: " + personagem.descricao + "</p>" 
        : "" 
      }
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

function mostrarBiblioteca(itens) {
  esconderCarregamento()
  let listaDeItens = ""

  itens.forEach((item) => {
    listaDeItens += mostrarItem(item)
  })
  
  biblioteca.innerHTML = listaDeItens
}

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
}

function limparFormulario() { 
  formulario.reset()
}

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

  let propriedadesNovoPersonagem = []

  for (let [input, valor] of dadosFormulario.entries()) {
    if( input.includes("vida") || input.includes("nivel") || input.includes("ataque")) { 
      valor = valor ? parseInt(valor) : null 
    }
    if(input.includes("defesa")) { valor = valor ? parseFloat(valor) : null }
    if(input.includes("entrada")) { valor = valor ? new Date(valor) : null }
    propriedadesNovoPersonagem.push(valor)
  }

  const personagem = new Personagem(...propriedadesNovoPersonagem)

  try {
    await adicionarItem(personagem)
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
