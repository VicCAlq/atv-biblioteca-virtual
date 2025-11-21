#  Projeto de desenvolvimento web básico: Biblioteca Virtual
##  Sobre
Este é um projeto simples para exercício e demonstração de conceitos básicos para desenvolvimento web. Com a temática de "Biblioteca Virtual", o objetivo é familiarizar os alunos com os conceitos básicos de criação de um cliente (frontend), e sua integração com um servidor e banco de dados (backend).  

Os alunos aprenderão aqui sobre os conceitos básicos de CRUD (Create, Read, Update, Delete), e como eles são utilizados na criiação de aplicações web.

##  Configuração inicial do projeto
As instruções deste guia devem ser executadas em um terminal com ao menos alguma compatibilidade com padrões "POSIX" (em especial acesso aos comandos `ls`, `cd` e `rm`) e com o programa `git` instalado:

1. Abram o terminal de sua preferência na pasta onde deseja armazenar o projeto
2. Execute o comando `git clone https://github.com/VicCAlq/atv-biblioteca-virtual.git`
3. Navegue para a pasta do projeto com `cd atv-biblioteca-virtual`
4. Instale as dependências do projeto utilizando o Node com o comando `npm install`
    - A lista de dependências se encontra no arquivo `package.json`
5. Execute o servidor com o comando `npm run dev`
6. Acesse o endereço `http://localhost:3000`

##  Estrutura do projeto

O projeto é separado em três partes principais:

- O Backend consiste de um único arquivo (o servidor) chamado `server.js`
- O banco de dados (feito pelo SQLite) se trata do arquivo `biblioteca.db`
- O Frontend é composto pelos arquivos na pasta `public`:
    - `index.html`: se trata do conteúdo básico da página
    - `index.css`: contém estilos complementários aos estilos base importados no `head` do HTML
    - `index.js`: contém os comportamentos do frontend

##  Como funciona 

A seguir, uma explicação inicial e rasa do projeto:

1. O servidor ao ser executado verifica pela existência do banco de dados que será usado pelo projeto.
    - Se o banco de dados não existir ainda, o servidor usará a biblioteca `sqlite3` para criar o banco de dados e o manterá aberto para envio e recebimento de informações
    - Se o banco de dados já existir, o servidor se conectará a ele e o manterá aberto para envio e recebimento de informações
2. O servidor estabelece as "rotas" para interação com o servidor, para que o usuário do site possa adicionar, remover e visualizar itens cadastrados
3. O servidor disponibiliza acesso ao site a partir do endereço `http://localhost:300`
4. Ao acessar o endereço acima, o servidor envia o conteúdo do site (index.html, css e js) para o usuário
5. No site, o usuário tem acesso as informações cadastradas no banco de dados, e pode adicionar novos itens ou remover itens já existentes.

Para saber como o projeto funciona em detalhes, cada um dos arquivos (exceto o css) contém diversos comentários explicando o que cada parte do código faz.  

##  Para rodar novamente após encerrado

Na pasta raiz do projeto (onde está localizado o arquivo `server.js`) execute os comandos abaixo na ordem exibida:

1. `npm install`
2. `npm run dev`
