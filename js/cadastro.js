// Função para adicionar produto
function adicionarProdutoListener() {
    const botaoAdicionar = document.getElementById("botaoAdicionar");
    if (!botaoAdicionar) return;

    botaoAdicionar.addEventListener("click", (event) => {
        event.preventDefault();

        // Captura os valores do formulário
        const nome = document.querySelector("input[placeholder='Nome']").value.trim();
        const categoria = document.getElementById("categoria").value.trim();
        const quantidadeEstocada = document.querySelector("input[placeholder='Quantidade Estocada']").value.trim();
        const quantidadeEncomendada = document.querySelector("input[placeholder='Quantidade Encomendada']").value.trim();
        const valorUnitario = document.querySelector("input[placeholder='Valor Unitário']").value.trim();
        const codigoProduto = document.querySelector("input[placeholder='Código']").value.trim();

        // Lista de campos obrigatórios e suas mensagens
        const camposObrigatorios = [
            { campo: nome, mensagem: "O campo Nome é obrigatório." },
            { campo: categoria, mensagem: "O campo Categoria é obrigatório." },
            { campo: valorUnitario, mensagem: "O campo Valor Unitário é obrigatório." },
            { campo: codigoProduto, mensagem: "O campo Código é obrigatório." }
        ];

        // Verifica quais campos obrigatórios estão vazios
        const camposNaoPreenchidos = camposObrigatorios.filter(c => !c.campo);

        if (camposNaoPreenchidos.length > 0) {
            const mensagensErro = camposNaoPreenchidos.map(c => c.mensagem).join("\n");
            alert(`Por favor, preencha os seguintes campos obrigatórios:\n\n${mensagensErro}`);
            return;
        }

        // Recupera os produtos do localStorage ou inicializa uma lista vazia
        const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

        // Gera o próximo ID com base no tamanho da lista
        const novoId = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1;

        // Cria o objeto do produto
        const produto = {
            id: novoId,
            nome,
            categoria,
            quantidadeEstocada: parseInt(quantidadeEstocada) || 0,
            quantidadeEncomendada: parseInt(quantidadeEncomendada) || 0,
            valorUnitario: parseFloat(valorUnitario),
            ultimoValorUnitario: parseFloat(valorUnitario), // Define o mesmo valor do valorUnitario no cadastro
            codigoProduto
        };

        // Adiciona o novo produto à lista
        produtos.push(produto);

        // Salva a lista atualizada no localStorage
        localStorage.setItem("produtos", JSON.stringify(produtos));

        alert("Produto cadastrado com sucesso!");

        // Limpa o formulário
        document.querySelector("input[placeholder='Nome']").value = "";
        document.getElementById("categoria").value = "";
        document.querySelector("input[placeholder='Quantidade Estocada']").value = "";
        document.querySelector("input[placeholder='Quantidade Encomendada']").value = "";
        document.querySelector("input[placeholder='Valor Unitário']").value = "";
        document.querySelector("input[placeholder='Código']").value = "";
    });
}

// Função para adicionar cliente
function adicionarClienteListener() {
    const botaoAdicionarCliente = document.getElementById("botaoAdicionarCliente");
    if (!botaoAdicionarCliente) return;

    botaoAdicionarCliente.addEventListener("click", (event) => {
        event.preventDefault();

        // Captura os valores do formulário de cliente
        const nome = document.getElementById("nomeCliente").value.trim();
        const cpf = document.getElementById("cpfCliente").value.trim();
        const bairro = document.getElementById("bairroCliente").value.trim();
        const rua = document.getElementById("ruaCliente").value.trim();
        const complemento = document.getElementById("complementoCliente").value.trim();
        const telefone = document.getElementById("telefoneCliente").value.trim();

        // Lista de campos obrigatórios e suas mensagens
        const camposObrigatorios = [
            { campo: nome, mensagem: "O campo Nome é obrigatório." },
            { campo: cpf, mensagem: "O campo CPF é obrigatório." },
            { campo: bairro, mensagem: "O campo Bairro é obrigatório." },
            { campo: rua, mensagem: "O campo Rua é obrigatório." },
            { campo: complemento, mensagem: "O campo Complemento + Número do Domicílio é obrigatório." },
            { campo: telefone, mensagem: "O campo Telefone é obrigatório." }
        ];

        // Verifica quais campos obrigatórios estão vazios
        const camposNaoPreenchidos = camposObrigatorios.filter(c => !c.campo);

        if (camposNaoPreenchidos.length > 0) {
            const mensagensErro = camposNaoPreenchidos.map(c => c.mensagem).join("\n");
            alert(`Por favor, preencha os seguintes campos obrigatórios:\n\n${mensagensErro}`);
            return;
        }

        // Recupera os clientes do localStorage ou inicializa uma lista vazia
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

        // Gera o próximo ID com base no tamanho da lista
        const novoId = clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1;

        // Cria o objeto do cliente
        const cliente = {
            id: novoId,
            nome,
            cpf,
            bairro,
            rua,
            complemento,
            telefone
        };

        // Adiciona o novo cliente à lista
        clientes.push(cliente);

        // Salva a lista atualizada no localStorage
        localStorage.setItem("clientes", JSON.stringify(clientes));

        alert("Cliente cadastrado com sucesso!");

        // Limpa o formulário
        document.getElementById("nomeCliente").value = "";
        document.getElementById("cpfCliente").value = "";
        document.getElementById("bairroCliente").value = "";
        document.getElementById("ruaCliente").value = "";
        document.getElementById("complementoCliente").value = "";
        document.getElementById("telefoneCliente").value = "";
    });
}

// Detecta troca de formulário e adiciona o listener correto
const tipoCadastro = document.getElementById("tipoCadastro");
if (tipoCadastro) {
    tipoCadastro.addEventListener("change", () => {
        setTimeout(() => {
            if (tipoCadastro.value === "PRODUTO") {
                adicionarProdutoListener();
            } else if (tipoCadastro.value === "CLIENTE") {
                adicionarClienteListener();
            }
        }, 100); // Aguarda o DOM atualizar
    });
}

// Também adiciona ao carregar a página, caso o formulário de produto ou cliente esteja ativo
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (tipoCadastro && tipoCadastro.value === "PRODUTO") {
            adicionarProdutoListener();
        } else if (tipoCadastro && tipoCadastro.value === "CLIENTE") {
            adicionarClienteListener();
        }
    }, 100);
});