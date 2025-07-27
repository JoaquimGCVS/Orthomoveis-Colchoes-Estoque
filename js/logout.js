document.addEventListener("DOMContentLoaded", () => {
    const botaoLogout = document.getElementById("botao__logout");

    botaoLogout.addEventListener("click", () => {
        // Exibe um alerta de confirmação antes de realizar o logout
        const confirmarLogout = confirm("Tem certeza que deseja sair?");
        if (confirmarLogout) {
            // Limpa os dados de autenticação (exemplo: localStorage ou sessionStorage)
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");

            // Redireciona para a página de login
            window.location.href = "../index.html";
        }
    });
});