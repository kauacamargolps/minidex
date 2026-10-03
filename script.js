const API = "https://minidex-api.onrender.com";

const gridPokemon =
    document.getElementById("gridPokemon");

const campoBusca =
    document.getElementById("campoBusca");

const modalOverlay =
    document.getElementById("modalOverlay");

const fecharModal =
    document.getElementById("fecharModal");

const conteudoModal =
    document.getElementById("conteudoModal");

let pokemons = [];

// Filtros atuais
let filtroTipoAtual = "todos";
let filtroGeracaoAtual = "todas";


// ==========================================
// CARREGAR POKÉMON
// ==========================================

async function carregarPokemon() {

    try {

        const resposta =
            await fetch(`${API}/pokemon`);

        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar Pokémon"
            );

        }

        pokemons = await resposta.json();

        criarFiltros();

        configurarFiltrosGeracao();

        renderizarPokemon();

    } catch (erro) {

        console.error(erro);

        gridPokemon.innerHTML = `
            <p class="erro">
                Não foi possível carregar os Pokémon.
            </p>
        `;

    }

}


// ==========================================
// RENDERIZAR POKÉMON
// ==========================================

function renderizarPokemon() {

    const busca =
        campoBusca.value
            .toLowerCase()
            .trim();


    const filtrados =
        pokemons.filter(pokemon => {

            // ==============================
            // BUSCA
            // ==============================

            const correspondeBusca =
                pokemon.nome
                    .toLowerCase()
                    .includes(busca);


            // ==============================
            // TIPO
            // ==============================

            const correspondeTipo =
                filtroTipoAtual === "todos" ||
                pokemon.tipo_1 === filtroTipoAtual ||
                pokemon.tipo_2 === filtroTipoAtual;


            // ==============================
            // GERAÇÃO
            // ==============================

            const correspondeGeracao =
                filtroGeracaoAtual === "todas" ||
                obterGeracao(pokemon.id) ===
                    Number(filtroGeracaoAtual);


            // ==============================
            // RESULTADO FINAL
            // ==============================

            return (
                correspondeBusca &&
                correspondeTipo &&
                correspondeGeracao
            );

        });


    // ======================================
    // NENHUM RESULTADO
    // ======================================

    if (filtrados.length === 0) {

        gridPokemon.innerHTML = `
            <p class="sem-resultados">
                Nenhum Pokémon encontrado.
            </p>
        `;

        return;

    }


    // ======================================
    // CRIAR CARDS
    // ======================================

    gridPokemon.innerHTML =
        filtrados
            .map(pokemon => {

                const numero =
                    String(pokemon.id)
                        .padStart(3, "0");


                return `
                    <article
                        class="card-pokemon"
                        data-id="${pokemon.id}"
                    >

                        <span class="numero">
                            #${numero}
                        </span>

                        <img
                            src="${pokemon.sprite}"
                            alt="${pokemon.nome}"
                            loading="lazy"
                        >

                        <h2>
                            ${formatarNome(pokemon.nome)}
                        </h2>

                        <div class="tipos">

                            ${criarTipo(
                                pokemon.tipo_1
                            )}

                            ${
                                pokemon.tipo_2
                                    ? criarTipo(
                                        pokemon.tipo_2
                                    )
                                    : ""
                            }

                        </div>

                    </article>
                `;

            })
            .join("");


    // ======================================
    // CLIQUE NOS CARDS
    // ======================================

    document
        .querySelectorAll(".card-pokemon")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    abrirModal(
                        Number(card.dataset.id)
                    );

                }
            );

        });

}


// ==========================================
// OBTER GERAÇÃO PELO ID
// ==========================================

function obterGeracao(id) {

    if (id >= 1 && id <= 151) {

        return 1;

    }

    if (id >= 152 && id <= 251) {

        return 2;

    }

    if (id >= 252 && id <= 386) {

        return 3;

    }

    if (id >= 387 && id <= 493) {

        return 4;

    }

    if (id >= 494 && id <= 649) {

        return 5;

    }

    if (id >= 650 && id <= 721) {

        return 6;

    }

    if (id >= 722 && id <= 809) {

        return 7;

    }

    if (id >= 810 && id <= 905) {

        return 8;

    }

    if (id >= 906 && id <= 1025) {

        return 9;

    }

    return 0;

}


// ==========================================
// CRIAR TIPO
// ==========================================

function criarTipo(tipo) {

    return `
        <span class="tipo tipo-${tipo}">
            ${formatarNome(tipo)}
        </span>
    `;

}


