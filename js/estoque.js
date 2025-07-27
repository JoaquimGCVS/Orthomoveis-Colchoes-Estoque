document.addEventListener("DOMContentLoaded", () => {
    const cardsContainer = document.getElementById("cardsContainer");
    const searchBar = document.getElementById("searchBar");
    const filtroCategoria = document.getElementById("filtroCategoria");

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

    // Função para carregar os produtos do localStorage
    const carregarProdutos = () => {
        const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        return produtos
            .map(p => ({ ...p, nome: p.nome.trim() }))
            .sort((a, b) => a.nome.localeCompare(b.nome));
    };
    
    

    // Função para salvar os produtos no localStorage
    const salvarProdutos = (produtos) => {
        const produtosOrdenados = produtos
            .map(p => ({ ...p, nome: p.nome.trim() }))
            .sort((a, b) => a.nome.localeCompare(b.nome));
        localStorage.setItem("produtos", JSON.stringify(produtosOrdenados));
    };
    

    // Função para renderizar os produtos
    const renderProdutos = (produtosFiltrados) => {
    
        cardsContainer.innerHTML = ""; // Limpa os cards existentes
        produtosFiltrados.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";
            
            card.innerHTML = `
                <div class="card__header">
                    <h3>${produto.nome}</h3>
                    <button class="excluir__produto" id="excluir__produto" data-id="${produto.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="linha2"></div>
                <p><strong>Categoria</strong>: ${formatarCategoria(produto.categoria)}</p>
                <p><strong>Valor Unitário</strong>: R$ ${parseFloat(produto.valorUnitario).toFixed(2)}</p>
                <p><strong>Estocado</strong>: ${produto.quantidadeEstocada}</p>
                <p><strong>Encomendado</strong>: ${produto.quantidadeEncomendada}</p>
                <div class="botoes__card">
                    <button id="verDetalhes" class="verDetalhes" data-id="${produto.id}">
                        <i class="fas fa-info-circle"></i> Detalhes
                    </button>
                    <button id="atualizarEstoque" class="atualizarEstoque" data-id="${produto.id}">
                        <i class="fas fa-sync-alt"></i> Atualizar
                    </button>
                    <button id="editarProduto" class="editarProduto" data-id="${produto.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            `;
    
            card.querySelector(".excluir__produto").addEventListener("click", (event) => {
                const produtoId = parseInt(event.target.closest("button").getAttribute("data-id"));
                if (confirm("Tem certeza que deseja excluir este produto?")) {
                    removerProduto(produtoId);
                }
            });
    
            cardsContainer.appendChild(card);
        });
    };
    

    // Função para remover um produto
    const removerProduto = (id) => {
        let produtos = carregarProdutos();

        // Remove o produto com o ID especificado
        produtos = produtos.filter(produto => produto.id !== id);

        // Atualiza os IDs dos produtos restantes
        produtos.forEach((produto, index) => {
            produto.id = index + 1;
        });

        // Salva a lista atualizada no localStorage
        salvarProdutos(produtos);

        alert("Produto removido com sucesso!");

        // Re-renderiza os produtos ordenados
        produtos.sort((a, b) => a.nome.localeCompare(b.nome));
        renderProdutos(produtos);

    };

    // Função para filtrar os produtos
    const filtrarProdutos = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const categoriaSelecionada = filtroCategoria.value;
    
        let produtos = carregarProdutos();
    
        const produtosFiltrados = produtos.filter(produto => {
            const nomeIncluiTermo = produto.nome.toLowerCase().includes(searchTerm);
            const categoriaCorreta = categoriaSelecionada === "TODAS" || produto.categoria === categoriaSelecionada;
            return nomeIncluiTermo && categoriaCorreta;
        });
    
        renderProdutos(produtosFiltrados);
    };    

    // Carrega os produtos do localStorage e renderiza inicialmente
    const produtos = carregarProdutos()
    .slice() // cria uma cópia do array
    .sort((a, b) => a.nome.trim().localeCompare(b.nome.trim()));
    renderProdutos(produtos);



    // Adiciona eventos de entrada na barra de pesquisa e mudança no filtro
    searchBar.addEventListener("input", filtrarProdutos);
    filtroCategoria.addEventListener("change", filtrarProdutos);
});