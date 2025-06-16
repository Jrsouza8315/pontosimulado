-- Habilitar a extensão UUID
create extension if not exists "uuid-ossp";

-- Criar a tabela de usuários
create table public.users (
  id uuid references auth.users on delete cascade,
  email text,
  role text check (role in ('admin', 'subscriber', 'visitor')) default 'visitor',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Habilitar RLS para users
alter table public.users enable row level security;

-- Criar políticas de segurança para users
create policy "Usuários podem ver seus próprios dados"
  on public.users for select
  using (auth.uid() = id);

create policy "Apenas admins podem atualizar roles"
  on public.users for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Criar a tabela de questões
create table public.questions (
  id uuid default uuid_generate_v4(),
  text text not null,
  exam_board text not null,
  subject text not null,
  difficulty text check (difficulty in ('facil', 'medio', 'dificil')),
  year integer,
  alternatives jsonb,
  correct_answer text,
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Habilitar RLS para questions
alter table public.questions enable row level security;

-- Criar políticas de segurança para questions
create policy "Visitantes podem ver questões públicas"
  on public.questions for select
  using (true);

create policy "Assinantes podem ver todas as questões"
  on public.questions for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role in ('subscriber', 'admin')
    )
  );

create policy "Apenas admins podem inserir questões"
  on public.questions for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Apenas admins podem atualizar questões"
  on public.questions for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Apenas admins podem deletar questões"
  on public.questions for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Criar a tabela de simulados
create table public.simulated_exams (
  id uuid default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade,
  exam_board text not null,
  subject text not null,
  question_count integer not null,
  time_limit integer not null,
  questions jsonb,
  status text check (status in ('created', 'in_progress', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Habilitar RLS para simulated_exams
alter table public.simulated_exams enable row level security;

-- Criar políticas de segurança para simulated_exams
create policy "Usuários podem ver seus próprios simulados"
  on public.simulated_exams for select
  using (auth.uid() = user_id);

create policy "Assinantes podem criar simulados"
  on public.simulated_exams for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role in ('subscriber', 'admin')
    )
  );

create policy "Usuários podem atualizar seus próprios simulados"
  on public.simulated_exams for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios simulados"
  on public.simulated_exams for delete
  using (auth.uid() = user_id);

-- Criar função para o trigger de novo usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    case
      when new.email = 'hbrcomercialssa@gmail.com' then 'admin'
      else 'visitor'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Criar o trigger para novos usuários
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Inserir algumas questões de exemplo
insert into public.questions (text, exam_board, subject, difficulty, year, alternatives, correct_answer, explanation)
values
(
  'Em relação aos princípios da Administração Pública, assinale a alternativa correta:',
  'CESPE',
  'Direito_Administrativo',
  'facil',
  2023,
  '[
    "A legalidade administrativa é um princípio que permite à Administração Pública agir com discricionariedade total.",
    "A impessoalidade veda a prática de atos administrativos com finalidade eleitoral.",
    "A moralidade administrativa não se confunde com a moral comum.",
    "A publicidade dos atos administrativos é absoluta, não admitindo sigilo em nenhuma hipótese.",
    "A eficiência é um princípio que se aplica apenas à Administração Pública direta."
  ]'::jsonb,
  'B',
  'A impessoalidade veda a prática de atos administrativos com finalidade eleitoral, conforme entendimento do STF.'
),
(
  'Sobre o controle da Administração Pública, é correto afirmar que:',
  'FGV',
  'Direito_Administrativo',
  'medio',
  2023,
  '[
    "O controle interno é exercido exclusivamente pelo Poder Legislativo.",
    "O controle externo é exercido exclusivamente pelo Poder Judiciário.",
    "O controle social é exercido pela sociedade, através de mecanismos como a ouvidoria e o acesso à informação.",
    "O controle administrativo é exercido apenas pela Controladoria-Geral da União.",
    "O controle judicial é exercido apenas pelo Supremo Tribunal Federal."
  ]'::jsonb,
  'C',
  'O controle social é exercido pela sociedade, através de mecanismos como a ouvidoria e o acesso à informação, conforme previsto na Constituição Federal.'
); 