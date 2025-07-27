document.addEventListener("DOMContentLoaded", () => {
    const modalEditar = document.getElementById("modalEditar");
    const formEditar = document.getElementById("formEditar");
    const fecharModal = document.getElementById("fecharModal");

    const carregarProdutos = () => JSON.parse(localStorage.getItem("produtos")) || [];
    const salvarProdutos = (produtos) => localStorage.setItem("produtos", JSON.stringify(produtos));

    document.getElementById("cardsContainer").addEventListener("click", (event) => {
        const botaoEditar = event.target.closest(".editarProduto");
        if (botaoEditar) {
            const produtoId = parseInt(botaoEditar.getAttribute("data-id"));
            const produtos = carregarProdutos();
            const produto = produtos.find(p => p.id === produtoId);

            if (produto) {
                document.getElementById("editarNome").value = produto.nome;
                document.getElementById("editarCategoria").value = produto.categoria;
                document.getElementById("editarQuantidadeEstocada").value = produto.quantidadeEstocada;
                document.getElementById("editarQuantidadeEncomendada").value = produto.quantidadeEncomendada;
                document.getElementById("editarValorUnitario").value = produto.valorUnitario;
                document.getElementById("editarCodigo").value = produto.codigoProduto;

                formEditar.setAttribute("data-id", produtoId);
                modalEditar.style.display = "flex";
            } else {
                alert("Produto não encontrado.");
            }
        }
    });

    fecharModal.addEventListener("click", () => {
        modalEditar.style.display = "none";
    });

    formEditar.addEventListener("submit", (event) => {
        event.preventDefault();

        const produtoId = parseInt(formEditar.getAttribute("data-id"));
        const produtos = carregarProdutos();

        const produtoAtualizado = {
            ...produtos.find(p => p.id === produtoId),
            nome: document.getElementById("editarNome").value,
            categoria: document.getElementById("editarCategoria").value,
            quantidadeEstocada: parseInt(document.getElementById("editarQuantidadeEstocada").value),
            quantidadeEncomendada: parseInt(document.getElementById("editarQuantidadeEncomendada").value),
            codigoProduto: document.getElementById("editarCodigo").value,
        };

        const novoValorUnitario = parseFloat(document.getElementById("editarValorUnitario").value);
        if (produtoAtualizado.valorUnitario !== novoValorUnitario) {
            produtoAtualizado.ultimoValorUnitario = produtoAtualizado.valorUnitario;
            produtoAtualizado.valorUnitario = novoValorUnitario;
        }

        const index = produtos.findIndex(p => p.id === produtoId);
        if (index !== -1) {
            produtos[index] = produtoAtualizado;
            salvarProdutos(produtos);

            alert("Produto atualizado com sucesso!");
            modalEditar.style.display = "none";
            location.reload();
        } else {
            alert("Erro ao atualizar o produto.");
        }
    });
});