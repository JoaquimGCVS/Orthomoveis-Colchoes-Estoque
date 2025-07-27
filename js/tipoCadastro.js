document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("formCadastro");
    const tipoCadastro = document.getElementById("tipoCadastro");

    function renderFormularioProduto() {
        formCadastro.innerHTML = `
            <div class="input__linha">
                <div class="input__group">
                    <label for="nome">Nome <span class="obrigatorio">*</span></label>
                    <input id="nome" type="text" placeholder="Nome" required>
                </div>
                <div class="input__group">
                    <label for="categoria">Categoria <span class="obrigatorio">*</span></label>
                    <select id="categoria" name="categoria" required>
                        <option value="" disabled selected>Selecione a Categoria</option>
                        <option value="COLCHAO_DE_ESPUMA">Colchão de Espuma</option>
                        <option value="COLCHAO_DE_MOLA">Colchão de Mola</option>
                        <option value="COLCHAO_ORTOPEDICO">Colchão Ortopédico</option>
                        <option value="BOX">Box</option>
                        <option value="TRAVESSEIRO">Travesseiro</option>
                        <option value="ACESSORIO">Acessório</option>
                    </select>
                </div>
            </div>
            <div class="input__linha">
                <div class="input__group">
                    <label for="quantidadeEstocada">Quantidade Estocada</label>
                    <input id="quantidadeEstocada" type="number" placeholder="Quantidade Estocada">
                </div>
                <div class="input__group">
                    <label for="quantidadeEncomendada">Quantidade Encomendada</label>
                    <input id="quantidadeEncomendada" type="number" placeholder="Quantidade Encomendada">
                </div>
            </div>
            <div class="input__linha">
                <div class="input__group">
                    <label for="valorUnitario">Valor Unitário <span class="obrigatorio">*</span></label>
                    <input id="valorUnitario" type="number" step="0.01" placeholder="Valor Unitário" required>
                </div>
                <div class="input__group">
                    <label for="codigo">Código <span class="obrigatorio">*</span></label>
                    <input id="codigo" type="text" placeholder="Código" required>
                </div>
            </div>
            <button class="botao__adicionar" id="botaoAdicionar"><i class="fa-solid fa-plus"></i>
                <p>Adicionar</p>
            </button>
        `;
    }

    function renderFormularioCliente() {
        formCadastro.innerHTML = `
        <div class="input__linha">
            <div class="input__group">
                <label for="nomeCliente">Nome <span class="obrigatorio">*</span></label>
                <input id="nomeCliente" type="text" placeholder="Nome" required>
            </div>
            <div class="input__group">
                <label for="cpfCliente">CPF <span class="obrigatorio">*</span></label>
                <input id="cpfCliente" type="text" placeholder="CPF" required>
            </div>
        </div>
        <div class="input__linha">
            <div class="input__group">
                <label for="bairroCliente">Bairro <span class="obrigatorio">*</span></label>
                <input id="bairroCliente" type="text" placeholder="Bairro" required>
            </div>
            <div class="input__group">
                <label for="ruaCliente">Rua <span class="obrigatorio">*</span></label>
                <input id="ruaCliente" type="text" placeholder="Rua" required>
            </div>
        </div>
        <div class="input__linha">
            <div class="input__group">
                <label for="complementoCliente">Número do Domicílio + Complemento  <span class="obrigatorio">*</span></label>
                <input id="complementoCliente" type="text" placeholder="Número, Complemento " required>
            </div>
            <div class="input__group">
                <label for="telefoneCliente">Telefone<span class="obrigatorio">*</span></label>
                <input id="telefoneCliente" type="text" placeholder="(31) 98976-2345" required>
            </div>
        </div>
        <button class="botao__adicionar" id="botaoAdicionarCliente"><i class="fa-solid fa-plus"></i>
            <p>Adicionar</p>
        </button>
    `;
    }

