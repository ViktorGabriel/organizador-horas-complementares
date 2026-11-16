# Organizador de Horas Complementares Acadêmicas

[![CI](https://github.com/ViktorGabriel/organizador-horas-complementares/actions/workflows/ci.yml/badge.svg)](https://github.com/ViktorGabriel/organizador-horas-complementares/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-6e9f18.svg)](https://vitest.dev/)

> Sistema fullstack voltado para estudantes de graduação realizarem o upload, categorização, auditoria de tetos regimentais e geração automatizada de dossiês em PDF para entrega à coordenação acadêmica.

---

## 🎯 Problema & Proposta de Valor

- **A Dor:** Estudantes universitários acumulam certificados em e-mails, prints e pastas soltas. Ao final do curso, deparam-se com a surpresa de horas rejeitadas devido a **tetos regimentais por categoria** (ex: o curso exige 200h, mas aceita no máximo 60h em cursos livres e 40h em eventos).
- **A Solução:** Uma plataforma centralizada que:
  1. Armazena os comprovantes com hash SHA-256 de integridade e pré-visualização.
  2. Executa cálculo matemático estrito com respeito aos limites por categoria e atividade.
  3. Alerta proativamente sobre horas excedentes que não serão computadas.
  4. Gera o **Dossiê Oficial em PDF** com folha de rosto, tabela sintética de apuração, lista analítica de anexos e campos formais para assinatura do aluno e colegiado de curso.

---

## 🏗️ Arquitetura e Engenharia de Software

O projeto segue os princípios de **Clean Architecture** e **SOLID**, garantindo total desacoplamento da lógica de negócio e facilidade de evolução:

```
src/
├── domain/                      # Regras de Negócio e Entidades Puras (Zero dependências externas)
│   ├── entities/                # Curso, Categoria, Certificado
│   ├── services/                # CalculadoraAproveitamento (Cálculo estrito de tetos)
│   └── repositories/            # Contratos e Interfaces (ICertificadoRepository, ICursoRepository)
├── application/                 # Casos de Uso e DTOs
│   ├── dtos/                    # Schemas de validação Zod (Contrato Primeiro)
│   └── usecases/                # ObterPainel, CadastrarCertificado, Excluir, AtualizarCurso
├── infra/                       # Infraestrutura, Persistência e Utilitários
│   ├── persistence/             # Repositórios Json/Storage desacoplados
│   ├── storage/                 # Gerenciamento local de arquivos e integridade SHA-256
│   └── pdf/                     # Gerador de Dossiê Oficial em PDF (jsPDF + AutoTable)
├── components/                  # Componentes de Interface React / Tailwind
│   ├── Header.tsx               # Barra de controle institucional e atalhos de exportação
│   ├── MetricCards.tsx          # Indicadores de aproveitamento, horas restantes e excedentes
│   ├── CategoriasGrid.tsx       # Monitoramento semafórico de tetos por categoria
│   ├── TabelaCertificados.tsx   # Listagem interativa com filtros, busca e preview
│   ├── NovoCertificadoModal.tsx # Upload drag-and-drop e cadastro com alerta de teto
│   ├── EditarPerfilModal.tsx    # Configuração de metas do curso e dados do discente
│   └── VisualizadorAnexoModal.tsx # Modal para visualização de PDFs e imagens anexadas
└── app/                         # Next.js App Router (Páginas e Rotas de API REST)
    ├── api/                     # Endpoints /painel, /certificados, /curso, /relatorio/pdf
    ├── layout.tsx
    └── page.tsx
```

---

## 📐 Regras de Apuração do Domínio

A classe `CalculadoraAproveitamento` aplica as seguintes diretivas:

1. **Limite Individual por Atividade:** Caso a categoria estipule teto por atividade (ex: máx. 40h por certificado), valores acima deste teto são divididos entre horas elegíveis e excedente individual.
2. **Teto Máximo da Categoria:** A soma das horas aproveitadas em uma categoria nunca ultrapassa `categoria.tetoHoras`. Qualquer carga horária adicional é rotulada como excedente e não compõe a integralização.
3. **Integralização Global:** A soma de todas as categorias é limitada a `curso.horasExigidas`.
4. **Descarte de Rejeitados:** Certificados em estado `REJEITADO` são desconsiderados de todos os cálculos.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js `>= 20.x`
- Gerenciador `pnpm` (`npm install -g pnpm`)

### Instalação e Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev
```

Acesse em seu navegador: `http://localhost:3000`

---

## 🧪 Testes Automatizados

A suíte de testes unitários e de integração cobre todas as regras de negócio e a geração do PDF:

```bash
# Executar todos os testes com Vitest
pnpm run test
```

---

## 🐳 Execução via Docker

```bash
# Subir container via Docker Compose
docker compose up -d --build
```

A aplicação estará disponível em `http://localhost:3000` com persistência mapeada no diretório `./data`.

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido para portfólio de engenharia de software de alto nível.
