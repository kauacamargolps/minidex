// ==========================================
// DADOS DOS JOGOS
// ==========================================

const jogos = [

    {
        id: 1,
        nome: "Pokémon Red",
        geracao: 1,
        ano: 1996,
        console: "Game Boy",
        imagem: "assets/img/jogos/red.jpg",
        descricao:
            "O início da jornada pela região de Kanto, onde o jogador parte em busca de se tornar Campeão da Liga Pokémon."
    },

    {
        id: 2,
        nome: "Pokémon Blue",
        geracao: 1,
        ano: 1996,
        console: "Game Boy",
        imagem: "assets/img/jogos/blue.jpg",
        descricao:
            "A segunda versão dos jogos originais de Pokémon, ambientada na região de Kanto."
    },

    {
        id: 3,
        nome: "Pokémon Gold",
        geracao: 2,
        ano: 1999,
        console: "Game Boy Color",
        imagem: "assets/img/jogos/gold.jpg",
        descricao:
            "Uma nova aventura pela região de Johto, trazendo novos Pokémon e várias novidades para a série."
    },

    {
        id: 4,
        nome: "Pokémon Silver",
        geracao: 2,
        ano: 1999,
        console: "Game Boy Color",
        imagem: "assets/img/jogos/silver.jpg",
        descricao:
            "A versão complementar de Pokémon Gold, apresentando Johto e uma nova geração de Pokémon."
    },

    {
        id: 5,
        nome: "Pokémon Ruby",
        geracao: 3,
        ano: 2002,
        console: "Game Boy Advance",
        imagem: "assets/img/jogos/ruby.jpg",
        descricao:
            "A aventura pela região de Hoenn apresenta uma nova geração de Pokémon e uma disputa entre duas organizações."
    },

    {
        id: 6,
        nome: "Pokémon Sapphire",
        geracao: 3,
        ano: 2002,
        console: "Game Boy Advance",
        imagem: "assets/img/jogos/sapphire.jpg",
        descricao:
            "A jornada por Hoenn envolvendo a organização Team Aqua e o lendário Pokémon Kyogre."
    },

    {
        id: 7,
        nome: "Pokémon Emerald",
        geracao: 3,
        ano: 2004,
        console: "Game Boy Advance",
        imagem: "assets/img/jogos/emerald.jpg",
        descricao:
            "Uma versão expandida de Ruby e Sapphire, reunindo elementos das duas versões e trazendo Rayquaza para o centro da história."
    },

    {
        id: 8,
        nome: "Pokémon FireRed",
        geracao: 3,
        ano: 2004,
        console: "Game Boy Advance",
        imagem: "assets/img/jogos/firered.jpg",
        descricao:
            "Um remake dos clássicos Pokémon Red e Blue, reconstruindo a aventura de Kanto para o Game Boy Advance."
    },

    {
        id: 9,
        nome: "Pokémon LeafGreen",
        geracao: 3,
        ano: 2004,
        console: "Game Boy Advance",
        imagem: "assets/img/jogos/leafgreen.jpg",
        descricao:
            "A versão complementar de FireRed, trazendo a aventura clássica de Kanto novamente ao Game Boy Advance."
    },

    {
        id: 10,
        nome: "Pokémon Diamond",
        geracao: 4,
        ano: 2006,
        console: "Nintendo DS",
        imagem: "assets/img/jogos/diamond.jpg",
        descricao:
            "A aventura pela região de Sinnoh apresenta uma nova geração de Pokémon e os lendários Dialga e Palkia."
    },

    {
        id: 11,
        nome: "Pokémon Pearl",
        geracao: 4,
        ano: 2006,
        console: "Nintendo DS",
        imagem: "assets/img/jogos/pearl.jpg",
        descricao:
            "A versão complementar de Diamond, ambientada na região de Sinnoh."
    },

    {
        id: 12,
        nome: "Pokémon Platinum",
        geracao: 4,
        ano: 2008,
        console: "Nintendo DS",
        imagem: "assets/img/jogos/platinum.jpg",
        descricao:
            "Uma versão expandida de Diamond e Pearl, adicionando novas áreas, personagens e uma história envolvendo Giratina."
    },

    {
        id: 13,
        nome: "Pokémon Black",
        geracao: 5,
        ano: 2010,
        console: "Nintendo DS",
        imagem: "assets/img/jogos/black.jpg",
        descricao:
            "A aventura pela região de Unova apresenta uma nova geração de Pokémon e uma história focada na relação entre humanos e Pokémon."
    },

    {
        id: 14,
        nome: "Pokémon White",
        geracao: 5,
        ano: 2010,
        console: "Nintendo DS",
        imagem: "assets/img/jogos/white.jpg",
        descricao:
            "A versão complementar de Black, também ambientada na região de Unova."
    },

    {
        id: 15,
        nome: "Pokémon Black 2",
        geracao: 5,
        ano: 2012,
        console: "Nintendo DS",
        imagem: "assets/img/jogos/black-2.jpg",
        descricao:
            "Uma sequência direta de Black, trazendo uma nova história ambientada dois anos após os acontecimentos do jogo original."
    },

    {
        id: 16,
        nome: "Pokémon White 2",
        geracao: 5,
        ano: 2012,
        console: "Nintendo DS",
        imagem: "assets/img/jogos/white-2.jpg",
        descricao:
            "A segunda versão da sequência de Black e White, continuando a história na região de Unova."
    },

    {
        id: 17,
        nome: "Pokémon X",
        geracao: 6,
        ano: 2013,
        console: "Nintendo 3DS",
        imagem: "assets/img/jogos/x.jpg",
        descricao:
            "A série chega ao Nintendo 3DS com a região de Kalos, gráficos em 3D e a introdução das Mega Evoluções."
    },

    {
        id: 18,
        nome: "Pokémon Y",
        geracao: 6,
        ano: 2013,
        console: "Nintendo 3DS",
        imagem: "assets/img/jogos/y.jpg",
        descricao:
            "A versão complementar de Pokémon X, ambientada na região de Kalos."
    },

    {
        id: 19,
        nome: "Pokémon Sun",
        geracao: 7,
        ano: 2016,
        console: "Nintendo 3DS",
        imagem: "assets/img/jogos/sun.jpg",
        descricao:
            "A aventura pela região de Alola introduz novas formas de Pokémon, movimentos especiais e uma estrutura diferente de desafios."
    },

    {
        id: 20,
        nome: "Pokémon Moon",
        geracao: 7,
        ano: 2016,
        console: "Nintendo 3DS",
        imagem: "assets/img/jogos/moon.jpg",
        descricao:
            "A versão complementar de Sun, também ambientada nas ilhas da região de Alola."
    },

    {
        id: 21,
        nome: "Pokémon Sword",
        geracao: 8,
        ano: 2019,
        console: "Nintendo Switch",
        imagem: "assets/img/jogos/sword.jpg",
        descricao:
            "A aventura pela região de Galar introduz uma nova geração de Pokémon e mecânicas como Dynamax e Gigantamax."
    },

    {
        id: 22,
        nome: "Pokémon Shield",
        geracao: 8,
        ano: 2019,
        console: "Nintendo Switch",
        imagem: "assets/img/jogos/shield.jpg",
        descricao:
            "A versão complementar de Sword, apresentando a região de Galar e uma aventura própria."
    },

    {
        id: 23,
        nome: "Pokémon Scarlet",
        geracao: 9,
        ano: 2022,
        console: "Nintendo Switch",
        imagem: "assets/img/jogos/scarlet.jpg",
        descricao:
            "A aventura pela região de Paldea apresenta um mundo aberto e a nova mecânica de Terastalização."
    },

    {
        id: 24,
        nome: "Pokémon Violet",
        geracao: 9,
        ano: 2022,
        console: "Nintendo Switch",
        imagem: "assets/img/jogos/violet.jpg",
        descricao:
            "A versão complementar de Scarlet, ambientada na região de Paldea."
    }

];


