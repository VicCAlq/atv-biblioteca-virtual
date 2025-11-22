//  INFO: #### SOBRE ESTE ARQUIVO ################################################

/**
 * @author Victor Cavalcanti (www.github.com/VicCAlq) <victor.mca.dev@gmail.com>
 * @license MIT
 * @copyright Victor Cavalcanti 2025
 *
 * @file Este arquivo compreende todo o servidor utilizado pela aplicação.
 * Vocês encontrarão diversos comentários como este ao longo do código explicando 
 * cada parte. Leiam com atenção e no seu tempo.
 *
 * Os comentários explicativos são direcionados a alunos do ensino médio.
 * A linguagem busca ser o menos técnica o possível, portanto algumas das
 * explicações são superficiais, ou usam analogias imperfeitas.
 */





//  INFO: #### SETUP (configuração inicial) ######################################

/**
 * As quatro linhas abaixo carregam algumas ferramentas e bibliotecas necessárias
 * e as armazenam em variáveis para que possamos utilizá-las ap longo do código:
 *
 * `express`: "Framework" (conjunto de ferramentas) para a criação do Servidor
 * `sqlite3`: Interface que permite acessar o banco de dados via JavaScript
 * `path`: Ferramenta interna do `Node` para manipulação de caminhos de arquivos
 *         e pastas no sistema
 * `cors`: Biblioteca para permitir que uma aplicação frontend tenha acesso aos
 *          recursos existentes no servidor que normalmente são restritos
 */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const { Database } = require('sqlite3');

/** Aqui criamos o nosso servidor "de fato" com o "express" e atribuímos a 
 * variável "app" para ele */
const app = express();
/** Configuramos a "porta" onde o cliente/frontend deve se conectar.
 *  Ela corresponde ao número que vem após `http://localhost:` */
const PORTA = process.env.PORT || 3000;

/**
 * Nas três linhas abaixo nós inicializamos algumas configurações utilizadas
 * pelo nosso servidor "express". Especificamente, realizamos o "cadastro" de
 * algumas ferramentas, também chamadas de "Middleware" (ferramentas do meio).
 * São assim chamadas por que atuam "no meio" da execução de alguma requisição.
 *
 * `app.use()` é a função que realiza o "cadastro" das ferramentas utilizadas 
 * pelo servidor em toda "requisição" escrita após o cadastro. Como estamos 
 * realizando este "cadastro" no começo do arquivo, estas ferramentas ficarão 
 * disponíveis e serão usadas para todas as requisições.
 */
/** `cors`: Ferramenta que permite que o cliente acesse recursos do servidor.
 *          É a mesma que importamos anteriormente */
app.use(cors());
/** `express.json`: Habilita a conversão de dados e valores para o formato 
 *                  JSON (JavaScript Object Notation), que corresponde a 
 *                  objetos JavaScript */
app.use(express.json());
/** `express.static`: Configura o servidor para enviar arquivos "estáticos".
 *                    Estes arquivos são os nossos HTML, CSS e JS do cliente*/
app.use(express.static(path.join(__dirname, 'public')));





//  INFO: #### BANCO DE DADOS ####################################################

/**
 * Aqui nós criamos um banco de dados utilizando a ferramenta `sqlite3` que
 * importamos no começo do arquivo. Esta ferramenta executa o programa "sqlite3"
 * e disponibiliza uma "interface" (instruções pré-definidas) para que possamos 
 * passar comandos e valores do JavaScript para o banco, que usa a linguagem SQL.
 *
 * `db`: Objeto que contém a conexão com nosso banco de dados. É criado como
 *       um objeto da classe `Database` (vide a sintaxe `new sqlite3.Database()`).
 *       Apenas usamos `new` para criar objetos a partir de uma classe.
 *       Esta classe exige dois argumentos para a criação da classe:
 *       - Nome do arquivo para o banco de dados, texto simples.
 *       - Uma "função anônima" (criada com a sintaxe `() => { }`). Estudaremos
 *         mais sobre funções anônimas mais para frente.
 * @type {Database} db
 */
