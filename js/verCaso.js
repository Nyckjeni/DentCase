document.addEventListener('DOMContentLoaded', function () {
    const addEvidenceBtn = document.getElementById('add-evidence');
    const evidenceModal = document.getElementById('evidence-modal');
    const reportModal = document.getElementById('report-modal');
    const closeButtons = document.querySelectorAll('.close');
    const evidenceForm = document.getElementById('evidence-form');
    const reportForm = document.getElementById('report-form');
    const getLocationBtn = document.getElementById('get-location');
    const generateReportBtn = document.getElementById('generate-report');
    const evidenceList = document.querySelector('.evidence-list');
    const sidebar = document.getElementById('sidebar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const emptyMessage = document.getElementById('empty-evidence-message');

    const evidences = [];

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/service-worker.js')
            .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
            .catch(err => console.error('❌ Erro no Service Worker:', err));
        });
      }

    // Função para atualizar estado do botão e mensagem de lista vazia
    const updateUIState = () => {
        generateReportBtn.disabled = evidences.length === 0;
        
        if (evidences.length === 0) {
            evidenceList.innerHTML = '';
            evidenceList.appendChild(emptyMessage);
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
        }
    };

    // Modais - Abertura e fechamento
    addEvidenceBtn.addEventListener('click', () => {
        evidenceModal.style.display = 'block';
    });

    // Novo: Abrir modal de laudo
    generateReportBtn.addEventListener('click', () => {
        abrirModalLaudo('CASO-001');
    });

    // Fechar modais
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === evidenceModal || event.target === reportModal) {
            event.target.style.display = 'none';
        }
    });

    // Geolocalização (mantido igual)
    getLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    document.getElementById('evidence-lat').value = position.coords.latitude.toFixed(6);
                    document.getElementById('evidence-long').value = position.coords.longitude.toFixed(6);
                },
                (error) => {
                    alert('Erro ao obter localização: ' + error.message);
                }
            );
        } else {
            alert('Geolocalização não suportada neste navegador.');
        }
    });

    // Formulário de evidência (com ajustes)
    evidenceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const type = document.getElementById('evidence-type').value;
        const description = document.getElementById('evidence-description').value;
        const lat = document.getElementById('evidence-lat').value;
        const long = document.getElementById('evidence-long').value;
        const file = document.getElementById('evidence-file').files[0];
        const collectionDate = document.getElementById('collection-date').value;
        const collectionTime = document.getElementById('collection-time').value;

        if (!type || !description || !file) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const newEvidence = {
            id: Date.now(),
            type,
            description,
            lat: lat || 'N/A',
            long: long || 'N/A',
            date: collectionDate ? `${collectionDate}T${collectionTime}` : new Date().toISOString(),
            fileType: file.type,
            // Novos campos adicionados
            imageUrl: document.getElementById('evidence-image-url').value || null,
            videoUrl: document.getElementById('evidence-video-url').value || null,
            documentUrl: document.getElementById('evidence-document-url').value || null
        };

        evidences.push(newEvidence);
        addEvidenceToList(newEvidence);

        evidenceForm.reset();
        evidenceModal.style.display = 'none';
        updateUIState(); // Atualizado para usar a nova função
    });

    // Função para adicionar evidência à lista (com melhorias)
    function addEvidenceToList(evidence) {
        const evidenceItem = document.createElement('div');
        evidenceItem.className = 'evidence-item';
        evidenceItem.setAttribute('data-evidence-id', evidence.id);

        const previewContent = evidence.imageUrl ? 
            `<img src="${evidence.imageUrl}" alt="Preview" class="evidence-thumbnail">` : 
            getEvidenceIcon(evidence.type);

        const detailsHTML = `
            <div class="evidence-preview">${previewContent}</div>
            <div class="evidence-details">
                <h3>${evidence.type.charAt(0).toUpperCase() + evidence.type.slice(1)} - ${evidence.description.substring(0, 30)}${evidence.description.length > 30 ? '...' : ''}</h3>
                <p><strong>Tipo:</strong> ${evidence.type}</p>
                <p><strong>Data:</strong> ${new Date(evidence.date).toLocaleDateString()}</p>
                <p><strong>Localização:</strong> Lat: ${evidence.lat}, Long: ${evidence.long}</p>
                <div class="evidence-actions">
                    <button class="btn btn-view"><i class="fas fa-eye"></i> Visualizar</button>
                    <button class="btn btn-laudo"><i class="fas fa-file-medical"></i> Gerar Laudo</button>
                    <button class="btn btn-delete"><i class="fas fa-trash"></i> Excluir</button>
                </div>
            </div>`;

        evidenceItem.innerHTML = detailsHTML;
        evidenceList.appendChild(evidenceItem);

        // Excluir
        evidenceItem.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir esta evidência?')) {
                evidenceItem.remove();
                const index = evidences.findIndex(e => e.id === evidence.id);
                if (index !== -1) evidences.splice(index, 1);
                updateUIState();
            }
        });

        // Laudo individual (atualizado)
        evidenceItem.querySelector('.btn-laudo').addEventListener('click', () => {
            gerarLaudoEvidencia(evidence.id);
        });
    }

    // Função para abrir modal de laudo (nova)
    function abrirModalLaudo(caseId) {
        document.getElementById('report-case-id').value = caseId;
        document.getElementById('report-date').valueAsDate = new Date();
        document.getElementById('report-modal').style.display = 'block';
    }

    // Função para gerar laudo de evidência específica (atualizada)
    function gerarLaudoEvidencia(evidenceId) {
        const evidence = evidences.find(e => e.id == evidenceId);
        if (evidence) {
            abrirModalLaudo('CASO-001');
            // Preenche automaticamente os campos com dados da evidência
            document.getElementById('report-findings').value = `Análise da evidência ${evidence.type}:\n${evidence.description}`;
        }
    }

    // Formulário de laudo (novo)
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateReport();
    });

    // Função para gerar relatório em PDF com jsPDF
    async function generateReport() {
        const reportDate = document.getElementById('report-date').value;
        const expertName = document.getElementById('expert-name').value;
        const findings = document.getElementById('report-findings').value;
        const conclusions = document.getElementById('report-conclusions').value;

        // Verificação simples de campos obrigatórios
        if (!reportDate || !expertName || !findings || !conclusions) {
            alert("Por favor, preencha todos os campos do relatório.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabeçalho
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Laudo Pericial - Caso #CASO-001`, 10, 20);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Perito: ${expertName}`, 10, 30);
        doc.text(`Data: ${reportDate}`, 10, 38);

        // Constatações
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(`Constatações:`, 10, 50);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(findings, 10, 58, { maxWidth: 180 });

        // Conclusões
        const conclusionsY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 110;
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(`Conclusões:`, 10, 110);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(conclusions, 10, 118, { maxWidth: 180 });

        // Salvar PDF
        const dateStr = new Date().toISOString().split('T')[0];
        doc.save(`laudo_CASO-001_${dateStr}.pdf`);

        // Fechar modal e resetar formulário
        document.getElementById('reportModal').style.display = 'none';
        document.getElementById('reportForm').reset();
    }

    // Funções auxiliares mantidas
    function getEvidenceIcon(type) {
        const icons = {
            'fotografia': '<i class="fas fa-image fa-3x"></i>',
            'raio-x': '<i class="fas fa-x-ray fa-3x"></i>',
            'documento': '<i class="fas fa-file-alt fa-3x"></i>',
            'outro': '<i class="fas fa-file-upload fa-3x"></i>'
        };
        return icons[type] || icons['outro'];
    }

    // Menu lateral (mantido igual)
    if (sidebar && hamburgerBtn) {
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                sidebar.classList.add('hidden');
            }
        });
    }

    // Gerenciamento de usuários (mantido igual)
    function toggleSubMenu(button) {
        const subMenu = button.nextElementSibling;
        subMenu.style.display = subMenu.style.display === "flex" ? "none" : "flex";
    }

    // Inicialização
    updateUIState();
});