// ==========================================
// ELEMENTOS
// ==========================================

const gridJogos =
    document.getElementById("gridJogos");

const modalOverlay =
    document.getElementById("modalOverlay");

const conteudoModal =
    document.getElementById("conteudoModal");

const fecharModal =
    document.getElementById("fecharModal");

const filtros =
    document.querySelectorAll(".filtro-jogo");


// ==========================================
// RENDERIZAR JOGOS
// ==========================================

function renderizarJogos(lista) {

    gridJogos.innerHTML = "";

    if (lista.length === 0) {

        gridJogos.innerHTML = `
            <p class="sem-jogos">
                Nenhum jogo encontrado.
            </p>
        `;

        return;
    }


    lista.forEach(jogo => {

        const card = document.createElement("article");

        card.className = "card-jogo";

        card.dataset.geracao = jogo.geracao;


        card.innerHTML = `

            <span class="card-jogo-badge">
                Gen ${jogo.geracao}
            </span>

            <div class="card-jogo-imagem">

                <img
                    src="${jogo.imagem}"
                    alt="Capa de ${jogo.nome}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="card-jogo-info">

                <span class="card-jogo-geracao">
                    Geração ${jogo.geracao}
                </span>

                <h3>
                    ${jogo.nome}
                </h3>

                <p class="card-jogo-descricao">
                    ${jogo.descricao}
                </p>

            </div>

        `;


        card.addEventListener(
            "click",
            () => abrirModal(jogo)
        );


        gridJogos.appendChild(card);

    });

}