// ==========================================
// FORMATAR NOME
// ==========================================

function formatarNome(nome) {

    return nome
        .replaceAll("-", " ")
        .replace(/\b\w/g, letra =>
            letra.toUpperCase()
        );

}


// ==========================================
// FILTROS DE TIPO
// ==========================================

function criarFiltros() {

    const tipos = new Set();


    // ======================================
    // PEGAR TODOS OS TIPOS
    // ======================================

    pokemons.forEach(pokemon => {

        if (pokemon.tipo_1) {

            tipos.add(pokemon.tipo_1);

        }

        if (pokemon.tipo_2) {

            tipos.add(pokemon.tipo_2);

        }

    });


    const container =
        document.getElementById(
            "filtrosTipos"
        );


    // ======================================
    // BOTÃO TODOS
    // ======================================

    container.innerHTML = `

        <button
            class="filtro ativo"
            data-tipo="todos"
        >
            Todos
        </button>

    `;


    // ======================================
    // CRIAR BOTÕES DOS TIPOS
    // ======================================

    [...tipos]
        .sort()
        .forEach(tipo => {

            container.innerHTML += `

                <button
                    class="filtro"
                    data-tipo="${tipo}"
                >
                    ${formatarNome(tipo)}
                </button>

            `;

        });


    // ======================================
    // EVENTOS DOS BOTÕES
    // ======================================

    container
        .querySelectorAll(".filtro")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    // Remove ativo somente
                    // dos botões de tipo

                    container
                        .querySelectorAll(".filtro")
                        .forEach(b => {

                            b.classList.remove(
                                "ativo"
                            );

                        });


                    botao.classList.add(
                        "ativo"
                    );


                    filtroTipoAtual =
                        botao.dataset.tipo;


                    renderizarPokemon();

                }
            );

        });

}


// ==========================================
// FILTROS DE GERAÇÃO
// ==========================================

function configurarFiltrosGeracao() {

    const container =
        document.getElementById(
            "filtrosGeracoes"
        );


    if (!container) {

        return;

    }


    const botoes =
        container.querySelectorAll(
            ".filtro-geracao"
        );


    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                // Remove ativo somente
                // dos botões de geração

                botoes.forEach(b => {

                    b.classList.remove(
                        "ativo"
                    );

                });


                botao.classList.add(
                    "ativo"
                );


                filtroGeracaoAtual =
                    botao.dataset.geracao;


                renderizarPokemon();

            }
        );

    });

}


// ==========================================
// ABRIR MODAL
// ==========================================

