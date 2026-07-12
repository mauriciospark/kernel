# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-07-12

### Added
- Sistema de biblioteca digital completo
- Integração automática com GitHub API para listagem de arquivos
- Extração inteligente de metadados de nomes de arquivos (formato: Título - Autor - Ano)
- Detecção automática de gêneros baseada em palavras-chave
- Interface moderna com design responsivo
- Sistema de busca em tempo real por título e autor
- Filtro por gênero com dropdown dinâmico
- Modal de detalhes do livro com informações completas
- Link de download direto via GitHub API
- Suporte a múltiplos formatos (PDF, EPUB, MOBI, DJVU)
- Sistema híbrido: detecção automática + metadados manuais via JSON
- Fallback para JSON local quando GitHub API não disponível
- Tratamento de erros robusto com mensagens claras
- Animações suaves em hover e transições
- Design com gradientes modernos (roxo/azul)
- Interface adaptável para desktop, tablet e mobile
- Sistema de cards com efeito de elevação
- Fechamento de modal via clique, ESC ou botão
- Documentação completa (README, ABOUT, ARCHITECTURE, CONTRIBUTING)
- Licença MIT para uso livre em portfólios
- Header de copyright em todos os arquivos do projeto
- Configuração simplificada via arquivo config.js

### Changed
- Arquitetura migrada para sistema Local-First com API externa
- Remoção de dependência de backend tradicional
- Otimização de performance usando Vanilla JavaScript
- Simplificação do processo de deployment via GitHub Pages

### Fixed
- Tratamento de erros em requisições à GitHub API
- Fallback graceful quando API não está disponível
- Sanitização de HTML para prevenir XSS
- Correção de display quando não há livros encontrados

---

## Próximas Versões (Planejado)

## [1.1.0] - Planejado
### Added
- Modo escuro/claro com persistência em localStorage
- Toggle entre Grid view e List view
- Animações de transição aprimoradas
- Indicador de progresso de leitura por livro
- Sistema de favoritos
- Ordenação por título, autor, ano

## [1.2.0] - Planejado
### Added
- Histórico de livros acessados recentemente
- Sistema de notas e marcações por livro
- Exportação/importação de biblioteca
- Suporte a múltiplos idiomas
- Atalhos de teclado para navegação

## [2.0.0] - Planejado
### Added
- Suporte a múltiplos repositórios GitHub
- Integração com Calibre para metadados avançados
- Leitor embutido de PDF
- API REST para integrações externas
- Aplicativo mobile (PWA)
- Sistema de recomendações baseado em conteúdo
- Comunidade e compartilhamento de bibliotecas
- Sincronização entre dispositivos
- Suporte a formatos adicionais (EPUB, MOBI com leitor)

---

**Linhagem SPARK** - Privacidade, Eficiência, Autonomia e Design  
© 2026 Mauricio Spark - Todos os direitos reservados
