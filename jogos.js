/* =========================================================
   CONFIGURAÇÃO DO SUPABASE
========================================================= */

const SUPABASE_URL = "https://fvakbojxbxofinxqvdiv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YWtib2p4YnhvZmlueHF2ZGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MTkzNDYsImV4cCI6MjEwNjI5NTM0Nn0.Ng3OdWvMDo50WLIdbcEbvR1vpi4_msfIsUuxXLfsG2E";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   ELEMENTOS
========================================================= */

const gridJogos = document.getElementById("gridJogos");

const modalOverlay = document.getElementById("modalOverlay");

const conteudoModal = document.getElementById("conteudoModal");

const fecharModal = document.getElementById("fecharModal");

const modalSecundarioOverlay =
    document.getElementById("modalSecundarioOverlay");

const conteudoModalSecundario =
    document.getElementById("conteudoModalSecundario");

const fecharModalSecundario =
    document.getElementById("fecharModalSecundario");

const filtros =
    document.querySelectorAll(".filtro-jogo");


/* =========================================================
   VARIÁVEIS
========================================================= */

let jogos = [];

let jogoAtual = null;


/* =========================================================
   CARREGAR JOGOS
========================================================= */

async function carregarJogos() {

    gridJogos.innerHTML = `
        <div class="estado-carregando">
            <div class="loader"></div>
            <p>Carregando jogos...</p>
        </div>
    `;

    const { data, error } = await supabaseClient
        .from("jogos")
        .select("*")
        .order("geracao", {
            ascending: true
        })
        .order("id", {
            ascending: true
        });


    if (error) {

        console.error(
            "Erro ao carregar jogos:",
            error
        );

        gridJogos.innerHTML = `
            <div class="estado-erro">
                <p>Não foi possível carregar os jogos.</p>
                <small>
                    Verifique a conexão com o Supabase.
                </small>
            </div>
        `;

        return;
    }


    jogos = data || [];

    renderizarJogos(jogos);
}


/* =========================================================
   RENDERIZAR JOGOS
========================================================= */

function renderizarJogos(lista) {

    if (!lista.length) {

        gridJogos.innerHTML = `
            <div class="estado-vazio">
                <p>Nenhum jogo encontrado.</p>
            </div>
        `;

        return;
    }


    gridJogos.innerHTML = lista.map(jogo => {

        return `
            <article
                class="card-jogo"
                data-id="${jogo.id}"
                onclick="abrirModal(${jogo.id})"
            >

                <img
                    class="card-imagem"
                    src="${jogo.imagem || ""}"
                    alt="${jogo.nome}"
                    onerror="this.style.display='none'"
                >

                <div class="card-conteudo">

                    <p class="card-geracao">
                        Geração ${jogo.geracao}
                    </p>

                    <h3>
                        ${jogo.nome}
                    </h3>

                    <p class="card-info">
                        ${jogo.ano || "Ano não informado"}
                        ${jogo.console ? ` • ${jogo.console}` : ""}
                    </p>

                </div>

            </article>
        `;

    }).join("");
}


/* =========================================================
   ABRIR MODAL PRINCIPAL
========================================================= */

async function abrirModal(jogoId) {

    const jogo = jogos.find(
        item => item.id === jogoId
    );

    if (!jogo) {
        return;
    }

    jogoAtual = jogo;


    modalOverlay.classList.add("aberto");

    document.body.style.overflow = "hidden";


    conteudoModal.innerHTML = `
        <div class="modal-jogo">

            <div class="estado-carregando">

                <div class="loader"></div>

                <p>
                    Carregando informações...
                </p>

            </div>

        </div>
    `;


    try {

        const dados = await carregarDadosJogo(jogo.id);

        renderizarModalPrincipal(
            jogo,
            dados
        );

    } catch (error) {

        console.error(
            "Erro ao carregar informações do jogo:",
            error
        );

        conteudoModal.innerHTML = `
            <div class="modal-jogo">

                <div class="estado-erro">

                    <p>
                        Não foi possível carregar
                        as informações.
                    </p>

                </div>

            </div>
        `;
    }
}


/* =========================================================
   CARREGAR DADOS DO JOGO
========================================================= */

