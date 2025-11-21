// # SOBRE ESTE ARQUIVO ########################################################

/**
 * @author Victor Cavalcanti (www.github.com/VicCAlq) <victor.mca.dev@gmail.com>
 * @license MIT
 * @copyright Victor Cavalcanti 2025
 *
 * @file Este arquivo compreende todo o servidor utilizado pela aplicação.
 * Vocês encontrarão diversos comentários como este ao longo do código explicando 
 * cada parte. Leiam com atenção e no seu tempo.
 */

// # SETUP (configuração inicial) ###############################################

/**
 * As quatro linhas abaixo carregam algumas ferramentas e bibliotecas necessárias
 * e as armazenam em variáveis para que possamos utilizá-las ap longo do código:
 *
 * `express` - "Framework" (conjunto de ferramentas) para a criação do Servidor
 * `sqlite3` - Interface que permite acessar o banco de dados via JavaScript
 * `path` - Ferramenta interna do `Node` para manipulação de caminhos de arquivos
 *          e pastas no sistema
 * `cors` - Biblioteca para permitir que uma aplicação frontend tenha acesso aos
 *          recursos existentes no servidor que normalmente são restritos
 */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

// Cria uma nova aplicação servidor com o "express"
const app = express();
// Estabelece a porta para comunicação do frontend com o servidor
const PORT = process.env.PORT || 3000;

// Implementação de "middleware", ferramentas executadas sempre que ocorre uma requisição e resposta entre frontend e servidor
// Cors: Middleware pra permitir que cliente e servidor rodem no mesmo endereço
app.use(cors());
// express.json: Middleware pra estabelecer que a comunicação entre cliente e servidor se dá via arquivos JSON
app.use(express.json());
// express.static: Middleware pra estabelecer que o servidor vai fornecer arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ##############################################################################

// Inicializa o banco de dados SQLite, ou abre o banco de dados caso ele já exista
const db = new sqlite3.Database('./biblioteca.db', (erro) => {

  // Verificação se o banco de dados foi criado ou aberto com sucesso
  if (erro) {
    console.error('Erro ao abrir o banco de dados "biblioteca.db":', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite3 "biblioteca.db"');
    
    /** Cria a tabela "Biblioteca" caso ela ainda não exista
     *  NOTE: Editem as propriedades dentro da instrução "db.run" para corresponderem as propriedades da classe que vocês criaram
     *  nome
     *  ano_lancamento
     *  desenvolvedor
     *  plataforma
     *  genero
     *  jogadores
     *  jogadores_registrados
     * 
     *  Os tipos possíveis de valores são:
     *  TEXT (texto), INTEGER (número inteiro), FLOAT(número com casa decimal)
     *  BOOLEAN(verdadeiro ou falso), DATE(Data em ano/mês/dia no formato aaaa-mm-dd)
     *
     *  Tem outros tipos disponíveis, mas vamos focar nestes
     */
    db.run(`CREATE TABLE IF NOT EXISTS Biblioteca (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      ano_lancamento INTEGER,
      desenvolvedor TEXT,
      plataforma TEXT,
      genero TEXT,
      jogadores INTEGER,
      jogadores_registrados TEXT
    )`, (err) => {
      // Verificação de erro ao criar a biblioteca
      if (err) {
        console.error('Erro ao criar a tabela "Biblioteca"', err.message);
      } else {
        console.log('Tabela "Biblioteca" pronta!');
      }
    });
  }
});

// Declaração de "rotas"

// Rota para enviar todos os itens da biblioteca com o comando GET
app.get('/api/biblioteca', (req, res) => {
  // Instrução SQL a ser executada
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
});

// Rota para enviar um item específico da biblioteca com o comando GET
app.get('/api/biblioteca/:id', (req, res) => {
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
});

// Rota para criar um novo item na biblioteca com o comando POST
app.post('/api/biblioteca', (req, res) => {
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
});

// Rota para modificar um item na biblioteca com o comando POST
app.put('/api/biblioteca/:id', (req, res) => {
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
});

// Rota para apagar um item na biblioteca com o comando DELETE
app.delete('/api/biblioteca/:id', (req, res) => {
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