const db = new sqlite3.Database('./biblioteca.db', (erro) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  /** 
   * Note o argumento `(erro)` na linha onde criamos o objeto `db`. Ele 
   * apenas é utilizado caso ocorra algum erro na execução do programa `sqlite`
   * ao tentar criar o arquivo `biblioteca.db`.
   *
   * Este bloco de código abaixo é usado para verificar por algum destes erros 
   * antes de criar o banco de fato.
   * 
   * O argumento `erro` se trata de um objeto que contém uma propriedade 
   * chamada `message`, contendo o conteúdo em texto do erro.
   */
  if (erro) {
    console.error('Erro ao abrir o banco de dados "biblioteca.db":', erro.message);
  } else {
    console.log('Conectado ao banco de dados SQLite3 "biblioteca.db"');
    
    /** 
     * No bloco abaixo, `run` é um `método` (função) existente no objeto `db`.
     * Ele serve para executar um comando do banco de dados em linguagem `SQL`.
     * Aqui usamos `run` para executar o comando a seguir:
     *
     * `CREATE TABLE IF NOT EXISTS Biblioteca ()`
     * "Crie a tabela Biblioteca se ela ainda não existir"
     *
     * Dentro dos parênteses nós informamos os `nomes das colunas` e os `tipos
     * de valores de cada coluna`.
     *
     * `id`: Coluna obrigatória. Registra a ordem de itens inseridos no banco.
     *
     * As outras colunas devem ser criadas de acordo com o tema da biblioteca.
     * No exemplo abaixo são:
     *
     * `nome`: Valor texto, nome do personagem.
     * `vida`: Valor numérico inteiro, são os pontos de vida do personagem.
     * `classe`: Valor texto, que tipo de personagem ele/ela é.
     * `nivel`: Valor numérico inteiro, o nível do personagem.
     * `ataque`: Valor numérico inteiro, dano do ataque.
     * `defesa`: Valor numérico real, multiplicador de defesa.
     * `ativo`: Valor booleano (verdadeiro/falso). Se está ativo no grupo.
     * `dataDeEntrada`: Valor texto, data em que entrou no grupo.
     *
     * Todas as colunas são criadas da mesma forma:
     * `nome_da_coluna TIPO PROPRIEDADES`
     *
     * O nome das colunas devem corresponder ao nome das propriedades dos objetos
     * criados pela classe na sua aplicação frontend.
     *
     * Os tipos das colunas que veremos são:
     * `TEXT`: Texto simples
     * `VARCHAR(número)`: Texto simples com tamanho limitado
     * `INTEER`: Número inteiro
     * `FLOAT`: Número real (com casa decimal)
     * `BOOLEAN`: Valor booleano (verdadeiro/falso)
     *
     * E as propriedades que usaremos são:
     * `NOT NULL`: Valor obrigatório.
     *
     * Após lerem as instruções acima, façam o pedido abaixo:
     * NOTE: Editem as propriedades dentro da instrução "db.run" para 
     * corresponderem as propriedades da classe que vocês criaram no frontend.
     * Modifiquem as colunas entre as linhas com o texto "FIX".
     */
    db.run(`CREATE TABLE IF NOT EXISTS Biblioteca (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ${""/* FIX: Editem a partir da linha abaixo, separando com vírgula */}
      nome TEXT NOT NULL,
      vida INTEGER,
      classe VARCHAR(100),
      nivel INTEGER,
      ataque INTEGER,
      defesa FLOAT,
      ativo BOOLEAN,
      dataDeEntrada VARCHAR(100)
      ${""/* FIX: Até aqui. A última linha NÃO PODE terminar com vírgula */}
    )`, (erro) => {
      /**
       * A função `run` que executou o comando do banco de dados acima
       * também requer dois argumentos:
       *
       * - O primeiro é o comando SQL que está escrito acima e você
       *   modificou para corresponder ao tema de sua biblioteca.
       * - O segundo é mais uma `função anônima` que recebe um `erro`.
       *
       * Essa função anônima existe justamente para tratarmos algum erro
       * que psosa ocorrer nessa etapa:
       */
      if (erro) {
        console.error('Erro ao criar a tabela "Biblioteca"', erro.message);
      } else {
        console.log('Tabela "Biblioteca" pronta!');
      }
    });
  }
}); /** WARN: Final da função anônima de criação do banco de dados */