async function carregarDadosJogo(jogoId) {

    const [
        mapaResult,
        iniciaisResult
    ] = await Promise.all([

        supabaseClient
            .from("mapas")
            .select("*")
            .eq("jogo_id", jogoId)
            .maybeSingle(),

        supabaseClient
            .from("iniciais")
            .select("*")
            .eq("jogo_id", jogoId)
            .order("id", {
                ascending: true
            })

    ]);


    if (mapaResult.error) {
        throw mapaResult.error;
    }

    if (iniciaisResult.error) {
        throw iniciaisResult.error;
    }


    return {

        mapa: mapaResult.data,

        iniciais: iniciaisResult.data || []

    };
}


/* =========================================================
   MODAL PRINCIPAL
========================================================= */

function renderizarModalPrincipal(
    jogo,
    dados
) {

    const iniciaisHTML =
        dados.iniciais.length

            ? dados.iniciais.map(inicial => {

                return `
                    <div class="inicial-card">

                        <img
                            src="${inicial.imagem || ""}"
                            alt="${inicial.pokemon}"
                        >

                        <h4>
                            ${capitalizar(inicial.pokemon)}
                        </h4>

                        <span class="inicial-tipo">
                            ${inicial.tipo || "Tipo não informado"}
                        </span>

                    </div>
                `;

            }).join("")

            : `
                <p class="card-info">
                    Iniciais ainda não cadastrados.
                </p>
            `;


    conteudoModal.innerHTML = `

        <div class="modal-jogo">

            <img
                class="modal-capa"
                src="${jogo.imagem || ""}"
                alt="${jogo.nome}"
            >


            <h2 class="modal-titulo">
                ${jogo.nome}
            </h2>


            <p class="modal-subtitulo">

                Geração ${jogo.geracao}

                ${jogo.ano
                    ? ` • ${jogo.ano}`
                    : ""
                }

                ${jogo.console
                    ? ` • ${jogo.console}`
                    : ""
                }

            </p>


            <p class="modal-descricao">

                ${jogo.descricao ||
                    "Descrição ainda não cadastrada."
                }

            </p>


            <!-- INICIAIS -->

            <section class="secao-iniciais">

                <h3 class="titulo-secao">
                    🌱 Iniciais
                </h3>


                <div class="grid-iniciais">

                    ${iniciaisHTML}

                </div>

            </section>


            <!-- BOTÕES -->

            <section class="botoes-detalhes">

                <button
                    class="botao-detalhe"
                    onclick="abrirModalGinasios()"
                >
                    🏆<br>
                    Ginásios
                </button>


                <button
                    class="botao-detalhe"
                    onclick="abrirModalMapa()"
                >
                    🗺️<br>
                    Mapa
                </button>


                <button
                    class="botao-detalhe"
                    onclick="abrirModalTimes()"
                >
                    🧠<br>
                    Recomendação de Times
                </button>

            </section>

        </div>

    `;
}


/* =========================================================
   ABRIR MODAL MAPA
========================================================= */

async function abrirModalMapa() {

    if (!jogoAtual) {
        return;
    }


    abrirModalSecundario();


    conteudoModalSecundario.innerHTML = `
        <div class="conteudo-secundario">

            <div class="estado-carregando">

                <div class="loader"></div>

                <p>
                    Carregando mapa...
                </p>

            </div>

        </div>
    `;


    const { data, error } = await supabaseClient
        .from("mapas")
        .select("*")
        .eq("jogo_id", jogoAtual.id)
        .maybeSingle();


    if (error) {

        console.error(
            "Erro ao carregar mapa:",
            error
        );

        conteudoModalSecundario.innerHTML = `
            <div class="conteudo-secundario">

                <div class="estado-erro">
                    Não foi possível carregar o mapa.
                </div>

            </div>
        `;

        return;
    }


    if (!data) {

        conteudoModalSecundario.innerHTML = `
            <div class="conteudo-secundario">

                <h2 class="titulo-modal-secundario">
                    🗺️ Mapa
                </h2>

                <p class="subtitulo-modal-secundario">
                    Nenhum mapa cadastrado para este jogo.
                </p>

            </div>
        `;

        return;
    }


    conteudoModalSecundario.innerHTML = `

        <div class="conteudo-secundario">

            <h2 class="titulo-modal-secundario">
                🗺️ ${data.nome || "Mapa"}
            </h2>

            <p class="subtitulo-modal-secundario">
                ${data.descricao || ""}
            </p>


            <div class="mapa-container">

                <img
                    src="${data.imagem}"
                    alt="${data.nome || "Mapa"}"
                >

            </div>

        </div>

    `;
}


