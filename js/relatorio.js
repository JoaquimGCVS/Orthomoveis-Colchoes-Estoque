document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector(".main");

    // Carrega clientes e produtos para os selects
    const clientes = (JSON.parse(localStorage.getItem("clientes")) || []).sort((a, b) => a.nome.localeCompare(b.nome));
    const produtos = (JSON.parse(localStorage.getItem("produtos")) || []).sort((a, b) => a.nome.localeCompare(b.nome));
    const optionsClientes = clientes.map(
        c => `<option value="${c.cpf}">${c.nome} (${c.cpf})</option>`
    ).join("");
    const optionsProdutos = produtos.map(
        p => `<option value="${p.nome}">${p.nome}</option>`
    ).join("");

    main.innerHTML += `
        <div class="relatorio__filtros">
            <div class="input__group">
                <label for="filtroCliente">Cliente</label>
                <select id="filtroCliente">
                    <option value="" disabled selected hidden>Selecione um cliente</option>
                    ${optionsClientes}
                </select>
            </div>
            <div class="input__group">
                <label for="filtroProduto">Produto</label>
                <select id="filtroProduto">
                    <option value="" disabled selected hidden>Selecione um produto</option>
                    ${optionsProdutos}
                </select>
            </div>
            <div class="input__group">
                <label for="filtroData">Data</label>
                <input type="text" id="filtroData" placeholder="dd/MM/yyyy" maxlength="10">
            </div>
        </div>
        <div id="relatorioCompras"></div>
        <div class="modal" id="modalDetalhesCompra">
            <div class="modal__content">
                <button class="modal__close" id="fecharModalDetalhesCompra">&times;</button>
                <h2><i class="fas fa-info-circle"></i> Detalhes da Venda</h2>
                <div class="linha"></div>
                <div id="detalhesCompra"></div>
            </div>
        </div>
    `;

    const filtroCliente = document.getElementById("filtroCliente");
    const filtroProduto = document.getElementById("filtroProduto");
    const filtroData = document.getElementById("filtroData");
    const relatorioCompras = document.getElementById("relatorioCompras");
    const modalDetalhes = document.getElementById("modalDetalhesCompra");
    const fecharModalDetalhes = document.getElementById("fecharModalDetalhesCompra");
    const detalhesCompra = document.getElementById("detalhesCompra");

    // Máscara para data
    filtroData.addEventListener("input", function () {
        let value = filtroData.value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        else if (value.length > 2) value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        filtroData.value = value;
        if (value.length === 10) {
            filtroCliente.value = "";
            filtroProduto.value = "";
        }
        gerarRelatorio();
    });

    filtroCliente.addEventListener("change", () => {
        if (filtroCliente.value) {
            filtroData.value = "";
            filtroProduto.value = "";
        }
        gerarRelatorio();
    });

    filtroProduto.addEventListener("change", () => {
        if (filtroProduto.value) {
            filtroCliente.value = "";
            filtroData.value = "";
        }
        gerarRelatorio();
    });

    fecharModalDetalhes.addEventListener("click", () => {
        modalDetalhes.style.display = "none";
    });
    window.addEventListener("click", (e) => {
        if (e.target === modalDetalhes) modalDetalhes.style.display = "none";
    });

    function gerarRelatorio() {
        const compras = JSON.parse(localStorage.getItem("compras")) || [];
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        let filtradas = [];

        const cpf = filtroCliente.value;
        const data = filtroData.value;
        const produtoNome = filtroProduto.value;

        if (cpf) {
            filtradas = compras.filter(c => c.cpfCliente === cpf);
            filtradas.sort((a, b) => {
                const [da, ma, ya] = a.data.split("/").map(Number);
                const [db, mb, yb] = b.data.split("/").map(Number);
                const dataA = new Date(ya, ma - 1, da);
                const dataB = new Date(yb, mb - 1, db);
                return dataB - dataA;
            });
        } else if (data.length === 10) {
            filtradas = compras.filter(c => c.data === data);
            filtradas.sort((a, b) => {
                const nomeA = getNomeCliente(a.cpfCliente, clientes).toLowerCase();
                const nomeB = getNomeCliente(b.cpfCliente, clientes).toLowerCase();
                return nomeA.localeCompare(nomeB);
            });
        } else if (produtoNome) {
            filtradas = compras.filter(c => c.nomeProduto === produtoNome);
            filtradas.sort((a, b) => {
                const [da, ma, ya] = a.data.split("/").map(Number);
                const [db, mb, yb] = b.data.split("/").map(Number);
                const dataA = new Date(ya, ma - 1, da);
                const dataB = new Date(yb, mb - 1, db);
                return dataB - dataA;
            });
        } else {
            relatorioCompras.innerHTML = "";
            return;
        }

        if (filtradas.length === 0) {
            relatorioCompras.innerHTML = "<p style='margin-top:2rem;text-align:center;'>Nenhuma compra encontrada.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Data</th>
                        <th>Valor Estoque</th>
                        <th>Valor Venda</th>
                        <th>Gerenciar</th>
                    </tr>
                </thead>
                <tbody>
        `;
        filtradas.forEach(compra => {
            const nome = getNomeCliente(compra.cpfCliente, clientes);
            html += `
                <tr>
                    <td>${nome}</td>
                    <td>${compra.cpfCliente}</td>
                    <td>${compra.data}</td>
                    <td>R$ ${parseFloat(compra.valorUnitarioEstoque).toFixed(2)}</td>
                    <td>R$ ${parseFloat(compra.valorUnitario).toFixed(2)}</td>
                    <td>
                        <div class="botoes__card">
                            <button class="verDetalhes" data-id="${compra.id}">
                                <i class="fas fa-info-circle"></i> Detalhes
                            </button>
                            <button class="excluir__produto excluir__compra" data-id="${compra.id}">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        html += "</tbody></table>";
        relatorioCompras.innerHTML = html;

        // Botões de detalhes
        document.querySelectorAll(".verDetalhes").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                exibirDetalhesCompra(id);
            });
        });
        // Botões de excluir
        document.querySelectorAll(".excluir__compra").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                excluirCompra(id);
            });
        });
    }

    function getNomeCliente(cpf, clientes) {
        const cliente = clientes.find(c => c.cpf === cpf);
        return cliente ? cliente.nome : "(Desconhecido)";
    }

    // Função para formatar a categoria
    const formatarCategoria = (categoria) => {
        const categoriasFormatadas = {
            "COLCHAO_DE_MOLA": "Colchão de Mola",
            "COLCHAO_DE_ESPUMA": "Colchão de Espuma",
            "TRAVESSEIRO": "Travesseiro",
            "BOX": "Box",
            "ACESSORIO": "Acessório"
        };

        return categoriasFormatadas[categoria] || categoria;
    };

    function exibirDetalhesCompra(id) {
        const compras = JSON.parse(localStorage.getItem("compras")) || [];
        const clientes = (JSON.parse(localStorage.getItem("clientes")) || [])
        .sort((a, b) => a.nome.localeCompare(b.nome));
        const produtos = (JSON.parse(localStorage.getItem("produtos")) || [])
        .sort((a, b) => a.nome.localeCompare(b.nome));
        const compra = compras.find(c => c.id === id);
        if (!compra) return;

        const nome = getNomeCliente(compra.cpfCliente, clientes);
        const produto = produtos.find(p => p.nome === compra.nomeProduto);

        detalhesCompra.innerHTML = `
            <div class="texto__detalhes">
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>CPF:</strong> ${compra.cpfCliente}</p>
                <p><strong>Data:</strong> ${compra.data}</p>
                <p><strong>Produto:</strong> ${compra.nomeProduto}</p>
                <p><strong>Categoria:</strong> ${produto ? formatarCategoria(produto.categoria) : '-'}</p>
                <p><strong>Código do Produto:</strong> ${produto ? (produto.codigoProduto || '-') : '-'}</p>
                <p><strong>Quantidade:</strong> ${compra.quantidade}</p>
                <p><strong>Valor por Unidade:</strong> R$ ${parseFloat(compra.valorUnitario).toFixed(2)}</p>
                <p><strong>Total:</strong> R$ ${parseFloat(compra.total).toFixed(2)}</p>
            </div>
        `;
        modalDetalhes.style.display = "flex";
    }

    function excluirCompra(id) {
        if (!confirm("Tem certeza que deseja excluir esta compra?")) return;
        let compras = JSON.parse(localStorage.getItem("compras")) || [];
        compras = compras.filter(c => c.id !== id);
        localStorage.setItem("compras", JSON.stringify(compras));
        gerarRelatorio();
    }

    // Inicializa vazio
    relatorioCompras.innerHTML = "<p style='margin-top:2rem;text-align:center;'>Pesquise por cliente, produto ou data para ver o relatório.</p>";
});