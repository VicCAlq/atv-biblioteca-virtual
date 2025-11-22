//  INFO: #### SOBRE ESTE ARQUIVO ################################################

/**
 * @author Victor Cavalcanti (www.github.com/VicCAlq) <victor.mca.dev@gmail.com>
 * @license MIT
 * @copyright Victor Cavalcanti 2025
 *
 * @file Este arquivo compreende todo o servidor utilizado pela aplicação.
 * Vocês encontrarão diversos comentários como este ao longo do código explicando 
 * cada parte. Leiam com atenção e no seu tempo.
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
const PORT = process.env.PORT || 3000;

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
  /** WARN: Final da função anônima de criação do banco de dados */
});

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

/**
  * WARN: Primeira rota: Solicitar todos os itens do banco de dados
  *
  * Aqui criamos nossa primeira rota: Utilizamos o método `GET` no endereço
  * `/api/biblioteca` e nas instruções da função anônima dizemos como o servidor
  * deve tratar essa solicitação. A função principal aqui é a de enviar para
  * o cliente todos os itens armazenados no banco de dados.
  */
app.get('/api/biblioteca', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  /** Comando `SQL` que vai ser executado pelo banco de dados */
  const sql = 'SELECT * FROM Biblioteca';
  
  // Executa a instrução SQL e retorna um possível erro e um possível resultado
  db.all(sql, [], (err, rows) => {
    // Verificação de erro
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Converte o resultado para o formato JSON e envia para o frontend
    res.json({
      message: 'success',
      data: rows
    });
  });
  /** WARN: Final da função anônima da rota de pedido de todos os itens */
});

// Rota para enviar um item específico da biblioteca com o comando GET
app.get('/api/biblioteca/:id', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  // Instrução SQL a ser executada, vai retornar o item correspoondente a variável "id"
  const sql = 'SELECT * FROM Biblioteca WHERE id = ?';
  // Pega a variável "id" nos parâmetros da requisição
  const params = [req.params.id];
  
  // Executa a instrução SQL e retorna um possível erro e um possível resultado
  db.get(sql, params, (err, row) => {
    // Verificação de erro
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Item da biblioteca não encontrado
    if (!row) {
      res.status(404).json({ error: 'Item não encontrado' });
      return;
    }
    // Converte o resultado para o formato JSON e envia para o frontend
    res.json({
      message: 'success',
      data: row
    });
  });
  /** WARN: Final da função anônima da rota de pedido de um único item */
});

// Rota para criar um novo item na biblioteca com o comando POST
app.post('/api/biblioteca', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  // Cria as variáveis abaixo a partir do que foi enviado na requisição do frontend.
  // Os nomes das variáveis DEVEM corresponder as propriedades do objeto que vocês criaram para os itens da biblioteca
  // NOTE: ALTERAR OS ITENS ABAIXO PARA CORRESPONDER AS PROPRIEDADES DOS OBJETOS DA BIBLIOTECA
  const {
    nome,
    ano_lancamento,
    desenvolvedor,
    plataforma,
    genero,
    jogadores,
    jogadores_registrados
  } = req.body;

  // Verificação para exigir que o item seja criado com um nome
  if (!nome) {
    return res.status(400).json({ error: 'O nome é obrigatório' });
  }
  
  // Instrução SQL a ser executada para criar o novo item na biblioteca
  // NOTE: ALTERAR OS ITENS ABAIXO PARA CORRESPONDER AS PROPRIEDADES DOS OBJETOS DA BIBLIOTECA
  const sql = `INSERT INTO Biblioteca (nome, ano_lancamento, desenvolvedor, plataforma, genero, jogadores, jogadores_registrados) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`;
  // Lista com as variáveis que vão conter os valores do item a ser criado
  // NOTE: ALTERAR OS ITENS ABAIXO PARA CORRESPONDER AS PROPRIEDADES DOS OBJETOS DA BIBLIOTECA
  const params = [nome, ano_lancamento, desenvolvedor, plataforma, genero, jogadores, jogadores_registrados];

  // Executa a instrução SQL e retorna um possível erro e um possível resultado
  db.run(sql, params, function(err) {
    // Verificação de erro
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Converte o resultado para o formato JSON e envia para o frontend
    res.json({
      message: 'Game created successfully',
      data: { id: this.lastID },
      id: this.lastID
    });
  });
  /** WARN: Final da função anônima da rota de criação de um item novo */
});