async function abrirModal(id) {

    modalOverlay.classList.add("aberto");

    conteudoModal.innerHTML = `
        <div class="modal-carregando">
            Carregando...
        </div>
    `;


    try {

        const resposta =
            await fetch(
                `${API}/pokemon/${id}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar detalhes"
            );

        }


        const pokemon =
            await resposta.json();


        conteudoModal.innerHTML =
            montarModal(pokemon);


        // ==================================
        // BOTÃO SHINY
        // ==================================

        const botaoShiny =
            document.getElementById(
                "botaoShiny"
            );


        const imagemPokemon =
            document.getElementById(
                "imagemPokemonModal"
            );


        if (
            botaoShiny &&
            imagemPokemon
        ) {

            let estaShiny = false;


            botaoShiny.addEventListener(
                "click",
                () => {

                    estaShiny =
                        !estaShiny;


                    if (estaShiny) {

                        imagemPokemon.src =
                            pokemon.sprite_shiny;

                        botaoShiny.textContent =
                            "⭐ Normal";

                    } else {

                        imagemPokemon.src =
                            pokemon.sprite;

                        botaoShiny.textContent =
                            "✨ Shiny";

                    }

                }
            );

        }

        // ==================================
// BOTÕES SHINY DAS FORMAS ALTERNATIVAS
// ==================================

const formas = pokemon.formas || [];
console.log("FORMAS RECEBIDAS:", formas);

formas.forEach((forma, indice) => {

    const botaoShinyForma =
        document.getElementById(
            `botaoShinyForma_${indice}`
        );

    const imagemForma =
        document.getElementById(
            `imagemForma_${indice}`
        );

    if (
        botaoShinyForma &&
        imagemForma &&
        forma.sprite_shiny
    ) {

        let formaEstaShiny = false;

        botaoShinyForma.addEventListener(
            "click",
            (evento) => {

                evento.stopPropagation();

                formaEstaShiny = !formaEstaShiny;

                if (formaEstaShiny) {

                    imagemForma.src =
                        forma.sprite_shiny;

                    botaoShinyForma.textContent =
                        "⭐ Normal";

                } else {

                    imagemForma.src =
                        forma.sprite;

                    botaoShinyForma.textContent =
                        "✨ Shiny";

                }

            }
        );

    }

});

    } catch (erro) {

        console.error(erro);

        conteudoModal.innerHTML = `
            <p class="erro">
                Não foi possível carregar os detalhes.
            </p>
        `;

    }

}


// ==========================================
// MONTAR MODAL
// ==========================================

function montarModal(pokemon) {

    const numero =
        String(pokemon.id)
            .padStart(3, "0");


    const evolucoes =
        pokemon.evolucoes || [];


    const formas =
        pokemon.formas || [];


    return `

        <div class="detalhes">

            <span class="numero">
                #${numero}
            </span>


            <h2>
                ${formatarNome(pokemon.nome)}
            </h2>


            <!-- ==============================
                 IMAGEM PRINCIPAL
            =============================== -->

            <img
                id="imagemPokemonModal"
                class="sprite-grande"
                src="${pokemon.sprite}"
                alt="${pokemon.nome}"
            >


            <!-- ==============================
                 BOTÃO SHINY
            =============================== -->

            ${
                pokemon.sprite_shiny
                    ? `

                        <button
                            id="botaoShiny"
                            class="botao-shiny"
                            type="button"
                        >
                            ✨ Shiny
                        </button>

                    `
                    : ""
            }


            <div class="tipos">

                ${criarTipo(
                    pokemon.tipo_1
                )}

                ${
                    pokemon.tipo_2
                        ? criarTipo(
                            pokemon.tipo_2
                        )
                        : ""
                }

            </div>


            <!-- ==============================
                 FRAQUEZAS
            =============================== -->

            <section class="secao-detalhes">

                <h3>
                    Fraquezas
                </h3>

                <div class="fraquezas">

                    ${
                        pokemon.fraquezas
                            .map(tipo =>
                                criarTipo(tipo)
                            )
                            .join("")
                    }

                </div>

            </section>


            <!-- ==============================
                 LINHA EVOLUTIVA
            =============================== -->

            <section class="secao-detalhes">

                <h3>
                    Linha evolutiva
                </h3>

                <div class="evolucoes">

                    ${
                        evolucoes.length
                            ? evolucoes
                                .map(evolucao => `

                                    <div
                                        class="evolucao"
                                        data-id="${evolucao.id}"
                                    >

                                        <img
                                            src="${evolucao.sprite}"
                                            alt="${evolucao.nome}"
                                        >

                                        <span>
                                            ${formatarNome(
                                                evolucao.nome
                                            )}
                                        </span>

                                    </div>

                                `)
                                .join("")

                            : `

                                <p>
                                    Nenhuma evolução direta.
                                </p>

                            `
                    }

                </div>

            </section>


            <!-- ==============================
                 FORMAS ALTERNATIVAS
            =============================== -->

            <section class="secao-detalhes">

                <h3>
                    Formas alternativas
                </h3>

                <div class="formas">

                    ${
                        formas.length
                            ? formas
                                .map((forma, indice) => `

                                    <div
                                        class="forma"
                                        data-forma-indice="${indice}"
                                    >

                                        <img
                                            id="imagemForma_${indice}"
                                            src="${forma.sprite}"
                                            alt="${forma.nome}"
                                        >

                                        <span>
                                            ${formatarNome(
                                                forma.nome
                                            )}
                                        </span>

                                        <button
                                            id="botaoShinyForma_${indice}"
                                            class="botao-shiny"
                                            type="button"
                                        >
                                            ✨ Shiny
                                        </button>

                                    </div>

                                `)
                                .join("")

                            : `

                                <p>
                                    Nenhuma forma alternativa.
                                </p>

                            `
                    }

                </div>

            </section>

        </div>

    `;
}

    

// ==========================================
// FECHAR MODAL
// ==========================================

function fechar() {

    modalOverlay.classList.remove(
        "aberto"
    );

}


fecharModal.addEventListener(
    "click",
    fechar
);


modalOverlay.addEventListener(
    "click",
    evento => {

        if (
            evento.target ===
            modalOverlay
        ) {

            fechar();

        }

    }
);


// ==========================================
// BUSCA
// ==========================================

campoBusca.addEventListener(
    "input",
    renderizarPokemon
);


// ==========================================
// INICIAR
// ==========================================

carregarPokemon();