//  INFO: #### CRIAÇÃO DAS ROTAS #################################################

/**
  * WARN: Uma descrição básica do que são as rotas:
  *
  * `Rotas` são a forma como o servidor/backend e o cliente/frontend se comunicam
  * entre si. Boa parte dessa comunicação segue o padrão de operações `CRUD`, que
  * representam as principais operações feitas por um banco de dados:
  * `C`reate, `R`ead, `U`pdate, `D`elete
  * 
  * As rotas em geral consistem de três partes principais:
  *
  * - Um `verbo/método HTTP`: Representa o `tipo` da comunicação, ou da operação
  *                           realizada entre o cliente e o servidor. Comumente
  *                           trabalhamos com os quatro tipos abaixo, apesar de 
  *                           não serem os únicos:
  *     1. `GET`: Método onde o cliente solicita dados para o servidor.
  *               É equivalente a operação `READ` (ler)
  *     2. `POST`: Método onde o cliente envia um dado novo para o servidor.
  *                É equivalente a operação `CREATE` (criar)
  *     3. `PUT`: Método onde o cliente envia para o servidor uma informação
  *               nova que deve substituir uma informação anterior.
  *               É equivalente a operação `UPDATE` (atualizar)
  *     4. `DELETE`: Método onde o cliente solicita ao servidor que uma
  *                  informação seja apagada. Mantém o mesmo nome no CRUD.
  * - Um `endereço`: Corresponde a parte do endereço do site que vem após
  *                  o endereço base (No nosso caso, o que vem depois de
  *                  `localhost:3000/`)
  * - Uma `instrução`: Dita o que fazer quando o endereço é acessado com o método
  *                  descrito. Em servidores `express`, se trata de uma `função
  *                  anônima`, que recebe os argumentos `req` (requisição) e 
  *                  `res` (resposta).
  *
  * Em aplicações `express`, as rotas são criadas da seguinte maneira:
  * `app.metodo('endereço', (req, res) => { instruções } )`
  *
  * Lembrando que `app` é a variável onde armazenamos o nosso servidor.
  *
  * Exemplo prático:
  * `app.get('/oi', (req, res) => { res.send('<h1>Oi, tudo bem?</h1>') })`
  * Ao acessar a rota `/oi` com o método `GET`, o servidor envia o conteúdo
  * HTML "<h1>Oi, tudo bem?</h1>" para o cliente.
  *
  * A variável abaixo só existe pra essa explicação aparecer quando você
  * passar o mouse em cima dela 🙂
  */
let instr_rotas = ""; console.log(instr_rotas);

// TIP:--------------------------------------------------------------------------

/**
  * INFO: Primeira rota: Solicitar todos os itens do banco de dados
  *
  * Aqui criamos nossa primeira rota: Utilizamos o método `GET` no endereço
  * `/api/biblioteca` e nas instruções da função anônima dizemos como o servidor
  * deve tratar essa solicitação. A função principal aqui é a de enviar para
  * o cliente todos os itens armazenados no banco de dados.
  */
