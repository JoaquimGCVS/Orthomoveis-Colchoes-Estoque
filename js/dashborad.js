document.addEventListener("DOMContentLoaded", () => {
    const carregarProdutos = () => JSON.parse(localStorage.getItem("produtos")) || [];
    const carregarClientes = () => JSON.parse(localStorage.getItem("clientes")) || [];
    const carregarCompras = () => JSON.parse(localStorage.getItem("compras")) || [];

    try {
        // --- PRODUTOS ---
        const produtos = carregarProdutos();

        // Valor total em estoque
        const valorTotalEstoque = produtos.reduce((total, produto) => {
            return total + (produto.valorUnitario * produto.quantidadeEstocada);
        }, 0);
        document.getElementById("valorTotalEstoque").textContent =
    `R$ ${valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;

        // Total de produtos em estoque
        const totalProdutosEstoque = produtos.reduce((total, produto) => {
            return total + produto.quantidadeEstocada;
        }, 0);
        document.getElementById("totalProdutosEstoque").textContent = totalProdutosEstoque;

        // Total de produtos encomendados
        const totalProdutosEncomendados = produtos.reduce((total, produto) => {
            return total + produto.quantidadeEncomendada;
        }, 0);
        document.getElementById("totalProdutosEncomendados").textContent = totalProdutosEncomendados;

        // Produto mais caro
        const produtoMaisCaro = produtos.reduce((maisCaro, produto) => {
            return produto.valorUnitario > (maisCaro.valorUnitario || 0) ? produto : maisCaro;
        }, {});
        document.getElementById("produtoMaisCaro").textContent = produtoMaisCaro.nome
            ? `${produtoMaisCaro.nome} - R$ ${produtoMaisCaro.valorUnitario.toFixed(2)}`
            : "N/A";

        // Produto mais estocado
        const produtoMaisEstocado = produtos.reduce((maisEstocado, produto) => {
            return produto.quantidadeEstocada > (maisEstocado.quantidadeEstocada || 0) ? produto : maisEstocado;
        }, {});
        document.getElementById("produtoMaisEstocado").textContent = produtoMaisEstocado.nome
            ? `${produtoMaisEstocado.nome} - ${produtoMaisEstocado.quantidadeEstocada} unidades`
            : "N/A";

        // Produto mais encomendado
        const produtoMaisEncomendado = produtos.reduce((maisEncomendado, produto) => {
            return produto.quantidadeEncomendada > (maisEncomendado.quantidadeEncomendada || 0) ? produto : maisEncomendado;
        }, {});
        document.getElementById("produtoMaisEncomendado").textContent = produtoMaisEncomendado.nome
            ? `${produtoMaisEncomendado.nome} - ${produtoMaisEncomendado.quantidadeEncomendada} unidades`
            : "N/A";

        // Total de produtos cadastrados
        document.getElementById("totalProdutosCadastrados").textContent = produtos.length;

        // --- GRÁFICO DE CATEGORIAS ---
        const categorias = produtos.reduce((acc, produto) => {
            acc[produto.categoria] = (acc[produto.categoria] || 0) + produto.quantidadeEstocada;
            return acc;
        }, {});
        const labelsCategorias = Object.keys(categorias).map(formatarCategoria);
        const dataCategorias = Object.values(categorias);

        const ctxCategorias = document.getElementById("graficoCategorias").getContext("2d");
        new Chart(ctxCategorias, {
            type: "pie",
            data: {
                labels: labelsCategorias,
                datasets: [{
                    label: "Distribuição de Categorias",
                    data: dataCategorias,
                    backgroundColor: [
                        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const total = dataCategorias.reduce((sum, value) => sum + value, 0);
                                const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                                return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Dados ao lado do gráfico de categorias
        const dadosCategorias = document.getElementById("dadosCategorias");
        dadosCategorias.innerHTML = "";
        Object.keys(categorias).forEach((categoria, index) => {
            const total = dataCategorias.reduce((sum, value) => sum + value, 0);
            const percentage = ((dataCategorias[index] / total) * 100).toFixed(2);
            const li = document.createElement("li");
            li.textContent = `${formatarCategoria(categoria)}: ${dataCategorias[index]} unidades (${percentage}%)`;
            dadosCategorias.appendChild(li);
        });

        // --- CLIENTES E COMPRAS ---
        const clientes = carregarClientes();
        const compras = carregarCompras();

        // Cliente mais frequente (mais compras)
        const freqMap = {};
        compras.forEach(c => {
            freqMap[c.cpfCliente] = (freqMap[c.cpfCliente] || 0) + 1;
        });
        let clienteMaisFrequente = null;
        let maxFreq = 0;
        Object.entries(freqMap).forEach(([cpf, freq]) => {
            if (freq > maxFreq) {
                maxFreq = freq;
                clienteMaisFrequente = clientes.find(c => c.cpf === cpf);
            }
        });
        document.querySelectorAll(".terceira__linha .visao__conteudo h3 + p")[0].textContent =
            clienteMaisFrequente ? `${clienteMaisFrequente.nome} - ${maxFreq} compras` : "N/A";

        // Cliente com maior valor total gasto
        const gastoMap = {};
        compras.forEach(c => {
            gastoMap[c.cpfCliente] = (gastoMap[c.cpfCliente] || 0) + (parseFloat(c.total) || 0);
        });
        let clienteMaiorGasto = null;
        let maxGasto = 0;
        Object.entries(gastoMap).forEach(([cpf, gasto]) => {
            if (gasto > maxGasto) {
                maxGasto = gasto;
                clienteMaiorGasto = clientes.find(c => c.cpf === cpf);
            }
        });
        document.querySelectorAll(".terceira__linha .visao__conteudo h3 + p")[1].textContent =
            clienteMaiorGasto ? `${clienteMaiorGasto.nome} - R$ ${maxGasto.toFixed(2)}` : "N/A";

        // Data com maior receita
        const receitaMap = {};
        compras.forEach(c => {
            receitaMap[c.data] = (receitaMap[c.data] || 0) + (parseFloat(c.total) || 0);
        });
        let dataMaiorReceita = null;
        let maxReceita = 0;
        Object.entries(receitaMap).forEach(([data, receita]) => {
            if (receita > maxReceita) {
                maxReceita = receita;
                dataMaiorReceita = data;
            }
        });
        document.querySelectorAll(".terceira__linha .visao__conteudo h3 + p")[2].textContent =
            dataMaiorReceita ? `${dataMaiorReceita} - R$ ${maxReceita.toFixed(2)}` : "N/A";

        // Última venda realizada: data, produto, nome do cliente
        let ultimaVenda = null;
        if (compras.length > 0) {
            ultimaVenda = compras.reduce((maisRecente, compra) => {
                const [d, m, y] = compra.data.split("/").map(Number);
                const dataCompra = new Date(y, m - 1, d);
                if (!maisRecente) return { compra, data: dataCompra };
                return dataCompra > maisRecente.data ? { compra, data: dataCompra } : maisRecente;
            }, null);
        }
        let ultimaVendaTexto = "N/A";
        if (ultimaVenda) {
            const cliente = clientes.find(c => c.cpf === ultimaVenda.compra.cpfCliente);
            ultimaVendaTexto = `${ultimaVenda.compra.data} - ${ultimaVenda.compra.nomeProduto} (${cliente ? cliente.nome : ultimaVenda.compra.cpfCliente})`;
        }
        document.querySelectorAll(".terceira__linha .visao__conteudo h3 + p")[3].textContent = ultimaVendaTexto;

        // --- GRÁFICO DE CLIENTES POR BAIRRO ---
        // Conta clientes por bairro
        const bairrosMap = {};
        clientes.forEach(cliente => {
            if (cliente.bairro) {
                bairrosMap[cliente.bairro] = (bairrosMap[cliente.bairro] || 0) + 1;
            }
        });
        
        // Total de clientes cadastrados (para cálculo correto das porcentagens)
        const totalClientesCadastrados = clientes.length;
        
        // Ordena os bairros por quantidade de clientes (decrescente) e depois alfabeticamente
        const bairrosOrdenados = Object.keys(bairrosMap).sort((a, b) => {
            const diffQuantidade = bairrosMap[b] - bairrosMap[a];
            return diffQuantidade !== 0 ? diffQuantidade : a.localeCompare(b);
        });
        
        // Determina se deve mostrar apenas os top 5 na legenda lateral
        const mostrarApenasTop5 = bairrosOrdenados.length > 5;
        let bairrosParaExibir = mostrarApenasTop5 ? bairrosOrdenados.slice(0, 5) : bairrosOrdenados;
        
        // Para o gráfico, sempre mostra todos os bairros
        const labelsBairros = bairrosOrdenados;
        const dataBairros = bairrosOrdenados.map(bairro => bairrosMap[bairro]);

        const ctxClientes = document.getElementById("graficoClientes");
        
        const atualizarLegendaBairros = (labels, data) => {
            const dadosClientesUl = document.getElementById("dadosClientes");
            if (dadosClientesUl) {
                dadosClientesUl.innerHTML = "";
                labels.forEach((bairro, index) => {
                    const total = data[index];
                    const percentage = ((total / totalClientesCadastrados) * 100).toFixed(2);
                    const li = document.createElement("li");
                    li.textContent = `${bairro}: ${total} clientes (${percentage}%)`;
                    dadosClientesUl.appendChild(li);
                });
            }
        };

        if (ctxClientes) {
            new Chart(ctxClientes, {
                type: "pie",
                data: {
                    labels: labelsBairros,
                    datasets: [{
                        label: "Clientes por Bairro",
                        data: dataBairros,
                        backgroundColor: [
                            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
                            "#FF9A8B", "#A8E6CF", "#FFD3A5", "#FD3A69", "#C44569", "#F8B500"
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    const percentage = ((tooltipItem.raw / totalClientesCadastrados) * 100).toFixed(2);
                                    return `${tooltipItem.label}: ${tooltipItem.raw} clientes (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
            
            atualizarLegendaBairros(bairrosParaExibir, bairrosParaExibir.map(bairro => bairrosMap[bairro]));
            
            // Controle do botão para abrir modal com todos os bairros
            const toggleButton = document.getElementById("toggleBairros");
            if (mostrarApenasTop5 && toggleButton) {
                toggleButton.style.display = "block";
                
                toggleButton.addEventListener("click", () => {
                    // Preenche o modal com todos os bairros
                    const modal = document.getElementById("modalTodosBairros");
                    const listaBairros = document.getElementById("listaBairros");
                    
                    if (listaBairros) {
                        listaBairros.innerHTML = "";
                        
                        bairrosOrdenados.forEach(bairro => {
                            const quantidade = bairrosMap[bairro];
                            const percentage = ((quantidade / totalClientesCadastrados) * 100).toFixed(2);
                            const p = document.createElement("p");
                            p.textContent = `${bairro}: ${quantidade} clientes (${percentage}%)`;
                            listaBairros.appendChild(p);
                        });
                    }
                    
                    modal.style.display = "flex";
                });
            }
            
            // Event listeners para fechar o modal
            const modal = document.getElementById("modalTodosBairros");
            const fecharModalBairros = document.getElementById("fecharModalBairros");
            
            if (fecharModalBairros) {
                fecharModalBairros.addEventListener("click", () => {
                    modal.style.display = "none";
                });
            }
            
            if (modal) {
                modal.addEventListener("click", (e) => {
                    if (e.target === modal) {
                        modal.style.display = "none";
                    }
                });
            }
        }
    } catch (error) {
        console.error("Erro ao carregar os dados do dashboard:", error);
    }
});

// Função para formatar a categoria
const formatarCategoria = (categoria) => {
    const categoriasFormatadas = {
        "COLCHAO_DE_MOLAS": "Colchão de Mola",
        "COLCHAO_DE_ESPUMA": "Colchão de Espuma",
        "COLCHAO_ORTOPEDICO" : "Colchão Ortopédico",
        "TRAVESSEIRO": "Travesseiro",
        "BOX": "Box",
        "ACESSORIO": "Acessórios"
    };
    return categoriasFormatadas[categoria] || categoria;
};