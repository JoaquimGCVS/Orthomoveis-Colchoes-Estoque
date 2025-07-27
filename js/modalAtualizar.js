document.addEventListener("DOMContentLoaded", () => {
    const modalAtualizar = document.getElementById("modalAtualizar");
    const fecharModalAtualizar = document.getElementById("fecharModalAtualizar");
    const confirmarAtualizacao = document.getElementById("confirmarAtualizacao");
    const quantidadeEncomendados = document.getElementById("quantidadeEncomendados");
    const quantidadeEstoque = document.getElementById("quantidadeEstoque");

    let produtoAtual = null;

    // Função para abrir o modal de atualizar
    document.getElementById("cardsContainer").addEventListener("click", (event) => {
        const botaoAtualizar = event.target.closest(".atualizarEstoque");
        if (botaoAtualizar) {
            const produtoId = parseInt(botaoAtualizar.getAttribute("data-id"));
            const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
            produtoAtual = produtos.find(p => p.id === produtoId);

            if (produtoAtual) {
                quantidadeEncomendados.textContent = produtoAtual.quantidadeEncomendada;
                quantidadeEstoque.textContent = produtoAtual.quantidadeEstocada;

                modalAtualizar.style.display = "flex";
            }
        }
    });

    // Função para fechar o modal
    fecharModalAtualizar.addEventListener("click", () => {
        modalAtualizar.style.display = "none";
    });

    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener("click", (event) => {
        if (event.target === modalAtualizar) {
            modalAtualizar.style.display = "none";
        }
    });

    // Função para confirmar a atualização
    confirmarAtualizacao.addEventListener("click", () => {
        if (produtoAtual) {
            const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

            // Atualiza os valores do produto
            produtoAtual.quantidadeEstocada += produtoAtual.quantidadeEncomendada;
            produtoAtual.quantidadeEncomendada = 0;

            // Salva os produtos atualizados no localStorage
            const index = produtos.findIndex(p => p.id === produtoAtual.id);
            if (index !== -1) {
                produtos[index] = produtoAtual;
                localStorage.setItem("produtos", JSON.stringify(produtos));
            }

            alert("Estoque atualizado com sucesso!");

            // Fecha o modal e recarrega os produtos
            modalAtualizar.style.display = "none";
            location.reload();
        }
    });
});