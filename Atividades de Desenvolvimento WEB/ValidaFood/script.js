// ==========================================
// VALIDAFOOD
// Sistema de controle de validade de alimentos
// ==========================================


// Lista de alimentos
let alimentos = JSON.parse(
    localStorage.getItem("alimentos")
) || [];


// Elementos do HTML
const formulario = document.getElementById("formAlimento");

const nomeInput = document.getElementById("nome");

const quantidadeInput = document.getElementById("quantidade");

const validadeInput = document.getElementById("validade");

const localInput = document.getElementById("local");

const observacaoInput = document.getElementById("observacao");

const listaAlimentos = document.getElementById("listaAlimentos");

const mensagemVazia = document.getElementById("mensagemVazia");

const pesquisaInput = document.getElementById("pesquisa");

const indiceEdicao = document.getElementById("indiceEdicao");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const botaoSalvar =
    document.getElementById("botaoSalvar");


// ==========================================
// SALVAR NO NAVEGADOR
// ==========================================

function salvarAlimentos() {

    localStorage.setItem(
        "alimentos",
        JSON.stringify(alimentos)
    );

}


// ==========================================
// CALCULAR SITUAÇÃO DO ALIMENTO
// ==========================================

function verificarValidade(dataValidade) {

    // Data atual
    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);


    // Data de validade
    const validade = new Date(
        dataValidade + "T00:00:00"
    );

    validade.setHours(0, 0, 0, 0);


    // Diferença em milissegundos
    const diferenca =
        validade - hoje;


    // Converter para dias
    const dias = Math.ceil(
        diferenca / (1000 * 60 * 60 * 24)
    );


    // Produto vencido
    if (dias < 0) {

        return {
            situacao: "vencido",
            dias: dias
        };

    }


    // Produto vencendo em até 7 dias
    if (dias <= 7) {

        return {
            situacao: "proximo",
            dias: dias
        };

    }


    // Produto normal
    return {
        situacao: "normal",
        dias: dias
    };

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==========================================
// TEXTO DO STATUS
// ==========================================

function textoStatus(resultado) {

    if (resultado.situacao === "vencido") {

        return "🔴 Vencido";

    }


    if (resultado.situacao === "proximo") {

        if (resultado.dias === 0) {

            return "⚠️ Vence hoje";

        }

        if (resultado.dias === 1) {

            return "⚠️ Vence amanhã";

        }

        return `⚠️ Vence em ${resultado.dias} dias`;

    }


    return `✅ Faltam ${resultado.dias} dias`;

}


// ==========================================
// ADICIONAR / EDITAR ALIMENTO
// ==========================================

formulario.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const alimento = {

            nome: nomeInput.value.trim(),

            quantidade:
                Number(quantidadeInput.value),

            validade:
                validadeInput.value,

            local:
                localInput.value,

            observacao:
                observacaoInput.value.trim()

        };


        // Verifica se estamos editando
        const indice = indiceEdicao.value;


        if (indice !== "") {

            alimentos[indice] = alimento;

            alert("Alimento atualizado com sucesso!");

        } else {

            alimentos.push(alimento);

            alert("Alimento adicionado com sucesso!");

        }


        // Salvar
        salvarAlimentos();


        // Limpar formulário
        formulario.reset();

        indiceEdicao.value = "";


        tituloFormulario.textContent =
            "Adicionar alimento";


        botaoSalvar.textContent =
            "➕ Adicionar alimento";


        // Atualizar tela
        mostrarAlimentos();

    }
);


// ==========================================
// MOSTRAR ALIMENTOS
// ==========================================

