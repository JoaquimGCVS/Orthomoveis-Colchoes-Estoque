function isDataValida(dataStr) {
    // Verifica formato dd/MM/yyyy
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) return false;
    const [dia, mes, ano] = dataStr.split("/").map(Number);
    const data = new Date(ano, mes - 1, dia);
    // Verifica se a data existe e se bate com o que foi digitado
    return (
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia
    );
}

function isNumeroPositivoInteiro(valor) {
    return Number.isInteger(valor) && valor > 0;
}

function isValorMonetarioPositivo(valor) {
    return typeof valor === "number" && !isNaN(valor) && valor > 0;
}

// Função para adicionar compra
function adicionarCompraListener() {
    const botaoAdicionarCompra = document.getElementById("botaoAdicionarCompra");
    if (!botaoAdicionarCompra) return;

    botaoAdicionarCompra.addEventListener("click", (event) => {
        event.preventDefault();

        const cpf = document.getElementById("cpfCompra").value;
        const produtoNome = document.getElementById("produtoCompra").value;
        const quantidade = parseInt(document.getElementById("quantidadeCompra").value, 10);
        const data = document.getElementById("dataCompra").value.trim();
        const valorUnitario = parseFloat(document.getElementById("valorUnitarioCompra").value);
        const total = parseFloat(document.getElementById("totalCompra").value);

        // Validação de campos obrigatórios
        if (!cpf || !produtoNome || !data || !document.getElementById("quantidadeCompra").value || !document.getElementById("valorUnitarioCompra").value) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        // Validação de data
        if (!isDataValida(data)) {
            alert("Data inválida! Use o formato dd/MM/yyyy e uma data real.");
            return;
        }

        // Validação de quantidade
        if (!isNumeroPositivoInteiro(quantidade)) {
            alert("A quantidade deve ser um número inteiro positivo e maior que zero.");
            return;
        }

        // Validação de valor unitário
        if (!isValorMonetarioPositivo(valorUnitario)) {
            alert("O valor unitário deve ser um número positivo.");
            return;
        }

        // Validação de total
        if (!isValorMonetarioPositivo(total)) {
            alert("O total deve ser maior que zero.");
            return;
        }

        // Verifica se cliente existe
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        const clienteExiste = clientes.some(c => c.cpf === cpf);
        if (!clienteExiste) {
            alert("Cliente não cadastrado!");
            return;
        }

        // Verifica se produto existe
        const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        const produtoIndex = produtos.findIndex(p => p.nome === produtoNome);
        if (produtoIndex === -1) {
            alert("Produto não cadastrado!");
            return;
        }

        // Verifica estoque suficiente
        const estoqueAtual = parseInt(produtos[produtoIndex].quantidadeEstocada, 10);
        if (!isNumeroPositivoInteiro(estoqueAtual) || estoqueAtual < quantidade) {
            alert("Estoque insuficiente para essa compra!");
            return;
        }

        // Não permite compra futura (data maior que hoje)
        const hoje = new Date();
        const [dia, mes, ano] = data.split("/").map(Number);
        const dataCompra = new Date(ano, mes - 1, dia);
        if (dataCompra > hoje) {
            alert("A data da compra não pode ser no futuro.");
            return;
        }

        // Não permite valor unitário absurdo (ex: > 1 milhão)
        if (valorUnitario > 1000000) {
            alert("Valor unitário muito alto, verifique o valor digitado.");
            return;
        }

        // Atualiza estoque
        produtos[produtoIndex].quantidadeEstocada = estoqueAtual - quantidade;
        localStorage.setItem("produtos", JSON.stringify(produtos));

        // Salva a compra
        const compras = JSON.parse(localStorage.getItem("compras")) || [];
        const novoId = compras.length > 0 ? compras[compras.length - 1].id + 1 : 1;

        // Pegue o valor unitário do estoque do produto no momento da venda
        const valorUnitarioEstoque = parseFloat(produtos[produtoIndex].valorUnitario);

        const compra = {
            id: novoId,
            cpfCliente: cpf,
            nomeProduto: produtoNome,
            quantidade,
            data,
            valorUnitario,
            valorUnitarioEstoque, // <-- Adicionado aqui!
            total
        };
        compras.push(compra);
        localStorage.setItem("compras", JSON.stringify(compras));

        alert("Compra cadastrada com sucesso!");

        // Limpa o formulário
        document.getElementById("cpfCompra").value = "";
        document.getElementById("produtoCompra").value = "";
        document.getElementById("quantidadeCompra").value = "";
        document.getElementById("dataCompra").value = "";
        document.getElementById("valorUnitarioCompra").value = "";
        document.getElementById("totalCompra").value = "";
    });
}

// Detecta troca de formulário e adiciona o listener correto
if (typeof tipoCadastro !== "undefined" && tipoCadastro) {
    tipoCadastro.addEventListener("change", () => {
        setTimeout(adicionarCompraListener, 100);
    });
}
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(adicionarCompraListener, 100);
});