app.get('/api/biblioteca', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  /** Comando `SQL` que vai ser executado pelo banco de dados.
   *  Nele, o asterisco (*) é um "apelido" para representar "todas as colunas"
   *  Traduzindo as instruções (não o inglês) temos: 
   *  "Me envie todas as colunas de tudo da tabela Biblioteca" */
  const sql = 'SELECT * FROM Biblioteca';
  
  /**
   * O método `all()` do banco de dados executa um comando SQL e retorna um
   * objeto contendo todos os valores retornados pelo comando SQL executado.
   * Ele requer os argumentos:
   * - Comando SQL: O comando SQL em texto a ser executado
   * - Parâmetros: Lista de valores para serem utilizados junto com o comando.
   *               Neste caso como não precisamos de nenhum parâmetro, enviamos
   *               uma lista vazia.
   * - Uma instrução: Uma função anônima que vai dizer o que fazer com o 
   *                  resultado ou com o possível erro.
   */
  db.all(sql, [], (erro, rows) => {
    /** GOTO: erro_400
     * Neste bloco "if-else" abaixo tratamos o erro:
     * `res.status(400).json({ error: erro.message })` consiste de duas 
     * instruções executadas em sequência, ambas enviadas como para o cliente
     * como `resultado` da requisição:
     * - `.status(400)`: Envia um código "400" para o cliente. Se trata de uma
     *                   numeração que comunica para o cliente o resultado da
     *                   comunicação entre cliente e servidor.
     *                   `400` representa erro na formação da requisição, que
     *                   significa que a mensagem que o cliente mandou contém
     *                   algum erro.
     * - `.json({ error: erro.message })`: Converte a mensagem de erro em um 
     *                   objeto JavaScript e envia para o cliente.
     *
     * O `return` vazio serve para encerrar a função e não fazer mais nada.
     */
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }

    /** GOTO: sucesso_get
     * Se não ocorrer um erro que execute o bloco de código acima, é executado
     * o código a seguir: `res.json(conteúdo)` envia o que é passado dentro
     * dos parênteses para o cliente, em formato JSON.
     *
     * Aqui estamos enviando um objeto que contém uma propriedade `message`
     * contendo o status da requisição, e na propriedade `data` as informações
     * que o cliente solicitou.
     */
    res.json({
      message: 'success',
      data: rows
    });
  });
}); /** WARN: Final da função anônima da rota de pedido de todos os itens */

// TIP:--------------------------------------------------------------------------

/**
  * INFO: Segunda rota: Solicitar um único item do banco de dados
  *
  * Esta é nossa segunda rota: Utilizamos o método `GET` no endereço
  * `/api/biblioteca/numero_do_id` e nas instruções da função anônima
  * dizemos como o servidor deve tratar essa solicitação. A função principal
  * aqui é a de enviar para o cliente um único item armazenado no banco de
  * dados de acordo com seu ID.
  */
