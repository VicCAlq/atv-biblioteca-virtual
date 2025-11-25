const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./biblioteca.db', (erro) => {
  if (erro) {
    console.error('Erro ao abrir o banco de dados "biblioteca.db":', erro.message);
  } else {
    console.log('Conectado ao banco de dados SQLite3 "biblioteca.db"');
    
    db.run(`CREATE TABLE IF NOT EXISTS Biblioteca (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      vida INTEGER,
      classe VARCHAR(100),
      nivel INTEGER,
      ataque INTEGER,
      defesa FLOAT,
      ativo BOOLEAN,
      dataDeEntrada VARCHAR(100)
    )`, (erro) => {
      if (erro) {
        console.error('Erro ao criar a tabela "Biblioteca"', erro.message);
      } else {
        console.log('Tabela "Biblioteca" pronta!');
      }
    });
  }
});

app.get('/api/biblioteca', (req, res) => {
  const sql = 'SELECT * FROM Biblioteca';
  
  db.all(sql, [], (erro, linhasDaTabela) => {
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }

    res.json({
      message: 'success',
      data: linhasDaTabela
    });
  });
});

app.get('/api/biblioteca/:id', (req, res) => {
  const sql = 'SELECT * FROM Biblioteca WHERE id = ?';
  const params = [req.params.id];

  db.get(sql, params, (erro, linhaDaTabela) => {
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    if (!linhaDaTabela) {
      res.status(404).json({ error: 'Item não encontrado' });
      return;
    }
    res.json({
      message: 'success',
      data: linhaDaTabela
    });
  });
});

app.post('/api/biblioteca', (req, res) => {
  const {
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada
  } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'O nome é obrigatório' });
  }
  
  const sql = `INSERT INTO Biblioteca (
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada
  ];

  db.run(sql, params, function(erro) {
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    res.json({
      message: 'Personagem adicionado com sucesso',
      data: { id: this.lastID },
      id: this.lastID
    });
  });
});

app.put('/api/biblioteca/:id', (req, res) => {
  const {
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada
  } = req.body;
  
  const sql = `UPDATE Biblioteca SET 
    nome = ?,
    vida = ?,
    classe = ?,
    nivel = ?,
    ataque = ?,
    defesa = ?,
    ativo = ?,
    dataDeEntrada = ?,
    WHERE id = ?`;

  const params = [
    nome,
    vida,
    classe,
    nivel,
    ataque,
    defesa,
    ativo,
    dataDeEntrada,
    req.params.id
  ];
  
  db.run(sql, params, function(erro) {
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Personagem não encontrado' });
      return;
    }
    res.json({
      message: 'Personagem atualizado com sucesso',
      data: { id: req.params.id },
      changes: this.changes
    });
  });
});

app.delete('/api/biblioteca/:id', (req, res) => {
  const sql = 'DELETE FROM Biblioteca WHERE id = ?';
  const params = [req.params.id];
  
  db.run(sql, params, function(erro) {
    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Personagem não encontrado' });
      return;
    }
    res.json({
      message: 'Personagem apagado com sucesso.',
      changes: this.changes
    });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((erro, req, res, next) => {
  console.error(erro.stack);
  res.status(500).json({ error: 'Erro em alguma das ferramentas de middleware' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORTA, () => {
  console.log(`Servidor executando com sucesso no endereço http://localhost:${PORTA}`);
});

process.on('SIGINT', () => {
  db.close((erro) => {
    if (erro) {
      console.error(erro.message);
    }
    console.log('Conexão com o banco de dados encerrada com sucesso.');
    process.exit(0);
  });
});
