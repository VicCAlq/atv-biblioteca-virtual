//  SEÇÃO: # 0. SOBRE ESTE ARQUIVO ################################################

/**
 * @author Victor Cavalcanti (www.github.com/VicCAlq) <victor.mca.dev@gmail.com>
 * @license MIT
 * @copyright Victor Cavalcanti 2025
 *
 * @file Este arquivo compreende o JavaScript utilizado no cliente.
 * Vocês encontrarão diversos comentários como este ao longo do código explicando 
 * cada parte. Leiam com atenção e no seu tempo.
 *
 * Os comentários explicativos são direcionados a alunos do ensino médio.
 * A linguagem busca ser o menos técnica o possível, portanto algumas das
 * explicações são superficiais, ou usam analogias imperfeitas.
 */



//  SEÇÃO: # 1. CLASSE DOS ITENS DA BIBLIOTECA ####################################

/**
 * @class Personagem
 *
 * Esta é a classe criada para representar os objetos que desejamos armazenar
 * no banco de dados, que por sua vez é gerenciado pelo servidor.
 *
 * Neste exemplo, temos uma classe para criação de personagens, que contém as
 * propriedades a seguir:
 *
 * `nome`: Nome do personagem. Texto simples.
 * `vida`: Pontos de vida. Número inteiro.
 * `classe`: Classe do personagem. Texto simples.
 * `nivel`: Nível do personagem. Número inteiro.
 * `ataque`: Ataque do personagem. Número inteiro.
 * `defesa`: Multiplicador de defesa do personagem. Número com casa decimal.
 * `ativo`: Valor para se o personagem está ativo ou não. Verdadeiro/Falso
 * `dataDeEntrada`: Data de quando o personagem foi adquirido. Objeto Date.
 * `desempenho`: Atribui uma nota para o personagem. Número com casa decimal.
 * `descricao`: Descrição de como o personagem funciona. Texto simples.
 * `melhorEquipe`: Lista de outros personagens que funcionam bem com este.
 */
class Personagem {
  /** Aqui no constructor colocamos as propriedades exigidas no preenchimento
   * de informações do personagem. Mesmo que os objetos da classe tenham mais
   * propriedades que essas, nos argumentos do constructor entram só os itens
   * que dependem de preenchimento na hora que o objeto é criado. */
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
    /** A sintaxe "variável || outro_valor" significa que caso a variável possua
     * um valor nulo ou indefinido (`null` ou `undefined`), o valor após a `||`
     * deve ser usado no lugar. Com isso, podemos escolher valores "padrão" para
     * as propriedades.
     *
     * No exemplo de `nome`, se no constructor eu não passar nenhum valor para
     * o nome, o valor preenchido será `Sem nome` */
    this.nome = nome || "Sem nome" 
    this.vida = vida || 100
    this.classe = classe || "Sem classe"
    this.nivel = nivel || 1
    this.ataque = ataque || 10
    this.defesa = defesa || 10
    this.ativo = ativo || false
    /** O comando `new Date()` cria um objeto de data a partir da data atual 
     * usando a classe `Date`. Para criar a partir de uma data específica, 
     * informamos como um texto dentro dos parênteses assim:
     * `new Date("2023-11-18")`
     * Sempre na ordem de "Ano-Mês-Dia". Também é possível informar um horário
     * específico, mas fica a seu cargo pesquisar como. Não será exigido
     * neste exercício. */
    this.dataDeEntrada = new Date(dataDeEntrada) || new Date()
    /** Estas três propriedades abaixo não foram solicitadas no constructor:
     * Neste caso, é por que eu escolhi que todos os personagens criados vão
     * ter estas propriedades preenchidas desta forma por padrão. */
    this.desempenho = null
    this.descricao = null
    this.melhorEquipe = []
  }
  
  /** Aqui temos nosso primeiro método: Um método para calcular há quantos dias
   * o personagem foi adquirido (seja completando missão para habilitar ele,
   * conseguindo em gacha, comprando com recursos do jogo, etc).
   *
   * A constante `divisorMilisegundos` é utilizada por que quando subtraímos
   * um objeto de `Date` do outro (para saber a diferença de tempo entre as duas
   * datas), esta conta é feita sempre em milisegundos. Por isso dividimos a
   * quantidade de milisegundos do resultado desta conta pela quantidade de
   * milisegundos em um dia (O valor da variável `divisorMilisegundos`).
   */
  tempoDesdeAquisicao() {
    /** Quantidade de milisegundos em um dia */
    const divisorMilisegundos = 24*60*60*1000
    /** Data atual menos a data de aquisição do personagem */
    let tempoDesdeAquisicao = new Date() - this.dataDeEntrada
    /** Usamos `Math.floor()` para arredondar o número de 
     * dias removendo casas decimais */
    tempoDesdeAquisicao = Math.floor(tempoDesdeAquisicao / divisorMilisegundos)
    /** Entregamos o resultado da conta toda aqui */
    return tempoDesdeAquisicao
  }

  /** Atribui uma nota para o desempenho do personagem, de 0 a 10. Se a nota
   * for menor que zero, atribuímos zero, e se for maior que 10, atribuímos 10 */
  avaliar(desempenho) {
    /** Aqui decidi usar `switch/case` ao invés de `if/else` apenas para fins
     * de demonstração de como funciona em comparação ao if/else */
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

  /** Atribui uma descrição para o personagem, e impede que a descrição seja
   * atribuída caso ela tenha menos de 20 caracteres */
  descrever(descricao) {
    if (descricao.length < 20) {
      window.alert("A descrição deve ter pelo menos 20 caracteres")
    } else {
      this.descricao = descricao
    }
  }

  /** Este é um método para listar outros personagens que funcionam bem com este,
   * e então armazenamos estes nomes em uma lista */
  adicionarEquipe(personagem) {
      this.melhorEquipe = this.melhorEquipe || []
      this.melhorEquipe.push(personagem)
  }
}