app.get('/api/biblioteca/:id', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  /** Comando `SQL` que vai ser executado pelo banco de dados.
   *  Nele, o asterisco (*) é um "apelido" para representar "todas as colunas", e
   *  a interrogação (?) é um caractere que vai ser substituído pelo valor de
   *  uma variável na hora que executarmos a instrução.
   *
   *  Traduzindo as instruções (não o inglês) temos:
   *  "Me envie todas as colunas de tudo da tabela Biblioteca que tiver o 
   *  valor da coluna 'id' igual ao valor informado" */
  const sql = 'SELECT * FROM Biblioteca WHERE id = ?';

  /** O objeto `req` possui algumas propriedades dentro dele. Aqui utilizaremos
   * a propriedade `id` que fica dentro da propriedade `params` do objeto `req`.
   * Esta variável será o "ID" que substituirá a interrogação acima */
  const params = [req.params.id];

  /** 
   * TIP: Daí você se pergunta: "Não dava pra inserir a variável direto no texto
   * do comando SQL?"
   *
   * Sim, dava, com `SELECT * FROM Biblioteca WHERE id = ${req.params.id}`
   *
   * Mas em hipótese nenhuma devemos fazer isso, pois se trata de um risco de
   * segurança grave chamado `SQL Injection`, ou "Injeção de SQL".
   
   * Explicar sobre essa falha de segurança foge do escopo deste exercício, mas
   * fica o nome para quem quiser pesquisar.
   */
  
  /**
   * O método `get()` do banco de dados executa um comando SQL e retorna um
   * objeto contendo todos os valores retornados pelo comando SQL executado.
   * A diferença dele para o `all()` é que os valores retornados correspondem
   * apenas a uma única linha da tabela do banco de dados.
   *
   * Assim como o método `all()`, `get()` requer os argumentos:
   * - Comando SQL: O comando SQL em texto a ser executado
   * - Parâmetros: Lista de valores para serem utilizados junto com o comando.
   *               Neste caso o "id" dos parâmetros entra no lugar da 
   *               interrogação do comando SQL acima.
   * - Uma instrução: Uma função anônima que vai dizer o que fazer com o 
   *                  resultado ou com o possível erro.
   */
  db.get(sql, params, (erro, row) => {
    /** Exatamente a mesma verificação de erro desta seção da rota anterior.
     * Pesquise por "erro_400" para localizar a descrição deste erro. */
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    /** GOTO: erro_404
     * Aqui já estamos tratando de um erro diferente, mas o processo segue
     * exatamente igual, mudando apenas o código e a mensagem:
     * `404` é o código usado para quando algo não é encontrado, neste caso,
     * não foi encontrado nenhum item com o ID informado pelo cliente.
     */
    if (!row) {
      res.status(404).json({ error: 'Item não encontrado' });
      return;
    }
    /** Pesquise por "sucesso_get" aqui no código para encontrar a descrição. */
    res.json({
      message: 'success',
      data: row
    });
  });
}); /** WARN: Final da função anônima da rota de pedido de um único item */

// TIP:--------------------------------------------------------------------------

/**
  * INFO: Terceira rota: Receber um item do cliente para ser cadastrado
  *                      no banco de dados
  *
  * Aqui temos nossa terceira rota: Utilizamos o método `POST` no endereço
  * `/api/biblioteca` e nas instruções da função anônima dizemos como o servidor
  * deve tratar essa solicitação. A função principal aqui é a de receber um Item
  * enviado pelo cliente, e então enviar este item para o banco de dados.
  */
