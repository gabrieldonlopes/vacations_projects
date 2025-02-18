# 📂 myBiblioteca 

## 🛠️ Ferramentas Utilizadas
- **FastApi:** Framework web que utiliza python para definir endpoints e controlar interações com backend.
- **React:** Biblioteca utilizada para construir o frontend da aplicação.
- **Requests:** Biblioteca python utilizada para consumir APIs externas
- **Pandas:** Ferramenta utilizada para gerenciar e filtrar os dados coletados na API.
- **Vite, Tailwindcss, Axios:** Ferramentas utilizadas para auxiliar na construção do frontend e consumo da API.
- **Sqlalchemy, Sqlite:** Ferramentas de interação e gerencimento de banco de dados.
- **React-Toastify:** Ferramenta utilizada para exibir exceções ou erros ao usuário.

## 🎯 Objetivo do Projeto  
- Integrar plataforma de pesquisa de Livros e Autores.
- Permitir criação de Estante individual e personalizada.
- Servir como exemplo de aprendizado no gerenciamento e autenticação de usuários.
- Servir como exemplo de aprendizado na utilização de APIs externas.

## 🌐 APIs Externas Utilizadas
- 🚀 **Google Books APIs:** Utilizada para pesquisa e consulta de Livros. 
  Exemplo: [Link para a documentação](https://developers.google.com/books/docs/v1/reference?hl=pt-br)

## ⚙️ Configuração da Aplicação
Instruções para configurar a aplicação no ambiente local ou de produção.  
Por exemplo:  
1. Clone o repositório:  
   `git clone https://github.com/GabeDON/vacations_projects.git`
2. Adquira uma chave da API e adicione-a num arquivo `.env` com nome `GOOGLE_API_KEY`
3. Crie um `.venv` para instação dos módulos python e ative-o
   `python -m venv .venv` e `source .venv/bin/activate` 
4. Instale as dependências:  
   `npm install` e `pip install -r requirements.txt`
5. Crie as tabelas e inicialize o banco de dados
   ` python -m main --create-db `
5. Rode a aplicação em dois terminais diferentes:  
   `npm run dev` ou `python -m main --run-server`
   