/* =========================================================
   ABRIR MODAL GINÁSIOS
========================================================= */

async function abrirModalGinasios() {

    if (!jogoAtual) {
        return;
    }


    abrirModalSecundario();


    conteudoModalSecundario.innerHTML = `
        <div class="conteudo-secundario">

            <div class="estado-carregando">

                <div class="loader"></div>

                <p>
                    Carregando ginásios...
                </p>

            </div>

        </div>
    `;


    const { data: ginasios, error } =
        await supabaseClient

            .from("ginasios")

            .select("*")

            .eq(
                "jogo_id",
                jogoAtual.id
            )

            .order(
                "ordem",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar ginásios:",
            error
        );

        conteudoModalSecundario.innerHTML = `
            <div class="conteudo-secundario">

                <div class="estado-erro">
                    Não foi possível carregar os ginásios.
                </div>

            </div>
        `;

        return;
    }


    if (!ginasios.length) {

        conteudoModalSecundario.innerHTML = `
            <div class="conteudo-secundario">

                <h2 class="titulo-modal-secundario">
                    🏆 Ginásios
                </h2>

                <p class="subtitulo-modal-secundario">
                    Nenhum ginásio cadastrado.
                </p>

            </div>
        `;

        return;
    }


    const ginasiosHTML =
        await Promise.all(

            ginasios.map(
                async ginasio => {

                    return await criarCardGinasio(
                        ginasio
                    );

                }
            )

        );


    conteudoModalSecundario.innerHTML = `

        <div class="conteudo-secundario">

            <h2 class="titulo-modal-secundario">
                🏆 Ginásios de ${jogoAtual.nome}
            </h2>

            <p class="subtitulo-modal-secundario">
                Confira os líderes, treinadores,
                Pokémon e recompensas.
            </p>


            <div class="lista-ginasios">

                ${ginasiosHTML.join("")}

            </div>

        </div>

    `;
}


/* =========================================================
   CRIAR CARD DE GINÁSIO
========================================================= */

