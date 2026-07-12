# Arquitetura do Sistema

## Design Arquitetural

O Kernel adota uma arquitetura **Local-First com API Externa**, focada em simplicidade, performance e manutenção zero. O sistema não possui backend tradicional, operando inteiramente no navegador com integração direta à GitHub API.

### Padrão Arquitetural: Client-Side Static Application

```
┌─────────────────────────────────────────────────────────┐
│                     Navegador (Client)                   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   HTML UI    │  │   CSS Styles │  │  JavaScript  │  │
│  │  (Interface) │  │  (Estilos)   │  │  (Lógica)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                            │                             │
│                    ┌───────▼───────┐                     │
│                    │  DOM Engine   │                     │
│                    └───────┬───────┘                     │
└────────────────────────────┼─────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  GitHub API     │
                    │  (External)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  GitHub Repo    │
                    │  (Storage)      │
                    └─────────────────┘
```

## Justificativa das Escolhas Técnicas

### 1. Arquitetura Client-Side

**Decisão:** Todo o processamento ocorre no navegador, sem servidor backend.

**Justificativa:**
- **Custo Zero:** Elimina necessidade de servidores pagos
- **Simplicidade:** Deploy instantâneo via GitHub Pages
- **Performance:** Sem latência de servidor-cliente para operações locais
- **Manutenção:** Zero configuração de infraestrutura

**Trade-off:** Limitações de processamento pesado, mitigado pela natureza leve da aplicação.

### 2. Integração Direta com GitHub API

**Decisão:** Usar GitHub API para listar arquivos em vez de banco de dados tradicional.

**Justificativa:**
- **Automação:** Detecta automaticamente novos arquivos sem manutenção manual
- **Versionamento:** Histórico completo de mudanças via Git
- **Backup:** Replicação automática via GitHub
- **Colaboração:** Múltiplos colaboradores podem contribuir via PRs

**Trade-off:** Dependência da API rate limits (60 requests/hour para não-autenticados), aceitável para uso pessoal.

### 3. Extração de Metadados por Nome de Arquivo

**Decisão:** Interpretar padrões de nomenclatura em vez de exigir metadados manuais.

**Justificativa:**
- **Eficiência:** Reduz tempo de catalogação de minutos para segundos
- **Consistência:** Padrões de nomenclatura forçam organização
- **Flexibilidade:** JSON manual disponível para casos especiais

**Trade-off:** Menos precisão que metadados manuais, mitigado por detecção inteligente de padrões.

### 4. Vanilla JavaScript (Sem Frameworks)

**Decisão:** Implementar com JavaScript puro em vez de React, Vue ou similares.

**Justificativa:**
- **Performance:** Sem overhead de bundle size
- **Simplicidade:** Curva de aprendizado zero para manutenção
- **Portabilidade:** Funciona em qualquer ambiente sem build step
- **Tamanho:** < 10KB total vs. 100KB+ com frameworks

**Trade-off:** Menos estrutura para aplicações complexas, não aplicável dado o escopo.

## Fluxo de Dados

### 1. Inicialização da Aplicação

```
DOM Load
    ↓
Carregar config.js
    ↓
loadBooks() invocado
    ↓
fetchGitHubStars() invocado (paralelo)
    ↓
┌─────────────────────────────────────┐
│ Tenta carregar books.json (opcional)│
│ para metadados manuais              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Faz request para GitHub API         │
│ GET /repos/{user}/{repo}/contents/  │
│     {path}                           │
└──────────────┬──────────────────────┘
               ↓
        Recebe array de arquivos
               ↓
┌─────────────────────────────────────┐
│ Filtra apenas PDFs/EPUBs/MOBI       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Para cada arquivo:                  │
│ - extractMetadataFromFilename()     │
│ - Combina com metadados JSON (se)    │
│ - Adiciona download_url da API       │
└──────────────┬──────────────────────┘
               ↓
        booksData populado
               ↓
┌─────────────────────────────────────┐
│ populateGenreFilter()               │
│ - Extrai gêneros únicos             │
│ - Popula dropdown                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ displayBooks(booksData)             │
│ - Renderiza cards na grid           │
└──────────────┬──────────────────────┘
               ↓
        Interface pronta
```

