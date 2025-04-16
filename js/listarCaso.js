document.addEventListener('DOMContentLoaded', () => {
    // Função para aplicar o filtro de status
    const filterStatus = document.getElementById('filter-status');
    filterStatus.addEventListener('change', (event) => {
      filterCases();
    });
  
    // Função para aplicar o filtro de data
    const filterDate = document.getElementById('filter-date');
    filterDate.addEventListener('change', (event) => {
      filterCases();
    });
  
    // Função de busca de casos
    const searchInput = document.getElementById('search-case');
    searchInput.addEventListener('input', (event) => {
      searchCases(event.target.value);
    });
  
    // Função para filtrar os casos
    function filterCases() {
      const status = filterStatus.value;
      const dateOrder = filterDate.value;
      const cases = document.querySelectorAll('.case-list-item');
  
      cases.forEach((caseItem) => {
        const caseStatus = caseItem.querySelector('.case-status').textContent.toLowerCase();
        const caseDate = caseItem.querySelector('.case-meta span:first-child').textContent;
        
        // Filtra por status
        if (status !== 'all' && !caseStatus.includes(status)) {
          caseItem.style.display = 'none';
          return;
        }
  
        // Ordena por data
        if (dateOrder === 'recentes' && !isRecent(caseDate)) {
          caseItem.style.display = 'none';
        } else if (dateOrder === 'antigos' && isRecent(caseDate)) {
          caseItem.style.display = 'none';
        } else {
          caseItem.style.display = 'flex';
        }
      });
    }
  
    // Função auxiliar para verificar se a data é recente
    function isRecent(dateString) {
      const caseDate = new Date(dateString);
      const today = new Date();
      const timeDifference = today - caseDate;
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      return daysDifference <= 30; // Caso seja nos últimos 30 dias
    }
  
    // Função para buscar casos pelo ID ou título
    function searchCases(query) {
      const cases = document.querySelectorAll('.case-list-item');
      cases.forEach((caseItem) => {
        const caseId = caseItem.querySelector('.case-id').textContent.toLowerCase();
        const caseTitle = caseItem.querySelector('.case-title').textContent.toLowerCase();
        
        if (caseId.includes(query.toLowerCase()) || caseTitle.includes(query.toLowerCase())) {
          caseItem.style.display = 'flex';
        } else {
          caseItem.style.display = 'none';
        }
      });
    }
  
    // Inicializar os filtros ao carregar a página
    filterCases();
  });
  