async function criarCardGinasio(ginasio) {

    const [
        treinadoresResult,
        pokemonsResult
    ] = await Promise.all([

        supabaseClient
            .from("ginasio_treinadores")
            .select("*")
            .eq(
                "ginasio_id",
                ginasio.id
            )
            .order(
                "ordem",
                {
                    ascending: true
                }
            ),

        supabaseClient
            .from("ginasio_pokemons")
            .select("*")
            .eq(
                "ginasio_id",
                ginasio.id
            )
            .order(
                "ordem",
                {
                    ascending: true
                }
            )

    ]);


    if (treinadoresResult.error) {
        console.error(
            "Erro nos treinadores:",
            treinadoresResult.error
        );
    }

    if (pokemonsResult.error) {
        console.error(
            "Erro nos Pokémon:",
            pokemonsResult.error
        );
    }


    const treinadores =
        treinadoresResult.data || [];

    const pokemons =
        pokemonsResult.data || [];


    const treinadoresHTML =
        treinadores.length

            ? treinadores.map(treinador => {

                return `
                    <p>
                        • ${treinador.nome}

                        ${treinador.classe
                            ? ` (${treinador.classe})`
                            : ""
                        }

                        ${treinador.quantidade_pokemon
                            ? ` • ${treinador.quantidade_pokemon} Pokémon`
                            : ""
                        }

                    </p>
                `;

            }).join("")

            : `
                <p>
                    Nenhum treinador cadastrado.
                </p>
            `;


    const pokemonsHTML =
        pokemons.length

            ? pokemons.map(pokemon => {

                return `
                    <div class="pokemon-ginasio">

                        <strong>
                            ${capitalizar(pokemon.pokemon)}
                        </strong>

                        <span>

                            ${pokemon.nivel
                                ? `Nv. ${pokemon.nivel}`
                                : ""
                            }

                            ${pokemon.habilidade
                                ? ` • ${pokemon.habilidade}`
                                : ""
                            }

                        </span>

                        ${pokemon.golpes
                            ? `
                                <span>
                                    Golpes:
                                    ${pokemon.golpes}
                                </span>
                            `
                            : ""
                        }

                    </div>
                `;

            }).join("")

            : `
                <p>
                    Nenhum Pokémon cadastrado.
                </p>
            `;


    return `

        <article class="ginasio-card">

            <button
                class="ginasio-cabecalho"
                onclick="alternarGinasio(this)"
            >

                <span class="ginasio-numero">
                    ${String(ginasio.ordem).padStart(2, "0")}
                </span>


                <span class="ginasio-nome">

                    <strong>
                        ${ginasio.nome}
                    </strong>

                    <span>

                        ${ginasio.lider}

                        • ${ginasio.tipo}

                        ${ginasio.cidade
                            ? ` • ${ginasio.cidade}`
                            : ""
                        }

                    </span>

                </span>


                <span class="ginasio-seta">
                    ▼
                </span>

            </button>


            <div class="ginasio-detalhes">


                <div class="ginasio-bloco">

                    <h4>
                        👥 Treinadores
                    </h4>

                    ${treinadoresHTML}

                </div>


                <div class="ginasio-bloco">

                    <h4>
                        🏆 Pokémon do Líder
                    </h4>


                    <div class="lista-pokemons-ginasio">

                        ${pokemonsHTML}

                    </div>

                </div>


                <div class="ginasio-bloco">

                    <h4>
                        🎁 Recompensa
                    </h4>

                    <p>
                        ${ginasio.recompensa ||
                            "Não informada."
                        }
                    </p>

                </div>


                ${
                    ginasio.descricao
                        ? `
                            <div class="ginasio-bloco">

                                <h4>
                                    📖 Informações
                                </h4>

                                <p>
                                    ${ginasio.descricao}
                                </p>

                            </div>
                        `
                        : ""
                }


            </div>

        </article>

    `;
}


/* =========================================================
   ABRIR MODAL TIMES
========================================================= */

async function abrirModalTimes() {

    if (!jogoAtual) {
        return;
    }


    abrirModalSecundario();


    conteudoModalSecundario.innerHTML = `
        <div class="conteudo-secundario">

            <div class="estado-carregando">

                <div class="loader"></div>

                <p>
                    Carregando times...
                </p>

            </div>

        </div>
    `;


    const [
        iniciaisResult,
        timesResult
    ] = await Promise.all([

        supabaseClient
            .from("iniciais")
            .select("*")
            .eq(
                "jogo_id",
                jogoAtual.id
            )
            .order(
                "id",
                {
                    ascending: true
                }
            ),

        supabaseClient
            .from("times")
            .select("*")
            .eq(
                "jogo_id",
                jogoAtual.id
            )
            .order(
                "id",
                {
                    ascending: true
                }
            )

    ]);


    if (iniciaisResult.error) {

        console.error(
            "Erro ao carregar iniciais:",
            iniciaisResult.error
        );

        return;
    }


    if (timesResult.error) {

        console.error(
            "Erro ao carregar times:",
            timesResult.error
        );

        conteudoModalSecundario.innerHTML = `
            <div class="conteudo-secundario">

                <div class="estado-erro">
                    Não foi possível carregar os times.
                </div>

            </div>
        `;

        return;
    }


    const iniciais =
        iniciaisResult.data || [];

    const times =
        timesResult.data || [];


    const timesComPokemons =
        await Promise.all(

            times.map(
                async time => {

                    const {
                        data,
                        error
                    } = await supabaseClient

                        .from("time_pokemons")

                        .select("*")

                        .eq(
                            "time_id",
                            time.id
                        )

                        .order(
                            "ordem",
                            {
                                ascending: true
                            }
                        );


                    if (error) {

                        console.error(
                            "Erro nos Pokémon do time:",
                            error
                        );

                    }


                    return {

                        ...time,

                        pokemons: data || []

                    };

                }
            )

        );


    renderizarModalTimes(
        iniciais,
        timesComPokemons
    );
}


/* =========================================================
   RENDERIZAR TIMES
========================================================= */

