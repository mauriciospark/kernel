# Contribuindo para o Kernel

Guia de boas práticas e padronização para contribuições ao projeto Kernel.

## Filosofia de Contribuição

O Kernel valoriza contribuições que alinham com os princípios da Linhagem SPARK:
- **Privacidade:** Mudanças que protegem dados do usuário
- **Eficiência:** Otimizações de performance e UX
- **Autonomia:** Recursos que aumentam independência do usuário
- **Design:** Melhorias visuais e de usabilidade

## Como Contribuir

### 1. Reportar Bugs

Antes de reportar, verifique se o issue já existe.

**Template de Issue:**
```markdown
## Descrição
Breve descrição do problema

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja erro

## Comportamento Esperado
Descrição do que deveria acontecer

## Ambiente
- OS: [e.g. Windows 10, macOS 12]
- Browser: [e.g. Chrome 120, Firefox 115]
- Versão: [e.g. v1.0.0]

## Screenshots
Se aplicável, adicione screenshots
```

### 2. Sugerir Funcionalidades

**Template de Feature Request:**
```markdown
## Descrição da Funcionalidade
Descrição clara e concisa

## Problema que Soluciona
Qual problema essa feature resolve?

## Solução Proposta
Descrição detalhada da solução

## Alternativas Consideradas
Outras soluções avaliadas e por que foram rejeitadas
```

### 3. Enviar Pull Requests

#### Fluxo de Trabalho

1. **Fork o repositório**
2. **Crie uma branch** seguindo a convenção de nomenclatura
3. **Faça suas mudanças** seguindo os padrões de código
4. **Teste thoroughly** suas alterações
5. **Commit com mensagens claras**
6. **Push para seu fork**
7. **Abra um Pull Request** com descrição detalhada

#### Convenção de Branches

Use prefixos descritivos:
- `feature/` - Nova funcionalidade
  - Ex: `feature/dark-mode`
  - Ex: `feature/epub-support`
- `bugfix/` - Correção de bug
  - Ex: `bugfix/search-filter`
  - Ex: `bugfix/modal-close`
- `refactor/` - Refatoração de código
  - Ex: `refactor/api-integration`
  - Ex: `refactor/css-structure`
- `docs/` - Atualização de documentação
  - Ex: `docs/readme-update`
  - Ex: `docs/api-guide`
- `hotfix/` - Correção urgente em produção
  - Ex: `hotfix/critical-bug`

#### Padrões de Commit

Use mensagens de commit semânticas:

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos permitidos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudança apenas em documentação
- `style`: Formatação, ponto-e-vírgula, etc (sem mudança de código)
- `refactor`: Refatoração de código
- `test`: Adicionando testes
- `chore`: Atualização de build, ferramentas, etc

**Exemplos:**
```bash
feat(search): add fuzzy search algorithm
fix(modal): prevent close on outside click when editing
docs(readme): update installation instructions
refactor(api): simplify GitHub API integration
style(css): improve responsive breakpoints
```

## Padrões de Código

### JavaScript

#### Estilo de Código

- Use **camelCase** para variáveis e funções
- Use **PascalCase** para classes e construtores
- Use **UPPER_SNAKE_CASE** para constantes
- Indentação com **2 espaços**
- Sem ponto-e-vírgula obrigatório (consistente com codebase atual)

```javascript
// ✅ Bom
const loadBooks = async () => {
  try {
    const response = await fetch(API_URL);
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

// ❌ Ruim
const Load_Books=async()=>{
    try{
        const response=await fetch(API_URL);
        return response.json();
    }catch(error){
        console.error('Error',error);
    }
}
```

#### Comentários

- Comentários devem explicar **POR QUÊ**, não o quê
- Use JSDoc para funções públicas
- Mantenha comentários atualizados com o código

```javascript
/**
 * Carrega livros da GitHub API e extrai metadados
 * @returns {Promise<Array>} Array de objetos de livros
 */
async function loadBooks() {
  // Implementação...
}
```

### HTML

#### Semântica

- Use tags semânticas HTML5
- Atributos `alt` obrigatórios em imagens
- Hierarquia de headings correta

```html
<!-- ✅ Bom -->
<header>
  <h1>Título Principal</h1>
  <nav>
    <ul>
      <li><a href="#">Link</a></li>
    </ul>
  </nav>
</header>

<!-- ❌ Ruim -->
<div class="header">
  <div class="title">Título</div>
  <div class="nav">
    <div class="link">Link</div>
  </div>
</div>
```

### CSS

#### Organização

- Use BEM ou similar para nomenclatura de classes
- Agrupe estilos relacionados
- Use variáveis CSS para cores e valores repetidos

```css
/* ✅ Bom */
.book-card {
  /* ... */
}

.book-card__title {
  /* ... */
}

.book-card--featured {
  /* ... */
}

/* ❌ Ruim */
.cardTitle {
  /* ... */
}
```

## Validações Obrigatórias

### Antes de Submeter

- [ ] Código segue os padrões de estilo
- [ ] Funcionalidade foi testada manualmente
- [ ] Não há console.log() deixado no código
- [ ] Comentários são claros e necessários
- [ ] Commit message segue convenção semântica
- [ ] Branch nomeada corretamente
- [ ] Documentação atualizada se necessário

### Testes Manuais Obrigatórios

- [ ] Funciona em Chrome
- [ ] Funciona em Firefox
- [ ] Funciona em Safari (se possível)
- [ ] Responsivo em mobile
- [ ] Responsivo em tablet
- [ ] Responsivo em desktop
- [ ] Não há erros no console
- [ ] Acessibilidade básica (teclado, screen reader)

## Processo de Review

### Critérios de Aprovação

1. **Alinhamento com valores SPARK**
2. **Qualidade de código** (legibilidade, manutenibilidade)
3. **Performance** (sem degradação significativa)
4. **Testes** (funcionalidade verificada)
5. **Documentação** (atualizada e clara)

### Timeline de Review

- **Resposta inicial:** 48 horas
- **Review detalhado:** 7 dias
- **Merge:** Aprovação e resolução de feedback

## Comunidade e Comunicação

### Canais

- **Issues:** Para bugs e feature requests
- **Discussions:** Para perguntas e conversas
- **Pull Requests:** Para contribuições de código

### Código de Conduta

- Seja respeitoso e construtivo
- Aceite feedback de forma profissional
- Foque no que é melhor para o projeto
- Ajude outros contribuidores quando possível

## Reconhecimento

Contribuidores serão listados no README e receberão crédito por suas contribuições significativas.

---

**Linhagem SPARK** - Privacidade, Eficiência, Autonomia e Design  
© 2026 Mauricio Spark - Todos os direitos reservados
