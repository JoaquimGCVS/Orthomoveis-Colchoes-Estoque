document.addEventListener("DOMContentLoaded", () => {
    const cardsContainerClientes = document.getElementById("cardsContainerClientes");
    const searchBar = document.getElementById("searchBar");

    // Função para carregar os clientes do localStorage
    const carregarClientes = () => {
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        return clientes
            .map(c => ({ ...c, nome: c.nome.trim() }))
            .sort((a, b) => a.nome.localeCompare(b.nome));
    };

    // Função para salvar os clientes no localStorage
    const salvarClientes = (clientes) => {
        const clientesOrdenados = clientes
            .map(c => ({ ...c, nome: c.nome.trim() }))
            .sort((a, b) => a.nome.localeCompare(b.nome));
        localStorage.setItem("clientes", JSON.stringify(clientesOrdenados));
    };

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

    // Função para renderizar os clientes
    const renderClientes = (clientesFiltrados) => {
        cardsContainerClientes.innerHTML = ""; // Limpa os cards existentes
        clientesFiltrados.forEach(cliente => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card__header">
                    <h3>${cliente.nome}</h3>
                    <button class="excluir__cliente" id="excluir__cliente" data-id="${cliente.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="linha2"></div>
                <p><strong>CPF</strong>: ${cliente.cpf}</p>
                <p><strong>Bairro</strong>: ${cliente.bairro}</p>
                <p><strong>Telefone</strong>: ${cliente.telefone}</p>
                <div class="botoes__card">
                    <button class="verDetalhesCliente" id="verDetalhesCliente" data-id="${cliente.id}">
                        <i class="fas fa-info-circle"></i> Detalhes
                    </button>
                    <button class="editarCliente" id="editarCliente" data-id="${cliente.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            `;

            // Remover cliente
            card.querySelector(".excluir__cliente").addEventListener("click", (event) => {
                const clienteId = parseInt(event.target.closest("button").getAttribute("data-id"));
                if (confirm("Tem certeza que deseja excluir este cliente?")) {
                    removerCliente(clienteId);
                }
            });

            // Detalhes
            card.querySelector(".verDetalhesCliente").addEventListener("click", (event) => {
                const clienteId = parseInt(event.target.closest("button").getAttribute("data-id"));
                abrirModalDetalhes(clienteId);
            });

            // Editar
            card.querySelector(".editarCliente").addEventListener("click", (event) => {
                const clienteId = parseInt(event.target.closest("button").getAttribute("data-id"));
                abrirModalEditar(clienteId);
            });

            cardsContainerClientes.appendChild(card);
        });
    };

    // Função para remover um cliente
    const removerCliente = (id) => {
        let clientes = carregarClientes();
        clientes = clientes.filter(cliente => cliente.id !== id);
        // Atualiza os IDs dos clientes restantes
        clientes.forEach((cliente, index) => {
            cliente.id = index + 1;
        });
        salvarClientes(clientes);
        alert("Cliente removido com sucesso!");
        renderClientes(clientes);
    };

// Função para filtrar os clientes
const filtrarClientes = () => {
    let searchTerm = searchBar.value.trim();
    const searchTermUnmasked = searchTerm.replace(/\D/g, "");

    // Se for só número ou CPF parcialmente mascarado, filtra por CPF
    if (searchTermUnmasked.length > 0 && searchTermUnmasked.length <= 11) {
        const clientes = carregarClientes();
        const clientesFiltrados = clientes.filter(cliente =>
            cliente.cpf.replace(/\D/g, "").startsWith(searchTermUnmasked)
        );
        renderClientes(clientesFiltrados);
    } else {
        // Filtra por nome (ignorando acentos e caixa)
        const clientes = carregarClientes();
        const termo = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const clientesFiltrados = clientes.filter(cliente =>
            cliente.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(termo)
        );
        renderClientes(clientesFiltrados);
    }
};

searchBar.addEventListener("input", filtrarClientes);

    // MODAL DE DETALHES
    const modalDetalhes = document.getElementById("modalDetalhesCliente");
    const fecharModalDetalhes = document.getElementById("fecharModalDetalhesCliente");
    const detalhesCliente = document.getElementById("detalhesCliente");

    function abrirModalDetalhes(clienteId) {
        const clientes = carregarClientes();
        const cliente = clientes.find(c => c.id === clienteId);
        if (cliente) {
            detalhesCliente.innerHTML = `
                <div class="texto__detalhes">
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>CPF:</strong> ${cliente.cpf}</p>
                    <p><strong>Bairro:</strong> ${cliente.bairro}</p>
                    <p><strong>Rua:</strong> ${cliente.rua}</p>
                    <p><strong>Número + Complemento:</strong> ${cliente.complemento}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                </div>
            `;
            modalDetalhes.style.display = "flex";
        } else {
            alert("Cliente não encontrado.");
        }
    }

    fecharModalDetalhes.addEventListener("click", () => {
        modalDetalhes.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modalDetalhes) {
            modalDetalhes.style.display = "none";
        }
    });

    // MODAL DE EDIÇÃO
    const modalEditar = document.getElementById("modalEditarCliente");
    const formEditar = document.getElementById("formEditarCliente");
    const fecharModalEditar = document.getElementById("fecharModalEditarCliente");

    function abrirModalEditar(clienteId) {
        const clientes = carregarClientes();
        const cliente = clientes.find(c => c.id === clienteId);
        if (cliente) {
            document.getElementById("editarNomeCliente").value = cliente.nome;
            document.getElementById("editarCpfCliente").value = cliente.cpf;
            document.getElementById("editarBairroCliente").value = cliente.bairro;
            document.getElementById("editarRuaCliente").value = cliente.rua;
            document.getElementById("editarComplementoCliente").value = cliente.complemento || "";
            document.getElementById("editarTelefoneCliente").value = cliente.telefone || "";
            formEditar.setAttribute("data-id", clienteId);

            // Aplica a máscara de telefone no campo de edição
            aplicarMascaraTelefone(document.getElementById("editarTelefoneCliente"));

            modalEditar.style.display = "flex";
        } else {
            alert("Cliente não encontrado.");
        }
    }

    fecharModalEditar.addEventListener("click", () => {
        modalEditar.style.display = "none";
    });

    formEditar.addEventListener("submit", (event) => {
        event.preventDefault();
        const clienteId = parseInt(formEditar.getAttribute("data-id"));
        let clientes = carregarClientes();
        const index = clientes.findIndex(c => c.id === clienteId);
        if (index !== -1) {
            clientes[index] = {
                ...clientes[index],
                nome: document.getElementById("editarNomeCliente").value.trim(),
                cpf: document.getElementById("editarCpfCliente").value.trim(),
                bairro: document.getElementById("editarBairroCliente").value.trim(),
                rua: document.getElementById("editarRuaCliente").value.trim(),
                complemento: document.getElementById("editarComplementoCliente").value.trim(),
                telefone: document.getElementById("editarTelefoneCliente").value.trim()
            };
            salvarClientes(clientes);
            alert("Cliente atualizado com sucesso!");
            modalEditar.style.display = "none";
            renderClientes(carregarClientes());
        } else {
            alert("Erro ao atualizar o cliente.");
        }
    });

    // Inicializa
    renderClientes(carregarClientes());
    searchBar.addEventListener("input", filtrarClientes);
});