//  SEÇÃO: # 2. CONSTANTES ESSENCIAIS PARA O SITE #################################

/** Estas variáveis abaixo serão utilizadas diversas vezes ao longo de nossa
 * aplicação, portanto já as definimos aqui:
 *
 * - ENDERECO_BASE: É o endereço por onde nosso aplicativo se comunica com o
 *                  servidor, que no arquivo do servidor foi definido como
 *                  `/api/biblioteca`
 * - biblioteca: Corresponde a `div` com o ID `main` no nosso HTML. É onde vamos
 *               jogar os itens de nossa biblioteca para serem exibidos.
 * - bibliotecaItens: É uma lista que começa vazia, e é onde os itens da
 *                    biblioteca que recebemos do servidor serão armazenados
 *                    antes de serem exibidos na biblioteca.
 * - formulario: Corresponde ao elemento `form` em nosso HTML, ao qual
 *               associamos o ID `formulario`.
 * - idItemEditado: Quando estivermos editando algum item da biblioteca (que 
 *                  implementaremos futuramente), o ID deste item será armazenado
 *                  nesta variável.
 */
const ENDERECO_BASE = "/api/biblioteca"
const biblioteca = document.getElementById("main");
const bibliotecaItens = [] // Colchetes vazios
const formulario = document.getElementById("formulario");
let idItemEditado = null;



//  SEÇÃO: # 3. FUNÇÕES QUE LIDAM COM O CONTEÚDO DO SITE ##########################

/**
 * Esta é a função que cuida de exibir um único item na tela. O `return` no final 
 * da função envia um "texto interpolado": Quando criamos um texto com crase (`) 
 * ao invés de áspas simples ou duplas, podemos inserir `variáveis` e `expressões` 
 * no meio do texto. 
 * Vamos conferir como as duas variáveis abaixo serão usadas no meio do texto:
 *
 * let exemplo = 123
 * let expressao = 456 - exemplo
 *
 * Nos textos abaixo, o que está dentro do ${} é computado e jogado dentro do
 * texto na posição do ${}:
 *
 * `O valor de exemplo é ${exemplo}`
 * se torna:
 * "O valor de exemplo é 123"
 *
 * `O valor da expressão é ${expressao}`
 * se torna:
 * "O valor da expressão é 333" (resultado de 456 - 123)
 *
 * Também poderíamos fazer diretamente assim:
 * `O valor da expressão é ${456 - exemplo}`
 * E o resultado seria o mesmo.
 *
 * Esta função "mostrarItem" vai retornar conteúdo HTML escrito como texto comum
 * aqui no JavaScript, mas quando for posicionado no HTML por outra função, vai
 * ser transformado em um elemento na página.
 */