function renderizarModalTimes(
    iniciais,
    times
) {

    const nomesIniciais =
        iniciais.map(
            inicial =>
                inicial.pokemon.toLowerCase()
        );


    const botoesIniciais =
        iniciais.map(
            (inicial, index) => {

                return `
                    <button
                        class="botao-inicial-time ${index === 0 ? "ativo" : ""}"
                        data-inicial="${inicial.pokemon.toLowerCase()}"
                        onclick="selecionarInicialTime(
                            '${inicial.pokemon.toLowerCase()}'
                        )"
                    >

                        ${capitalizar(inicial.pokemon)}

                    </button>
                `;

            }
        ).join("");


    conteudoModalSecundario.innerHTML = `

        <div class="conteudo-secundario">

            <h2 class="titulo-modal-secundario">
                🧠 Times para ${jogoAtual.nome}
            </h2>

            <p class="subtitulo-modal-secundario">
                Escolha seu inicial para visualizar
                as três sugestões de equipe.
            </p>


            <div class="seletor-iniciais">

                ${botoesIniciais}

            </div>


            <div id="containerTimes">

                ${renderizarTimesDoInicial(
                    nomesIniciais[0],
                    times
                )}

            </div>

        </div>

    `;
}


/* =========================================================
   RENDERIZAR TIMES DE UM INICIAL
========================================================= */

function renderizarTimesDoInicial(
    inicial,
    times
) {

    const timesDoInicial =
        times.filter(time => {

            const nome =
                time.nome.toLowerCase();

            return nome.includes(
                inicial.toLowerCase()
            );

        });


    /*
       Caso o nome do time não contenha
       o inicial, tentamos identificar
       pelo campo inicial_id.
    */

    let resultado =
        timesDoInicial;


    if (!resultado.length) {

        const inicialEncontrado =
            jogoAtual
                ? null
                : null;

        resultado = times.filter(
            time =>
                time.nome
                    .toLowerCase()
                    .includes(
                        inicial.toLowerCase()
                    )
        );
    }


    if (!resultado.length) {

        return `
            <div class="estado-vazio">

                <p>
                    Nenhum time encontrado
                    para ${capitalizar(inicial)}.
                </p>

            </div>
        `;

    }


    return `

        <div class="times-grid">

            ${resultado.map(time => {

                return `

                    <article class="time-card">

                        <p class="time-estilo">
                            ${time.estilo}
                        </p>


                        <h4>
                            ${time.nome}
                        </h4>


                        ${
                            time.descricao
                                ? `
                                    <p class="card-info">
                                        ${time.descricao}
                                    </p>
                                `
                                : ""
                        }


                        <div class="lista-time">

                            ${
                                time.pokemons.length

                                    ? time.pokemons.map(pokemon => {

                                        return `
                                            <div class="pokemon-time">

                                                ${capitalizar(
                                                    pokemon.pokemon
                                                )}

                                                ${
                                                    pokemon.funcao
                                                        ? `
                                                            <span>
                                                                ${pokemon.funcao}
                                                            </span>
                                                        `
                                                        : ""
                                                }

                                                ${
                                                    pokemon.observacao
                                                        ? `
                                                            <span>
                                                                ${pokemon.observacao}
                                                            </span>
                                                        `
                                                        : ""
                                                }

                                            </div>
                                        `;

                                    }).join("")

                                    : `
                                        <p class="card-info">
                                            Pokémon ainda não cadastrados.
                                        </p>
                                    `
                            }

                        </div>

                    </article>

                `;

            }).join("")}

        </div>

    `;
}


/* =========================================================
   SELECIONAR INICIAL
========================================================= */

function selecionarInicialTime(
    inicial
) {

    document
        .querySelectorAll(".botao-inicial-time")
        .forEach(botao => {

            botao.classList.remove("ativo");

        });


    const botaoSelecionado =
        document.querySelector(
            `.botao-inicial-time[data-inicial="${inicial}"]`
        );


    if (botaoSelecionado) {

        botaoSelecionado.classList.add("ativo");

    }


    const container =
        document.getElementById(
            "containerTimes"
        );


    if (!container) {
        return;
    }


    /*
       Os times já estão carregados na memória
       pelo modal. Buscamos novamente apenas
       os dados necessários para renderização.
    */

    carregarTimesParaInicial(
        inicial,
        container
    );
}


