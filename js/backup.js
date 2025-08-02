document.addEventListener("DOMContentLoaded", () => {
    const exportarBtn = document.getElementById("exportar_dados");
    const importarBtn = document.getElementById("importar_dados");
    const inputImportar = document.getElementById("input_importar_backup");

    // Exportar backup
    exportarBtn.addEventListener("click", () => {
        const chaves = ["clientes", "produtos", "compras"];
        const backup = {};
        chaves.forEach(chave => {
            backup[chave] = JSON.parse(localStorage.getItem(chave) || "[]");
        });

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "backup_orthomoveis.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Importar backup
    importarBtn.addEventListener("click", () => {
        inputImportar.click();
    });

    inputImportar.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const backup = JSON.parse(e.target.result);
                // Adicione aqui todas as chaves que deseja importar
                if (backup.clientes) localStorage.setItem("clientes", JSON.stringify(backup.clientes));
                if (backup.produtos) localStorage.setItem("produtos", JSON.stringify(backup.produtos));
                if (backup.compras) localStorage.setItem("compras", JSON.stringify(backup.compras));
                alert("Backup importado com sucesso! Recarregue a página para ver as alterações.");
            } catch (err) {
                alert("Arquivo de backup inválido.");
            }
        };
        reader.readAsText(file);
        // Limpa o input para permitir importar o mesmo arquivo novamente se necessário
        event.target.value = "";
    });
});