function mostrarItem(item) {
  /** DICA: Algumas das "interpolações" no texto abaixo são apenas para fins de
   *  adicionar comentários no meio do código */

  /** Inicialmente, pegamos as propriedades do item recebido pela função (se
   * trata dos itens enviados pelo servidor que estão armazenados no banco
   * de dados), e re-criamos o objeto utilizando a classe que criamos acima. */
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

  /** As linhas a seguir servem para processar e aplicar os valores de 
   * "desempenho", "descrição" e "melhorEquipe" que eu criei na classe de exemplo
   * deste projeto. Na implementação de vocês eles ainda não estão sendo
   * utilizados (serão usados quando implementarmos a funcionalidade de "editar"
   * itens já existentes). */
  if (item.desempenho) { personagem.avaliar(item.desempenho) }
  if (item.descricao) { personagem.descrever(item.descricao) }
  /** Este terceiro é um pouco diferente, pois como se trata de uma lista de 
   * itens, pode ocorrer alguma conversão indesejada no meio da comunicação
   * entre cliente e servidor. Isso se dá quando na hora que o objeto enviado
   * pelo cliente é processado pela biblioteca que interage com o banco de
   * dados: Ela converte uma lista vazia em um objeto, e este é armazenado
   * no banco de dados como o texto "[object Object]" 
   *
   * Sim, se trata de um bug. Sim, a gente lida com essas coisas eventualmente
   * no dia-a-dia. Sim, as vezes precisa de uma solução feia :( */
  if (item.melhorEquipe) {
    let equipe
    /** Só queremos ler a lista de melhorEquipe se ela não for o texto bugado */
    if (item.melhorEquipe !== "[object Object]") {
      /** JSON.parse() vai converter o texto representando a lista pra uma lista
       * de verdade em JavaScript válido */
      equipe = JSON.parse(item.melhorEquipe)
      /** Para cada item da lista, chamamos o método `adicionarEquipe` do 
       * personagem criado pela classe para inserir o item na lista */
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
      ${/** Na parte abaixo da "Data de aquisição, estamos tratando a
         * formatação da data, que vem no formato `Date`:
         * 1. Convertemos a data em um texto no formato:
         *    "dia/mês/ano, hora:minuto:segundo" 
         * 2. Separamos o texto em duas partes a partir da vírgula
         * 3. Ficamos só com a primeira parte contendo a data */""}
      <p>Data de aquisição: 
      ${personagem.dataDeEntrada
          .toLocaleString()
          .split(",")[0]
      }</p>
      ${"" /** Na linha abaixo, tempoDesdeAquisicao precisa dos parênteses para
      que o método seja executado e seu resultado seja calculado. */}
      <p>Tempo desde aquisição: ${personagem.tempoDesdeAquisicao()} dias</p>
      ${/** A sintaxe abaixo de "variavel ? resultado_1 : resultado_2 é 
         * similar a um "if/else", mas ao invés de ser um "bloco de código" como
         * o "if/else", se trata de uma expressão, e portanto podemos utilizar 
         * no meio de textos usando ${}
         *
         * Na linha onde temos ${personagem.desempenho ? valor_1 : valor_2}, 
         * o que o código quer dizer é: "se personagem.desempenho não for um 
         * valor nulo, exiba o que vem entre ? e :, senão exiba o que 
         * vem depois do : " */""}
      ${personagem.desempenho // Se personagem.desempenho NÃO for nulo...
        ? "<p>Desempenho: " + personagem.desempenho + "</p>" //...Exiba isso
        : "" // Senão, se personagem.desempenho FOR nulo, não exiba nada.
      }
      ${personagem.melhorEquipe.length > 0 
        // Se personagem.melhorEquipe acima tiver algum item...
        ? "<p>Melhores parceiros/as: " + personagem.melhorEquipe + "</p>" 
        //...Exiba a linha acima...
        : "" // ... Caso contrário, não exiba nada.
      }
      ${personagem.descricao // E aqui você já deve saber como funciona 🙂
        ? "<p>Descrição: " + personagem.descricao + "</p>" 
        : "" 
      }
      ${/** Na div abaixo temos o botão de apagar o item da biblioteca.
         * Para a função que apaga o item `removerItem` precisa do ID
         * do item da biblioteca para apagá-lo, e este ID não é armazenado
         * no objeto criado pela classe, usamos o ID vindo diretamente do
         * valor enviado pelo servidor, acessado pelo `item` passado como
         * argumento para esta função `mostrarItem`
      */""}
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

/**
 * Esta função recebe no argumento "itens" uma lista dos itens da biblioteca
 * (que são adquiridos em outra função mais abaixo). `mostrarBiblioteca` por sua
 * vez vai:
 *
 * 1. Criar uma variável que vai armazenar conteúdo HTML (`listaDeItens`)
 * 2. Percorrer esta lista, e para cada item dela vai chamar a função
 *    `mostrarItem` escrita acima.
 * 3. Adicionar na variável `listaDeItens` o resultado de cada vez que 
 *    `mostrarItem` é chamado.
 * 4. Adicionar todo o conteúdo HTML gerado nos passos anteriores na `div main`
 *    de nossa biblioteca, oonde os itens de nossa biblioteca são exibidos.
 */
function mostrarBiblioteca(itens) {
  esconderCarregamento()
  let listaDeItens = ""

  /** `forEach` é outra forma de fazer um laço de repetição, onde a sintaxe é:
   * `lista.forEach((itemDaLista) => {
   *   o_que_fazer_com_cada_item_da_lista
   * })`
   *
   * Neste caso, para cada `item` da lista `itens` recebida como argumento da
   * função, chamamos a função `mostrarItem` com este item, e o conteúdo HTML
   * obtido é anexado ao texto `listaDeItens`
   */
  itens.forEach((item) => {
    listaDeItens += mostrarItem(item)
  })
  
  /** Aqui colocamos todo o HTML gerado em `listaDeItens` para dentro da
   * div da biblioteca que terá nossa lista de itens */
  biblioteca.innerHTML = listaDeItens
}

/**
  * Função que mostra uma mensagem de erro quando ocorre algum erro no cliente
  * ou no servidor. Ela armazena uma "div" dedicada a exibir mensagens de erro
  * em uma variável, adiciona o conteúdo da mensagem de erro, e muda a 
  * propriedade "display" do CSS deste elemento para exibí-lo na tela.
  *
  * Após 5 segundos, chama a função `esconderErro` para ocultar 
  * a mensagem de erro
  */
function mostrarErro(mensagemErro) {
  const divErro = document.getElementById("erro")
  divErro.textContent = mensagemErro
  divErro.style.display = "block"

  setTimeout(() => { esconderErro()}, 5000)
}

/**
  * Armazena a div dedicada a exibir mensagens de erro em uma variável e muda
  * a propriedade "display" do CSS dela para "none", ocultando a div.
  */
function esconderErro() {
  document.getElementById("erro").style.display = "none"
}

/**
 * Função que modifica o CSS do elemento HTML com o ID "carregamento" para
 * torná-lo visível, e oculta a div "main" da biblioteca.
 */
function mostrarCarregamento() {
  document.getElementById("carregamento").style.display = "block"
  biblioteca.style.display = "none"
}

/**
 * Função que modifica o CSS do elemento HTML com o ID "carregamento" para
 * ocultá-lo, e exibe a div "main" da biblioteca como um grid de itens.
 */
function esconderCarregamento() {
  document.getElementById("carregamento").style.display = "none"
  biblioteca.style.display = "grid"
}



//  SEÇÃO: # 4. FUNÇÕES QUE LIDAM COM O COMPORTAMENTO DO SITE #####################

/**
  * Apaga todo o conteúdo preenchido no formulário, deixando todos os campos
  * em branco
  */
function limparFormulario() { 
  formulario.reset()
}

/**
  * Esta é uma função `assíncrona`: significa que a execução dela é realizada em
  * segundo plano caso alguma outra coisa aconteça enquanto esta função ainda 
  * não tiver sido finalizada. Esta função faz quatro coisas:
  *
  * 1. Envia uma mensagem para o servidor na rota `/api/biblioteca` armazenada
  *    na variável `ENDERECO_BASE`. O conteúdo desta mensagem é um objeto que
  *    contém:
  *    - method: Tipo da mensagem enviada (GET, POST, PUT, DELETE).
  *    - headers: Formato da mensagem (aqui é um texto no formato JSON).
  *    - body: O conteúdo da mensagem, que aqui é um texto gerado a partir
  *            do novo item gerado por nossa classe.
  * 2. Aguarda a resposta do servidor com o resultado ou uma possível mensagem
  *    de erro: Por isso usamos o `await` aqui: Estamos `waiting` (aguardando)
  *    a resposta do servidor.
  * 3. Verifica se o servidor enviou algum erro.
  * 4. Limpa o que estava preenchido no formulário e recarrega a lista de itens
  *    da biblioteca.
  */
async function adicionarItem(dadosItem) {
  /** Aqui fazemos o passo 1 acima */
  const resposta = await fetch(ENDERECO_BASE, {
    /** O método `POST` é o que envia um novo item para o servidor */
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    /** A linha abaixo é a que contém o novo item criado pela nossa classe */
    body: JSON.stringify(dadosItem)
  })

  /** Verificação de erro do passo 3 */
  if (!resposta.ok) { throw new Error("Falha em adicionar item a biblioteca") }

  /** As duas linhas abaixo são o passo 4 */
  limparFormulario()
  carregarItens()
}

/**
  * AVISO: Modifiquei esta função da última aula para cá, para melhorar o
  *       funcionamento, fazer mais uso de nossa classe e diminuir a repetição.
  *
  * Esta função, assim como a de cima, também é assíncrona e faz diversas coisas,
  * vamos a uma lista do que ocorre em cada etapa:
  *
  * 1. Armazenamos as informações preenchidas no formulário em uma variável
  *    chamada `dadosFormulário`, que é um objeto do tipo `FormData` (que contém
  *    as coisas preenchidas no formulário em um formato "propriedade: valor").
  * 2. Cria uma lista vazia `propriedadesNovoPersonagem` que vai armazenar os
  *    valores do formulário para serem usados na criação de um objeto usando
  *    nossa classe.
  * 3. Percorre as propriedades do formulário, e adiciona estas propriedades
  *    na lista do passo anterior.
  * 4. Cria um objeto usando nossa classe e passando os valores armazenados
  *    na lista `propriedadesNovoPersonagem`.
  * 5. Chama a função `adicionarItem` que criamos acima e passsa para ela o
  *    objeto gerado por nossa classe, para que ele seja enviado para o servidor.
  * 6. Se o passo 5 acima falhar, mostra uma mensagem de erro.
  */
async function enviarFormulario() {
  /** Aqui criamos o objeto do tipo `FormData` com os dados preenchidos no
   * formulário. Para acessarmos estes dados, a propriedade `name` PRECISA
   * estar preenchida no HTML, desta forma:
   * 
   * <input type="text" id="input-nome" name="input-nome"/>
   *                                     ^ Esta propriedade é obrigatória!
   */ 
  const dadosFormulario = new FormData(formulario)

  /** Lista que vai armazenar os valores do formulário */
  let propriedadesNovoPersonagem = []

  /** O loop abaixo funciona da seguinte forma:
    *
    * 1. Para acessarmos a lista de propriedade-valor do formulário, usamos
    *    o método `entries()` no objeto `dadosFormulario`. Ele entrega uma
    *    lista de "mini-listas". Estas "mini-listas" são cada uma uma lista
    *    com dois valores: ["propriedade", "valor"]. Ambos os valores SEMPRE 
    *    vêm como textos, independente de serem números, booleanos, etc.
    *    Exemplo:
    *    `dadosFormulario.entries()` = [
    *      ["nome", "Belarmino"],
    *      ["idade", "25"],         --> Note que vem como texto
    *      ["curso", "Geografia"],
    *      ["matriculado", "true"]  --> Também vem como texto
    *    ]
    * 2. Portanto, ao criarmos a variável que vai acessar cada item da lista,
    *    ao invés de usarmos `let item`, criamos duas variáveis de uma vez:
    *    Uma para o input (o campo do formulário) e outra para o valor
    *    preenchido neste formulário.
    *    `let [input, valor]` cria as variáveis `input` e `valor` de uma vez só.
    * 3. Procuramos por alguns valores específicos (os que NÃO devem ser usados
    *    como texto, como "quantidade", "idade", "data", etc). Essa busca é
    *    feita a partir do nome do input (valor da propriedade `name` no HTML)
    * 4. Se encontramos algum destes inputs do passo 3, convertemos o valor
    *    que foi preenchido para o tipo que desejamos:
    *    - parseInt(valor) converte o valor para número inteiro
    *    - parseFloat(valor) converte o valor para número com casa decimal
    *    - new Date(valor) cria um objeto de data a partir do valor
    * 5. Esta conversão é feita APENAS se o valor tiver sido preenchido no
    *    formulário, para isso usamos a sintaxe:
    *    valor ? parseInt(valor) : null
    *    Que é lida da seguinte forma:
    *    `valor` existe ? Se sim, converta `valor` para inteiro : Se não, nada
    * 6. Por fim, anexamos o valor na lista `propriedadesNovoPersonagem`
    */
  for (let [input, valor] of dadosFormulario.entries()) {
    /** Aqui abaixo, caso o input contenha a palavra "vida", "nivel" ou "ataque",
      * converto o valor preenchido neste input para número inteiro */
    if( input.includes("vida") || input.includes("nivel") || input.includes("ataque")) { 
      valor = valor ? parseInt(valor) : null 
    }
    /** Aqui abaixo, caso o input contenha a palavra "defesa", converto o valor 
     * preenchido neste input para número com casa decimal */
    if(input.includes("defesa")) { valor = valor ? parseFloat(valor) : null }

    if(input.includes("ativo")) { 
      console.log("ativo = " + valor)
      valor = valor // === "on" ? true : false 
    }
    /** Aqui abaixo, caso o input contenha a palavra "entrada", converto o valor 
     * preenchido neste input para um objeto do tipo `Date` */
    if(input.includes("entrada")) { valor = valor ? new Date(valor) : null }
    /** Por fim, anexamos o valor a lista citada. Se o input não corresponder a 
     * nenhum dos tipos procurados acima, o valor é armazenado do mesmo jeito que
     * veio. Se ele foi convertido, é armazenado do jeito que foi convertido */ 
    propriedadesNovoPersonagem.push(valor)
  }

  /** Aqui criamos nosso novo objeto usando nossa classe com apenas uma linha :D
   * Esta sintaxe `...nomeDaLista` significa que estamos "abrindo o conteúdo" 
   * desta lista, no caso do exemplo abaixo, é equivalente a fazer o seguinte:
   * new Personagem(
   *  propriedadesNovoPersonagem[0],
   *  propriedadesNovoPersonagem[1],
   *  propriedadesNovoPersonagem[2],
   *  propriedadesNovoPersonagem[3], ...
   *  até o último item da lista.
   * )
   */

  console.log("propriedadesNovoPersonagem")
  console.log(propriedadesNovoPersonagem)
  const personagem = new Personagem(...propriedadesNovoPersonagem)
  console.log("personagem")
  console.log(personagem)

  /** Por fim, executamos os passos 5 e 6 desta função (descrição acima do
   * nome dela: `enviarFormulario`) */
  try {
    await adicionarItem(personagem)
  } catch (erro) {
    mostrarErro("Falha em adicionar item: " + erro.message)
  }
}

/**
 * A função abaixo, `carregarItens` se comunica com o servidor usando o método
 * `GET` para pedir o envio de todos os itens da biblioteca armazenados no banco
 * de dados. Vamos conferir o passo a passo do que ela faz:
 *
 * 1. Chamando `mostrarCarregamento`, ela exibe uma mensagem de que está 
 *    carregando os itens da biblioteca.
 * 2. Após isso, chama a função que oculta qualquer possível mensagem de erro
 *    que esteja sendo exibida.
 * 3. Dentro do bloco de `try-catch`, nós usamos a função `fetch` apenas com o
 *    endereço base: Quando não passamos um objeto de mensagem, por padrão já é
 *    inferdo que se trata de uma mensagem de `GET`.
 * 4. Jogamos o resultado de `await fetch` para uma variável `resposta`.
 * 5. Conferimos se dentro da resposta consta uma propriedade `ok`. Se ela NÃO
 *    existir, enviamos um erro.
 * 6. Se `resposta.ok` existir, convertemos o conteúdo da resposta para o formato
 *    JSON. Usamos `await` neste caso mesmo sem conexão com o servidor para que
 *    o aplicativo não fique travado enquanto faz essa conversão.
 * 7. Após a conversão, enviamos os itens da biblioteca recebidos na variável
 *    `resposta` para a função `mostrarBiblioteca`, que cuida de exibir os itens
 *    no nosso site.
 * 8. No bloco de `catch`, apenas tratamos algum erro em obter os itens da 
 *    biblioteca.
 */
async function carregarItens() {
  /** Mostramos uma mensagem de carregamento */
  mostrarCarregamento()
  /** Ocultamos mensagem de erro */
  esconderErro()

  try {
    /** Passos 3 e 4 da descrição acima */
    const resposta = await fetch(ENDERECO_BASE)
    console.log("carregarItens resposta")
    console.log(resposta)
    /** Passo 5 da descrição acima */
    if (!resposta.ok) {
      throw new Error("Falha em receber os itens da biblioteca.")
    }

    /** Passo 6 da descrição acima */
    const resultado = await resposta.json()
    console.log("carregarItens resultado")
    console.log(resultado)
    /** Passo 7 da descrição acima */
    mostrarBiblioteca(resultado.data || [])
    /** Passo 8 da descrição acima */
  } catch (erro) {
    mostrarErro("Falha em carregar itens da biblioteca: " + erro.message)
  }
}

/**
 * A função abaixo, `removerItem`, recebe um ID equivalente aos valores na coluna
 * `ID` do banco de dados, e então se comunica com o servidor usando o método
 * `DELETE` para pedir a remoção de um item específico armazenado no banco de
 * dados, correspondente ao ID recebido. 
 * Vamos conferir o passo a passo do que ela faz:
 *
 * 1. Antes de mais nada, exibimos um "pop-up" (janelinha) pedindo para o usuário
 *    confirmar se ele quer mesmo remover o item solicitado ou não. Se o usuário
 *    clicar em "Não"/"Cancelar", a função é encerrada sem fazer nada
 * 2. Dentro do bloco de `try-catch`, usamos `await fetch` para enviar para a
 *    rota `/api/biblioteca/numero_do_item` uma mensagem com o método `DELETE`.
 *    Esta mensagem é a solicitação para apagar o item com o ID correspondente.
 * 3. O resultado que o servidor mandar para a mensagem acima é armazenado
 *    na variável `resposta`
 * 4. Conferimos se dentro da resposta consta uma propriedade `ok`. Se ela NÃO
 *    existir, enviamos um erro dizendo que não foi possível apagar o item.
 * 5. Se `resposta.ok` existir, chamamos a função `carregarItens` para recarregar
 *    os itens da biblioteca, removendo do site o item apagado.
 * 6. No bloco de `catch`, apenas tratamos algum erro em obter os itens da 
 *    biblioteca.
 */
async function removerItem(id) {
  /** Passo 1 da descrição acima */
  let confirmacao = confirm("Deseja mesmo remover este item?")
  if (!confirmacao) { return }

  try {
  /** Passos 2 e 3 da descrição acima */
    const resposta = await fetch(`${ENDERECO_BASE}/${id}`, {
      method: "DELETE",
    })

  /** Passo 4 da descrição acima */
    if (!resposta.ok) { throw new Error("Falha em remover item da biblioteca")}

  /** Passo 5 da descrição acima */
    carregarItens()
  /** Passo 6 da descrição acima */
  } catch (erro) {
    mostrarErro("Falha em remover item: " + erro.message)
  }
}



//  SEÇÃO: # 5. COMPORTAMENTO INICIAL DO SITE #####################################

/**
  * A função `inicializar` abaixo realiza algumas configurações finais em alguns
  * elementos HTML da página, que só podem ser feitos após o JavaScript deste
  * arquivo ser carregado.
  */
function inicializar() {
  /** Aqui adicionamos em todos os eventos de `submit` (envio de formulário)
    * a execução das funções abaixo */
  formulario.addEventListener("submit", (evento) => {
    /** `preventDefault()` é um método existente em `eventos` HTML. Ele impede
      * que o evento execute seu comportamento padrão: no caso de um evento de
      * envio de formulário, `preventDefault()` impede que a página seja
      * recarregada */
    evento.preventDefault()
    /** Chamamos a função `enviarFormulário` quando o formulário é enviado. */
    enviarFormulario()
  })

  /** Adicionamos ao botão de recarregar a lista de itens a execução da função
    * `carregarItens`, para que ela possa executar seu objetivo */
  document.getElementById("input-recarregar").addEventListener("click", () => {
    carregarItens()
  })

  /** Adicionamos ao botão de limpar o formulário a execução da função
    * `limparFormulario`, para que ela possa executar seu objetivo */
  document.getElementById("input-cancelar").addEventListener("click", () => {
    limparFormulario()
  })

  /** Aqui mandamos carregar a lista de itens quando o site inicializar */
  carregarItens()
}

/** Por fim, chamamos a função `inicializar` acima, para que ela execute seu 
  * código */
inicializar()