### 2. Busca de Estrelas do GitHub

```
DOM Load
    ↓
fetchGitHubStars() invocado
    ↓
┌─────────────────────────────────────┐
│ Faz request para GitHub API         │
│ GET /repos/{user}/{repo}            │
└──────────────┬──────────────────────┘
               ↓
        Recebe dados do repositório
               ↓
┌─────────────────────────────────────┐
│ Extrai stargazers_count             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Atualiza elemento #starsCount       │
│ Formato: "★ {count} star"            │
└──────────────┬──────────────────────┘
               ↓
        Estrelas exibidas no header
```

### 3. Interação do Usuário

#### Busca e Filtro

```
Input do usuário (search/filter)
    ↓
filterBooks() invocado
    ↓
┌─────────────────────────────────────┐
│ Filtra booksData por:               │
│ - searchTerm (título/autor)         │
│ - selectedGenre (gênero)            │
└──────────────┬──────────────────────┘
               ↓
        filteredBooks atualizado
               ↓
        displayBooks(filteredBooks)
               ↓
        Grid re-renderizada
```

#### Visualização de Detalhes

```
Clique no card
    ↓
openBookModal(bookId)
    ↓
┌─────────────────────────────────────┐
│ Encontra livro em booksData         │
│ por ID                              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Renderiza modal com:                │
│ - Título, autor, ano, gênero        │
│ - Descrição                         │
│ - Link (download_url ou file)      │
└──────────────┬──────────────────────┘
               ↓
        Modal exibido
```

## Estrutura de Dados

### booksData (Array)

```javascript
[
  {
    id: number,              // Identificador único
    title: string,          // Título extraído ou manual
    author: string,         // Autor extraído ou manual
    year: string,           // Ano extraído ou manual
    genre: string,          // Gênero detectado ou manual
    description: string,    // Descrição (nome do arquivo ou manual)
    cover: string | null,   // Caminho da capa (opcional)
    file: string,           // Caminho local (fallback)
    download_url: string   // URL direta da GitHub API
  }
]
```

### Configuração

```javascript
const GITHUB_CONFIG = {
  username: string,    // Seu usuário GitHub
  repository: string,  // Nome do repositório
  branch: string,      // Branch padrão (main/master)
  booksPath: string    // Pasta dos livros
};
```

## Privacidade e Segurança

### Privacidade de Dados

- **Zero Coleta:** Nenhum dado pessoal é coletado ou transmitido
- **Local-First:** Todo processamento ocorre no navegador do usuário
- **Transparência:** Código 100% open-source e auditável
- **Sem Tracking:** Absolutamente nenhum analytics ou tracking

### Segurança

- **HTTPS:** Obrigatório via GitHub Pages
- **CORS:** GitHub API suporta requisições cross-origin
- **Sanitização:** Renderização de HTML escapada para prevenir XSS
- **Rate Limiting:** Respeita limites da GitHub API

## Escalabilidade

### Limitações Atuais

- **GitHub API:** 60 requests/hour (não-autenticado) ou 5000 (autenticado)
- **Tamanho:** Ideal para bibliotecas até 1000 livros
- **Performance:** Renderização DOM direta (virtual DOM não necessário)

### Estratégias de Escala

Para bibliotecas maiores:

1. **Autenticação GitHub:** Token pessoal para aumentar rate limits
2. **Paginação:** Implementar paginação da API para grandes coleções
3. **Caching:** LocalStorage para cache de metadados
4. **Virtual Scrolling:** Renderizar apenas itens visíveis

---

**Linhagem SPARK** - Privacidade, Eficiência, Autonomia e Design  
© 2026 Mauricio Spark - Todos os direitos reservados
