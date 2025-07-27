document.addEventListener("DOMContentLoaded", () => {
    const modalDetalhes = document.getElementById("modalDetalhes");
    const fecharModalDetalhes = document.getElementById("fecharModalDetalhes");
    const detalhesProduto = document.getElementById("detalhesProduto");

    // Função para carregar os produtos do localStorage
    const carregarProdutos = () => {
        return JSON.parse(localStorage.getItem("produtos")) || [];
    };

    // Função para abrir o modal e preencher os detalhes do produto
    document.getElementById("cardsContainer").addEventListener("click", (event) => {
        const botaoDetalhes = event.target.closest(".verDetalhes"); // Verifica se o clique foi no botão ou em um elemento filho
        if (botaoDetalhes) {
            const produtoId = parseInt(botaoDetalhes.getAttribute("data-id"));
            const produtos = carregarProdutos();
            const produto = produtos.find(p => p.id === produtoId);

            if (produto) {
                // Preenche os detalhes do modal com os dados do produto
                detalhesProduto.innerHTML = `
                    <div class="texto__detalhes">
                        <p><strong>Nome:</strong> ${produto.nome}</p>
                        <p><strong>Categoria:</strong> ${formatarCategoria(produto.categoria)}</p>
                        <p><strong>Quantidade Estocada:</strong> ${produto.quantidadeEstocada}</p>
                        <p><strong>Quantidade Encomendada:</strong> ${produto.quantidadeEncomendada}</p>
                        <p><strong>Valor Unitário:</strong> R$ ${parseFloat(produto.valorUnitario).toFixed(2)}</p>
                        <p><strong>Último Valor Unitário:</strong> R$ ${produto.ultimoValorUnitario ? parseFloat(produto.ultimoValorUnitario).toFixed(2) : "N/A"}</p>
                        <p><strong>Código:</strong> ${produto.codigoProduto}</p>
                    </div>
                `;

                // Abre o modal
                modalDetalhes.style.display = "flex";
            } else {
                alert("Produto não encontrado.");
            }
        }
    });

    // Função para fechar o modal
    fecharModalDetalhes.addEventListener("click", () => {
        modalDetalhes.style.display = "none";
    });

    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener("click", (event) => {
        if (event.target === modalDetalhes) {
            modalDetalhes.style.display = "none";
        }
    });
});

// Função para formatar a categoria
const formatarCategoria = (categoria) => {
    const categoriasFormatadas = {
        "COLCHAO_DE_MOLA": "Colchão de Mola",
        "COLCHAO_DE_ESPUMA": "Colchão de Espuma",
        "COLCHAO_ORTOPEDICO": "Colchão Ortopédico",
        "TRAVESSEIRO": "Travesseiro",
        "BOX": "Box",
        "ACESSORIO": "Acessório"
    };

    return categoriasFormatadas[categoria] || categoria;
};