function mostrarAlimentos(filtro = "") {

    listaAlimentos.innerHTML = "";


    // Filtrar alimentos
    const alimentosFiltrados =
        alimentos.filter(function(alimento) {

            return alimento.nome
                .toLowerCase()
                .includes(filtro.toLowerCase());

        });


    // Mostrar mensagem caso não tenha alimentos
    if (alimentosFiltrados.length === 0) {

        mensagemVazia.style.display = "block";

    } else {

        mensagemVazia.style.display = "none";

    }


    // Criar cada alimento
    alimentosFiltrados.forEach(
        function(alimento) {

            const indice =
                alimentos.indexOf(alimento);


            const resultado =
                verificarValidade(
                    alimento.validade
                );


            const div =
                document.createElement("div");


            div.classList.add(
                "alimento"
            );


            if (
                resultado.situacao ===
                "proximo"
            ) {

                div.classList.add(
                    "proximo"
                );

            }


            if (
                resultado.situacao ===
                "vencido"
            ) {

                div.classList.add(
                    "vencido"
                );

            }


            div.innerHTML = `

                <div class="alimento-topo">

                    <h3>
                        ${obterEmoji(alimento.nome)}
                        ${alimento.nome}
                    </h3>

                    <span class="status ${resultado.situacao}">
                        ${textoStatus(resultado)}
                    </span>

                </div>


                <div class="informacoes">

                    <span>
                        📦 Quantidade:
                        <strong>
                            ${alimento.quantidade}
                        </strong>
                    </span>

                    <span>
                        📅 Validade:
                        <strong>
                            ${formatarData(alimento.validade)}
                        </strong>
                    </span>

                    <span>
                        📍 Local:
                        <strong>
                            ${alimento.local}
                        </strong>
                    </span>

                </div>


                ${
                    alimento.observacao
                    ?
                    `
                    <div class="observacao">
                        📝 ${alimento.observacao}
                    </div>
                    `
                    :
                    ""
                }


                <div class="acoes">

                    <button
                        class="botao editar"
                        onclick="editarAlimento(${indice})"
                    >
                        ✏️ Editar
                    </button>


                    <button
                        class="botao excluir"
                        onclick="excluirAlimento(${indice})"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            `;


            listaAlimentos.appendChild(div);

        }
    );


    atualizarContadores();

}


// ==========================================
// EMOJIS
// ==========================================

function obterEmoji(nome) {

    const nomeMinusculo =
        nome.toLowerCase();


    if (
        nomeMinusculo.includes("leite")
    ) {

        return "🥛";

    }


    if (
        nomeMinusculo.includes("arroz")
    ) {

        return "🍚";

    }


    if (
        nomeMinusculo.includes("pão") ||
        nomeMinusculo.includes("pao")
    ) {

        return "🍞";

    }


    if (
        nomeMinusculo.includes("queijo")
    ) {

        return "🧀";

    }


    if (
        nomeMinusculo.includes("carne")
    ) {

        return "🥩";

    }


    if (
        nomeMinusculo.includes("maçã") ||
        nomeMinusculo.includes("maca")
    ) {

        return "🍎";

    }


    if (
        nomeMinusculo.includes("banana")
    ) {

        return "🍌";

    }


    if (
        nomeMinusculo.includes("iogurte") ||
        nomeMinusculo.includes("yogurte")
    ) {

        return "🥛";

    }


    return "🥫";

}


// ==========================================
// EDITAR ALIMENTO
// ==========================================

function editarAlimento(indice) {

    const alimento =
        alimentos[indice];


    nomeInput.value =
        alimento.nome;


    quantidadeInput.value =
        alimento.quantidade;


    validadeInput.value =
        alimento.validade;


    localInput.value =
        alimento.local;


    observacaoInput.value =
        alimento.observacao;


    indiceEdicao.value =
        indice;


    tituloFormulario.textContent =
        "Editar alimento";


    botaoSalvar.textContent =
        "💾 Salvar alterações";


    // Rolar para o formulário
    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// EXCLUIR ALIMENTO
// ==========================================

function excluirAlimento(indice) {

    const alimento =
        alimentos[indice];


    const confirmar =
        confirm(
            `Deseja excluir "${alimento.nome}"?`
        );


    if (!confirmar) {

        return;

    }


    alimentos.splice(indice, 1);


    salvarAlimentos();


    mostrarAlimentos();

}


// ==========================================
// CONTADORES
// ==========================================

function atualizarContadores() {

    let normal = 0;

    let proximo = 0;

    let vencido = 0;


    alimentos.forEach(
        function(alimento) {

            const resultado =
                verificarValidade(
                    alimento.validade
                );


            if (
                resultado.situacao ===
                "normal"
            ) {

                normal++;

            }


            if (
                resultado.situacao ===
                "proximo"
            ) {

                proximo++;

            }


            if (
                resultado.situacao ===
                "vencido"
            ) {

                vencido++;

            }

        }
    );


    document.getElementById(
        "totalNormal"
    ).textContent = normal;


    document.getElementById(
        "totalProximo"
    ).textContent = proximo;


    document.getElementById(
        "totalVencido"
    ).textContent = vencido;

}


// ==========================================
// PESQUISA
// ==========================================

pesquisaInput.addEventListener(
    "input",
    function() {

        mostrarAlimentos(
            pesquisaInput.value
        );

    }
);


// ==========================================
// INICIAR A APLICAÇÃO
// ==========================================

mostrarAlimentos();