// ==========================================
// ABRIR MODAL
// ==========================================

function abrirModal(jogo) {

    conteudoModal.innerHTML = `

        <div class="modal-conteudo">

            <div class="modal-capa">

                <img
                    src="${jogo.imagem}"
                    alt="Capa de ${jogo.nome}"
                    onerror="this.style.display='none'"
                >

            </div>


            <div>

                <span class="modal-geracao">
                    Geração ${jogo.geracao}
                </span>

                <h2>
                    ${jogo.nome}
                </h2>

            </div>


            <p>
                ${jogo.descricao}
            </p>


            <div class="modal-info">

                <div class="modal-info-item">

                    <strong>
                        Lançamento
                    </strong>

                    <span>
                        ${jogo.ano}
                    </span>

                </div>


                <div class="modal-info-item">

                    <strong>
                        Plataforma
                    </strong>

                    <span>
                        ${jogo.console}
                    </span>

                </div>


                <div class="modal-info-item">

                    <strong>
                        Geração
                    </strong>

                    <span>
                        ${jogo.geracao}
                    </span>

                </div>


                <div class="modal-info-item">

                    <strong>
                        Região
                    </strong>

                    <span>
                        ${obterRegiao(jogo.geracao)}
                    </span>

                </div>

            </div>

        </div>

    `;


    modalOverlay.classList.add("aberto");

    document.body.style.overflow = "hidden";
}


// ==========================================
// REGIÕES
// ==========================================

function obterRegiao(geracao) {

    const regioes = {

        1: "Kanto",
        2: "Johto",
        3: "Hoenn",
        4: "Sinnoh",
        5: "Unova",
        6: "Kalos",
        7: "Alola",
        8: "Galar",
        9: "Paldea"

    };

    return regioes[geracao] || "Desconhecida";
}


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModalJogo() {

    modalOverlay.classList.remove("aberto");

    document.body.style.overflow = "";

}


fecharModal.addEventListener(
    "click",
    fecharModalJogo
);


modalOverlay.addEventListener(
    "click",
    evento => {

        if (evento.target === modalOverlay) {
            fecharModalJogo();
        }

    }
);


// ==========================================
// ESC PARA FECHAR
// ==========================================

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape" &&
            modalOverlay.classList.contains("aberto")
        ) {

            fecharModalJogo();

        }

    }
);


// ==========================================
// FILTROS POR GERAÇÃO
// ==========================================

filtros.forEach(filtro => {

    filtro.addEventListener(
        "click",
        () => {

            filtros.forEach(botao => {
                botao.classList.remove("ativo");
            });


            filtro.classList.add("ativo");


            const geracao =
                filtro.dataset.geracao;


            if (geracao === "todas") {

                renderizarJogos(jogos);

                return;

            }


            const jogosFiltrados =
                jogos.filter(
                    jogo =>
                        jogo.geracao === Number(geracao)
                );


            renderizarJogos(jogosFiltrados);

        }
    );

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

renderizarJogos(jogos);