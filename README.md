# Ponto Simulado

Uma plataforma de questões para concursos públicos, inspirada no QConcursos, com funcionalidades avançadas de geração de simulados personalizados.

## Funcionalidades

- Banco de questões por banca examinadora
- Geração de simulados personalizados
- Sistema de autenticação com níveis de acesso
- Painel administrativo
- Filtros avançados de questões

## Tecnologias Utilizadas

- React.js
- Vite
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- React Query
- React Router

## Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/pontosimulado.git
cd pontosimulado
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Estrutura do Banco de Dados (Supabase)

### Tabelas

1. `users`

   - id (uuid)
   - email (text)
   - role (text) - 'admin', 'subscriber', 'visitor'
   - created_at (timestamp)

2. `questions`

   - id (uuid)
   - text (text)
   - exam_board (text)
   - subject (text)
   - difficulty (text)
   - year (integer)
   - alternatives (jsonb)
   - correct_answer (text)
   - explanation (text)
   - created_at (timestamp)

3. `simulated_exams`
   - id (uuid)
   - user_id (uuid)
   - exam_board (text)
   - subject (text)
   - question_count (integer)
   - time_limit (integer)
   - questions (jsonb)
   - status (text)
   - created_at (timestamp)

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter

## Deploy

O projeto está configurado para deploy automático no GitHub Pages através do GitHub Actions.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
