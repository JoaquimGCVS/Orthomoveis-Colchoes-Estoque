document.addEventListener("DOMContentLoaded", () => {
    const botaoEntrar = document.getElementById("botao__entrar");

    // Credenciais fixas
    const adminEmail = "admin@gmail.com";
    const adminPassword = "123";

    botaoEntrar.addEventListener("click", (event) => {
        event.preventDefault();

        // Captura os valores dos campos de email e senha
        const email = document.querySelector("input[type='email']").value;
        const password = document.querySelector("input[type='password']").value;

        // Verifica as credenciais
        if (email === adminEmail && password === adminPassword) {
            alert("Login realizado com sucesso!");
            // Redireciona para a página principal
            window.location.href = "../pages/dashboard.html";
        } else {
            alert("Credenciais inválidas. Tente novamente.");
        }
    });
});