/* =========================================================
   CARREGAR TIMES PARA TROCA DE INICIAL
========================================================= */

async function carregarTimesParaInicial(
    inicial,
    container
) {

    container.innerHTML = `
        <div class="estado-carregando">

            <div class="loader"></div>

            <p>
                Carregando times...
            </p>

        </div>
    `;


    const {
        data: times,
        error
    } = await supabaseClient

        .from("times")

        .select("*")

        .eq(
            "jogo_id",
            jogoAtual.id
        )

        .order(
            "id",
            {
                ascending: true
            }
        );


    if (error) {

        container.innerHTML = `
            <div class="estado-erro">
                Não foi possível carregar os times.
            </div>
        `;

        return;
    }


    const timesFiltrados =
        times.filter(time =>
            time.nome
                .toLowerCase()
                .includes(
                    inicial.toLowerCase()
                )
        );


    const timesComPokemons =
        await Promise.all(

            timesFiltrados.map(
                async time => {

                    const {
                        data
                    } = await supabaseClient

                        .from("time_pokemons")

                        .select("*")

                        .eq(
                            "time_id",
                            time.id
                        )

                        .order(
                            "ordem",
                            {
                                ascending: true
                            }
                        );


                    return {

                        ...time,

                        pokemons: data || []

                    };

                }
            )

        );


    container.innerHTML =
        renderizarTimesDoInicial(
            inicial,
            timesComPokemons
        );
}


/* =========================================================
   ALTERNAR GINÁSIO
========================================================= */

function alternarGinasio(botao) {

    const card =
        botao.closest(".ginasio-card");

    if (!card) {
        return;
    }


    card.classList.toggle("aberto");
}


/* =========================================================
   ABRIR MODAL SECUNDÁRIO
========================================================= */

function abrirModalSecundario() {

    modalSecundarioOverlay.classList.add(
        "aberto"
    );

}


/* =========================================================
   FECHAR MODAL SECUNDÁRIO
========================================================= */

function fecharModalSecundarioFunc() {

    modalSecundarioOverlay.classList.remove(
        "aberto"
    );

}


/* =========================================================
   FECHAR MODAL PRINCIPAL
========================================================= */

function fecharModalPrincipal() {

    modalOverlay.classList.remove(
        "aberto"
    );

    fecharModalSecundarioFunc();

    document.body.style.overflow = "";

    jogoAtual = null;
}


/* =========================================================
   EVENTOS
========================================================= */

fecharModal.addEventListener(
    "click",
    fecharModalPrincipal
);


fecharModalSecundario.addEventListener(
    "click",
    fecharModalSecundarioFunc
);


modalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target === modalOverlay
        ) {

            fecharModalPrincipal();

        }

    }
);


modalSecundarioOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target === modalSecundarioOverlay
        ) {

            fecharModalSecundarioFunc();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        if (
            modalSecundarioOverlay.classList.contains(
                "aberto"
            )
        ) {

            fecharModalSecundarioFunc();

            return;

        }


        if (
            modalOverlay.classList.contains(
                "aberto"
            )
        ) {

            fecharModalPrincipal();

        }

    }
);


/* =========================================================
   FILTROS DE GERAÇÃO
========================================================= */

filtros.forEach(
    filtro => {

        filtro.addEventListener(
            "click",
            () => {

                filtros.forEach(
                    item =>
                        item.classList.remove(
                            "ativo"
                        )
                );


                filtro.classList.add(
                    "ativo"
                );


                const geracao =
                    filtro.dataset.geracao;


                if (
                    geracao === "todas"
                ) {

                    renderizarJogos(
                        jogos
                    );

                    return;

                }


                const jogosFiltrados =
                    jogos.filter(
                        jogo =>
                            String(
                                jogo.geracao
                            ) === geracao
                    );


                renderizarJogos(
                    jogosFiltrados
                );

            }
        );

    }
);


/* =========================================================
   CAPITALIZAR
========================================================= */

function capitalizar(texto) {

    if (!texto) {
        return "";
    }


    return texto
        .charAt(0)
        .toUpperCase()
        + texto.slice(1);

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

carregarJogos();