function renderFormularioCompra() {
    // Carrega clientes e produtos do localStorage para popular os selects
    const clientes = (JSON.parse(localStorage.getItem("clientes")) || [])
        .sort((a, b) => a.nome.localeCompare(b.nome));
    const produtos = (JSON.parse(localStorage.getItem("produtos")) || [])
        .sort((a, b) => a.nome.localeCompare(b.nome));

    // Só produtos com estoque >= 1
    const optionsProdutos = produtos
        .filter(p => parseInt(p.quantidadeEstocada, 10) >= 1)
        .map(p => `<option value="${p.nome}">${p.nome}</option>`)
        .join("");

    const optionsClientes = clientes
        .map(c => `<option value="${c.cpf}">${c.nome} (${c.cpf})</option>`)
        .join("");

    formCadastro.innerHTML = `
        <div class="input__linha">
            <div class="input__group">
                <label for="cpfCompra">CPF do Cliente <span class="obrigatorio">*</span></label>
                <select id="cpfCompra" required>
                    <option value="" disabled selected>Selecione o Cliente</option>
                    ${optionsClientes}
                </select>
            </div>
            <div class="input__group">
                <label for="produtoCompra">Produto <span class="obrigatorio">*</span></label>
                <select id="produtoCompra" required>
                    <option value="" disabled selected>Selecione o Produto</option>
                    ${optionsProdutos}
                </select>
            </div>
        </div>
        <div class="input__linha">
            <div class="input__group">
                <label for="quantidadeCompra">Quantidade <span class="obrigatorio">*</span></label>
                <input id="quantidadeCompra" type="number" min="1" placeholder="Quantidade" required>
            </div>
            <div class="input__group">
                <label for="dataCompra">Data <span class="obrigatorio">*</span></label>
                <input id="dataCompra" type="text" placeholder="dd/MM/yyyy" maxlength="10" required>
            </div>
        </div>
        <div class="input__linha">
            <div class="input__group">
                <label for="valorUnitarioCompra">Valor Unitário <span class="obrigatorio">*</span></label>
                <input id="valorUnitarioCompra" type="number" step="0.01" min="0" placeholder="Valor Unitário" required>
            </div>
            <div class="input__group">
                <label for="totalCompra">Total</label>
                <input id="totalCompra" type="text" placeholder="Total" readonly>
            </div>
        </div>
        <button class="botao__adicionar" id="botaoAdicionarCompra"><i class="fa-solid fa-plus"></i>
            <p>Adicionar</p>
        </button>
    `;
}

// Máscara para data dd/MM/yyyy
function aplicarMascaraData(input) {
    input.addEventListener("input", function () {
        let value = input.value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        else if (value.length > 2) value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        input.value = value;
    });
}

// Atualiza o campo total automaticamente
function aplicarCalculoTotal() {
    const quantidadeInput = document.getElementById("quantidadeCompra");
    const valorUnitarioInput = document.getElementById("valorUnitarioCompra");
    const totalInput = document.getElementById("totalCompra");
    if (quantidadeInput && valorUnitarioInput && totalInput) {
        function atualizarTotal() {
            const qnt = parseFloat(quantidadeInput.value) || 0;
            const valor = parseFloat(valorUnitarioInput.value) || 0;
            totalInput.value = (qnt * valor).toFixed(2);
        }
        quantidadeInput.addEventListener("input", atualizarTotal);
        valorUnitarioInput.addEventListener("input", atualizarTotal);
    }
}

// Detecta troca de formulário e aplica máscaras/calculo se necessário
tipoCadastro.addEventListener("change", () => {
    setTimeout(() => {
        if (tipoCadastro.value === "COMPRA") {
            const dataInput = document.getElementById("dataCompra");
            if (dataInput) aplicarMascaraData(dataInput);
            aplicarCalculoTotal();
        }
    }, 100);
});

// Aplica ao carregar a página, caso o formulário de compra esteja ativo
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (tipoCadastro.value === "COMPRA") {
            const dataInput = document.getElementById("dataCompra");
            if (dataInput) aplicarMascaraData(dataInput);
            aplicarCalculoTotal();
        }
    }, 100);
});

// Função para aplicar máscara de CPF
function aplicarMascaraCPF(input) {
    input.addEventListener("input", function () {
        let value = input.value.replace(/\D/g, ""); // Remove tudo que não for dígito
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        input.value = value;
    });
}

// Função para aplicar máscara de telefone (formato: (31) 98976-2345)
function aplicarMascaraTelefone(input) {
    input.addEventListener("input", function () {
        let value = input.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 0) value = value.replace(/^(\d{2})/, "($1) ");
        if (value.length > 6) value = value.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
        input.value = value;
    });
}

// Aplica a máscara de CPF e Telefone sempre que o formulário de cliente for renderizado
function aplicarMascaraSeCliente() {
    const cpfInput = document.getElementById("cpfCliente");
    if (cpfInput) {
        aplicarMascaraCPF(cpfInput);
    }
    const telInput = document.getElementById("telefoneCliente");
    if (telInput) {
        aplicarMascaraTelefone(telInput);
    }
}

// Detecta troca de formulário e aplica a máscara se necessário
tipoCadastro.addEventListener("change", () => {
    setTimeout(aplicarMascaraSeCliente, 50);
});

// Aplica ao carregar a página, caso o formulário de cliente esteja ativo
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(aplicarMascaraSeCliente, 50);
});

    // Inicializa com o formulário de produto
    renderFormularioProduto();

    tipoCadastro.addEventListener("change", () => {
        if (tipoCadastro.value === "PRODUTO") {
            renderFormularioProduto();
        } else if (tipoCadastro.value === "CLIENTE") {
            renderFormularioCliente();
        } else if (tipoCadastro.value == 'COMPRA') {
            renderFormularioCompra();
        }
    });
});