// Rota para modificar um item na biblioteca com o comando POST
app.put('/api/biblioteca/:id', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  // Cria as variáveis abaixo a partir do que foi enviado na requisição do frontend.
  // Os nomes das variáveis DEVEM corresponder as propriedades do objeto que vocês criaram para os itens da biblioteca
  // NOTE: ALTERAR OS ITENS ABAIXO PARA CORRESPONDER AS PROPRIEDADES DOS OBJETOS DA BIBLIOTECA
  const {
    nome,
    ano_lancamento,
    desenvolvedor,
    plataforma,
    genero,
    jogadores,
    jogadores_registrados
  } = req.body;
  
  // Instrução SQL a ser executada para atualizar o item na biblioteca
  // NOTE: ALTERAR OS ITENS ABAIXO PARA CORRESPONDER AS PROPRIEDADES DOS OBJETOS DA BIBLIOTECA
  const sql = `UPDATE Biblioteca 
         SET nome = ?, ano_lancamento = ?, desenvolvedor = ?, plataforma = ?, genero = ?, jogadores = ?, jogadores_registrados = ?
         WHERE id = ?`;
  // Lista com as variáveis que vão conter os valores do item a ser atualizado
  // NOTE: ALTERAR OS ITENS ABAIXO PARA CORRESPONDER AS PROPRIEDADES DOS OBJETOS DA BIBLIOTECA
  const params = [nome, ano_lancamento, desenvolvedor, plataforma, genero, jogadores, jogadores_registrados, req.params.id];
  
  // Executa a instrução SQL e retorna um possível erro e um possível resultado
  db.run(sql, params, function(err) {
    // Verificação de erro
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Item da biblioteca não encontrado
    if (this.changes === 0) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    // Converte o resultado para o formato JSON e envia para o frontend
    res.json({
      message: 'Game updated successfully',
      data: { id: req.params.id },
      changes: this.changes
    });
  });
  /** WARN: Final da função anônima da rota de atualização de um item */
});

// Rota para apagar um item na biblioteca com o comando DELETE
app.delete('/api/biblioteca/:id', (req, res) => {
/**WARN: Aqui dentro temos todo o conteúdo da "função anônima". Cada parte
 * da função também terá seu conteúdo explicado em comentários. */

  // Instrução SQL a ser executada para remover o item da biblioteca
  const sql = 'DELETE FROM Biblioteca WHERE id = ?';
  // Identificador do jogo a ser apagado
  const params = [req.params.id];
  
  // Executa a instrução SQL e retorna um possível erro e um possível resultado
  db.run(sql, params, function(err) {
    // Verificação de erro
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Item da biblioteca não encontrado
    if (this.changes === 0) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    // Converte o resultado para o formato JSON e envia para o frontend
    res.json({
      message: 'Game deleted successfully',
      changes: this.changes
    });
  });
  /** WARN: Final da função anônima da rota de remoção de um item */
});

// Envia o arquivo "index.html" na rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mensagem de erro para caso alguma das bibliotecas de "Middleware" (topo deste arquivo) falhar
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro em alguma das ferramentas de middleware' });
});

// Gerenciador de erro para rotas não encontradas (erro 404)
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Mensagem de quando o servidor é executado
app.listen(PORT, () => {
  console.log(`Servidor executando com sucesso no endereço http://localhost:${PORT}`);
});

// Fecha a conexão com o banco de dados ao encerrar o servidor
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexão com o banco de dados encerrada com sucesso.');
    process.exit(0);
  });
});
