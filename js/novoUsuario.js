document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("case-form");

  // Gerar ID do caso (exemplo simples)
  const caseIdInput = document.getElementById("case-id");
  caseIdInput.value = generateCaseId();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao salvar o caso.");

      alert("Caso salvo com sucesso!");
      form.reset();
      caseIdInput.value = generateCaseId(); // gera novo ID após envio
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao tentar salvar o caso.");
    }
  });

  // Botão Gerar Relatório
  const reportBtn = document.getElementById("generate-report");
  reportBtn.addEventListener("click", () => {
    alert("Função de gerar relatório ainda não implementada.");
  });

  // Dropdown de submenu da sidebar
  const dropdownButtons = document.querySelectorAll(".dropdown-btn");
  dropdownButtons.forEach((btn) => {
    btn.addEventListener("click", () => toggleSubMenu(btn));
  });
});

// Geração simples de ID tipo: CASO-1234
function generateCaseId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CASO-${random}`;
}

// Função de abrir/fechar submenu lateral
function toggleSubMenu(button) {
  const subMenu = button.nextElementSibling;
  subMenu.style.display = subMenu.style.display === "flex" ? "none" : "flex";
}
