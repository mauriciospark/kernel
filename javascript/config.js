/*
  ============================================================================
  PROPRIETÁRIO: Mauricio Spark
  MARCA:        Spark Mauricio
  PROJETO:      Kernel
  VERSÃO:       v1.0.0
  LINHAGEM:     SPARK
  ============================================================================
  Documento de Planejamento de Escopo
  COPYRIGHT: © 2026 / Mauricio Spark. Todos os direitos reservados.
  ============================================================================
*/
// Configurações do GitHub
const user = 'SEU_USUARIO';
const repo = 'SEU_REPOSITORIO';
const path = 'livros'; // A pasta onde os PDFs estão

fetch(`https://api.github.com/repos/${user}/${repo}/contents/${path}`)
    .then(response => response.json())
    .then(files => {
        const container = document.getElementById('biblioteca');

        files.forEach(file => {
            // Verifica se é um arquivo PDF
            if (file.name.endsWith('.pdf')) {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
          <h3>${file.name.replace('.pdf', '')}</h3>
          <a href="${file.download_url}" target="_blank">Baixar PDF</a>
        `;
                container.appendChild(card);
            }
        });
    });