app.post('/api/biblioteca', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  /**
   * Aqui utilizamos o argumento `req` da função anônima.
   * Ele se trata de um objeto, e uma de suas propriedades é o objeto `body`.
   * `body` por sua vez contém as propriedades dos objetos criados pela classe
   * que você criou no cliente/frontend.
   *
   * NOTE: Editem os nomes das variáveis criadas abaixo para corresponderem
   * aos nomes das propriedades da classe criada no frontend.
   */
  const {
    // FIX: Editar os parâmetros da linha seguinte até...
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada
    // FIX: Até esta última linha acima.
  } = req.body;

  /** Pequena verificação de erro para que o servidor exija que o valor 
   * para a propriedade "nome" não seja nulo*/
  if (!nome) {
    /** Pesquise por "erro_400" para a descrição deste tipo de erro*/
    return res.status(400).json({ error: 'O nome é obrigatório' });
  }
  
  /** Comando `SQL` que vai ser executado pelo banco de dados.
   * Nele, o asterisco (*) é um "apelido" para representar "todas as colunas", e
   * as interrogações (?) são  caracteres que vão ser substituídos pelo valor
   * das variáveis armazenadas dentro de uma lista chamada "params".
   *
   * A quantidade de interrogações DEVE corresponder a quantidade de colunas
   * da tabela.
   *
   * Traduzindo as instruções (não o inglês) temos:
   * "Na tabela Biblioteca, insira nas colunas a seguir ( lista de colunas )
   * os valores (lista de valores na mesma ordem que a lista de colunas)"
   *
   * NOTE: Editem os nomes das variáveis criadas abaixo para corresponderem
   * aos nomes das propriedades da classe criada no frontend.
   */
  const sql = `INSERT INTO Biblioteca (
  ${""/* FIX: Editem a partir da linha abaixo, separando com vírgula */}
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada
  ${""/* FIX: Até aqui. A última linha NÃO PODE terminar com vírgula */}
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  /** Lista contendo os valores que entrarão no lugar das interrogações
   * quando o comando SQL acima for executado
   *
   * NOTE: Editem os nomes das variáveis criadas abaixo para corresponderem
   * aos nomes das propriedades da classe criada no frontend.
   */
  const params = [
    // FIX: Editar os parâmetros da linha seguinte até...
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada
    // FIX: Até esta última linha acima.
  ];

  /** GOTO: db_run
   * O método `run()` do banco de dados executa um comando SQL mas não retorna
   * nenhum dado, apenas um "apontador" para o próprio banco de dados para caso
   * seja de nosso interesse anexar mais comandos na sequência.
   *
   * Assim como o método `all()` e `get()`, `run()` requer os argumentos:
   * - Comando SQL: O comando SQL em texto a ser executado
   * - Parâmetros: Lista de valores para serem utilizados junto com o comando.
   *               Aqui nossos parâmetros são os valores informados pelo cliente
   *               para as propriedades do objeto novo criado.
   * - Uma instrução: Uma função anônima que vai dizer o que fazer com o 
   *                  resultado ou com o possível erro.
   */
  db.run(sql, params, function(erro) {
    /** Exatamente a mesma verificação de erro desta seção da rota anterior.
     * Pesquise por "erro_400" para localizar a descrição deste erro. */
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    /** GOTO: sucesso_post 
     * Se não ocorrer um erro que execute o bloco de código acima, é executado
     * o código a seguir: `res.json(conteúdo)` envia o que é passado dentro
     * dos parênteses para o cliente, em formato JSON.
     *
     * Aqui estamos enviando um objeto que contém uma propriedade `message`
     * contendo o status da requisição, e as propriedades `data` e `id` com o ID
     * do novo item criado no banco de dados.
     */
    res.json({
      message: 'Personagem adicionado com sucesso',
      data: { id: this.lastID },
      id: this.lastID
    });
  });
}); /** WARN: Final da função anônima da rota de criação de um item novo */

// TIP:--------------------------------------------------------------------------

/**
  * INFO: Quarta rota: Atualizar um item já existente no banco de dados
  *
  * Abaixo fica a quarta rota: Utilizamos o método `PUT` no endereço
  * `/api/biblioteca/numero_do_id` e nas instruções da função anônima dizemos
  * como o servidor deve tratar essa solicitação. A função principal aqui é a
  * de receber um Item enviado pelo cliente, e então usar as informações deste
  * item para atualizar um item já existente no banco de dados.
  */
app.put('/api/biblioteca/:id', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  /**
   * Aqui utilizamos o argumento `req` da função anônima.
   * Ele se trata de um objeto, e uma de suas propriedades é o objeto `body`.
   * `body` por sua vez contém as propriedades dos objetos criados pela classe
   * que você criou no cliente/frontend.
   *
   * NOTE: Editem os nomes das variáveis criadas abaixo para corresponderem
   * aos nomes das propriedades da classe criada no frontend.
   */
  const {
    // FIX: Editar os parâmetros da linha seguinte até...
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada
    // FIX: Até esta última linha acima.
  } = req.body;
  
  /** Comando `SQL` que vai ser executado pelo banco de dados.
   * Nele, o asterisco (*) é um "apelido" para representar "todas as colunas", e
   * as interrogações (?) são  caracteres que vão ser substituídos pelo valor
   * das variáveis armazenadas dentro de uma lista chamada "params".
   *
   * A quantidade de interrogações DEVE corresponder a quantidade de colunas
   * da tabela.
   *
   * Traduzindo as instruções (não o inglês) temos:
   *
   * "Na tabela Biblioteca, insira nas colunas a seguir ( lista de colunas )
   * os valores (lista de valores na mesma ordem que a lista de colunas)
   * APENAS para o item que tenha o ID igual ao valor informado."
   *
   * NOTE: Editem os nomes das variáveis criadas abaixo para corresponderem
   * aos nomes das propriedades da classe criada no frontend.
   */
  const sql = `UPDATE Biblioteca SET 
    ${""/* FIX: Editem a partir da linha abaixo, separando com vírgula */}
    nome = ?,
    vida = ?,
    classe = ?,
    nivel = ?,
    ataque = ?,
    defesa = ?,
    ativo = ?,
    dataDeEntrada = ?,
    ${""/* FIX: Apenas até a linha acima. */}
    WHERE id = ?`;
  /** Lista contendo os valores que entrarão no lugar das interrogações
   * quando o comando SQL acima for executado
   *
   * NOTE: Editem os nomes das variáveis criadas abaixo para corresponderem
   * aos nomes das propriedades da classe criada no frontend.
   */
  const params = [
    // FIX: Editar os parâmetros da linha seguinte até...
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada,
    // FIX: Até esta última linha acima. A linha abaixo permanece como está.
    req.params.id
  ];
  
  /**
   * Confira a explicação deste método procurando por "db_run"
   *
   * Assim como o método `all()` e `get()`, `run()` requer os argumentos:
   * - Comando SQL: O comando SQL em texto a ser executado
   * - Parâmetros: Lista de valores para serem utilizados junto com o comando.
   *               Aqui nossos parâmetros são os valores informados pelo cliente
   *               para as propriedades do objeto a ser atualizado, e seu ID.
   * - Uma instrução: Uma função anônima que vai dizer o que fazer com o 
   *                  resultado ou com o possível erro.
   */
  db.run(sql, params, function(erro) {
    /** Exatamente a mesma verificação de erro desta seção da rota anterior.
     * Pesquise por "erro_400" para localizar a descrição deste erro. */
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    /** Pesquise por "erro_404" para a descrição deste erro abaixo */
    if (this.changes === 0) {
      res.status(404).json({ error: 'Personagem não encontrado' });
      return;
    }
    /** GOTO: sucesso_put 
     * se não ocorrer um erro que execute o bloco de código acima, é executado
     * o código a seguir: `res.json(conteúdo)` envia o que é passado dentro
     * dos parênteses para o cliente, em formato json.
     *
     * aqui estamos enviando um objeto que contém uma propriedade `message`
     * contendo o status da requisição, a propriedade `data` contém o id do
     * item atualizado, e `changes` contém as mudanças realizadas no item.
     */
    res.json({
      message: 'Personagem atualizado com sucesso',
      data: { id: req.params.id },
      changes: this.changes
    });
  });
}); /** WARN: Final da função anônima da rota de atualização de um item */

// TIP:--------------------------------------------------------------------------

/**
  * INFO: Quinta rota: Apagar um item existente no banco de dados
  *
  * Segue aqui a quinta rota: Utilizamos o método `DELETE` no endereço
  * `/api/biblioteca/numero_do_id` e nas instruções da função anônima dizemos
  * como o servidor deve tratar essa solicitação. A função principal aqui é a
  * de apagar do banco de dados o item correspondente ao ID enviado pelo cliente.
  */
app.delete('/api/biblioteca/:id', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  /** Comando `SQL` que vai ser executado pelo banco de dados.
   *  Nele, o asterisco (*) é um "apelido" para representar "todas as colunas", e
   *  a interrogação (?) é um caractere que vai ser substituído pelo valor de
   *  uma variável na hora que executarmos a instrução.
   *
   *  Traduzindo as instruções (não o inglês) temos:
   *  Apague da tabela Biblioteca o item cujo ID seja igual ao valor informado */
  const sql = 'DELETE FROM Biblioteca WHERE id = ?';

  /** O objeto `req` possui algumas propriedades dentro dele. Aqui utilizaremos
   * a propriedade `id` que fica dentro da propriedade `params` do objeto `req`.
   * Esta variável será o "ID" que substituirá a interrogação acima */
  const params = [req.params.id];
  
  /**
   * Confira a explicação deste método procurando por "db_run"
   *
   * Assim como o método `all()` e `get()`, `run()` requer os argumentos:
   * - Comando SQL: O comando SQL em texto a ser executado
   * - Parâmetros: Lista de valores para serem utilizados junto com o comando.
   *               Nosso parâmetro aqui é o ID do objeto a ser apagado.
   * - Uma instrução: Uma função anônima que vai dizer o que fazer com o 
   *                  resultado ou com o possível erro.
   */
  db.run(sql, params, function(erro) {
    /** Pesquise por "erro_400" para localizar a descrição deste erro. */
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    /** Pesquise por "erro_404" para a descrição deste erro abaixo */
    if (this.changes === 0) {
      res.status(404).json({ error: 'Personagem não encontrado' });
      return;
    }
    /** GOTO: sucesso_delete 
     * se não ocorrer um erro que execute o bloco de código acima, é executado
     * o código a seguir: `res.json(conteúdo)` envia o que é passado dentro
     * dos parênteses para o cliente, em formato json.
     *
     * aqui estamos enviando um objeto que contém uma propriedade `message`
     * contendo o status da requisição e a propriedade `changes` contém as 
     * mudanças realizadas no banco de dados.
     */
    res.json({
      message: 'Personagem apagado com sucesso.',
      changes: this.changes
    });
  });
}); /** WARN: Final da função anônima da rota de remoção de um item */





//  INFO: #### INSTRUÇÕES FINAIS #################################################


/**
  * INFO: Sexta e última rota: A rota por onde o cliente acessa o site 🙂
  *
  * Nossa última rota é super simples: Quando o cliente acessa apenas o endereço
  * `localhost:3000` sem mais nada após o 3000, o servidor envia para o cliente
  * os arquivos do frontend. A partir do `index.html` o servidor automaticamente
  * envia o `index.js` e `index.css` que são chamados pelo HTML.
  */
app.get('/', (req, res) => {
  /**
    * Aqui usamos `res.sendFile()` ao invés de `res.json()` por que estamos
    * enviando um arquivo ao invés de um objeto JavaScript.
    *
    * Para compor o caminho do arquivo, usamos `path.join()` por que assim
    * o servidor vai funcionar independente do tipo de caminho de arquivo
    * do sistema usado:
    *
    * Se o sistema for Windows, o caminho seria:
    * C:\pasta_do_servidor\public\index.hyml
    *
    * Mas se fosse qualquer outro sistema, o caminho seria:
    * /pasta_do_servidor/public/index.html
    *
    * Usar `path.join()` faz você não precisar escrever uma lógica para os
    * dois tipos diferentes de caminho para o arquivo correto.
    */
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


/** Enviamos erro número 500 (erro do servidor) para caso alguma das ferramentas
  * de "middleware" dê erro */
app.use((erro, req, res, next) => {
  console.error(erro.stack);
  res.status(500).json({ error: 'Erro em alguma das ferramentas de middleware' });
});


/** Enviamos erro número 404 (erro de não encontrado) para quando o cliente
 * tenta acessar uma rota não existente */
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});


/** Comando que "liga" o servidor e o faz responder a porta `3000`
 * da máquina onde ele estiver rodando, e exibe no terminal uma mensagem
 * com o link para o cliente. */
app.listen(PORTA, () => {
  console.log(`Servidor executando com sucesso no endereço http://localhost:${PORTA}`);
});


/** Instrução para fechar a conexão com o banco de dados quando o servidor
 * for encerrado. Se a conexão não for fechada pode haver corrupção nos dados. */
process.on('SIGINT', () => {
  db.close((erro) => {
    if (erro) {
      console.error(erro.message);
    }
    console.log('Conexão com o banco de dados encerrada com sucesso.');
    process.exit(0);
  });
});


/** INFO: Fim do arquivo! */
