require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);


// ==========================================
// CONFIGURAÇÃO
// ==========================================

// Gen I  = 151
// Gen II = 251
// Gen III = 386
// etc.

const POKEMON_INICIAL = 1;
const POKEMON_FINAL = 251;

const API_BASE = "https://pokeapi.co/api/v2";


// ==========================================
// BUSCAR DADOS DA POKEAPI
// ==========================================

async function buscar(url) {

    const resposta = await fetch(url);

    if (!resposta.ok) {

        throw new Error(
            `Erro ${resposta.status} ao acessar ${url}`
        );

    }

    return await resposta.json();
}


// ==========================================
// PEGAR ID DO POKÉMON PELA URL
// ==========================================

function pegarIdDaUrl(url) {

    const partes =
        url.split("/").filter(Boolean);

    return Number(
        partes[partes.length - 1]
    );
}


// ==========================================
// PERCORRER A ÁRVORE DE EVOLUÇÃO
// ==========================================

function percorrerEvolucoes(
    no,
    resultado
) {

    const idAtual =
        pegarIdDaUrl(no.species.url);


    for (const evolucao of no.evolves_to) {

        const idEvolucao =
            pegarIdDaUrl(
                evolucao.species.url
            );


        // Só adiciona Pokémon
        // dentro do intervalo escolhido.

        if (
            idAtual >= POKEMON_INICIAL &&
            idAtual <= POKEMON_FINAL &&
            idEvolucao >= POKEMON_INICIAL &&
            idEvolucao <= POKEMON_FINAL
        ) {

            resultado.push({

                pokemon_id: idAtual,

                evolucao_id: idEvolucao

            });

        }


        // Continua percorrendo
        // toda a árvore.

        percorrerEvolucoes(
            evolucao,
            resultado
        );

    }
}


// ==========================================
// IMPORTAR EVOLUÇÕES
// ==========================================

async function importarEvolucoes() {

    console.log(
        "======================================"
    );

    console.log(
        ` IMPORTANDO EVOLUÇÕES #${POKEMON_INICIAL} → #${POKEMON_FINAL}`
    );

    console.log(
        "======================================"
    );


    const evolucoes = [];


    // ======================================
    // BUSCAR AS CADEIAS DE EVOLUÇÃO
    // ======================================

    for (
        let id = POKEMON_INICIAL;
        id <= POKEMON_FINAL;
        id++
    ) {

        try {

            const especie =
                await buscar(
                    `${API_BASE}/pokemon-species/${id}`
                );


            const urlChain =
                especie.evolution_chain?.url;


            if (!urlChain) {
                continue;
            }


            const chain =
                await buscar(urlChain);


            percorrerEvolucoes(
                chain.chain,
                evolucoes
            );


        } catch (erro) {

            console.error(
                `✗ Erro no Pokémon #${id}:`,
                erro.message
            );

        }

    }


    // ======================================
    // REMOVER RELAÇÕES DUPLICADAS
    // ======================================

    const unicas = [];

    const existentes = new Set();


    for (const evolucao of evolucoes) {

        const chave =
            `${evolucao.pokemon_id}-${evolucao.evolucao_id}`;


        if (!existentes.has(chave)) {

            existentes.add(chave);

            unicas.push(evolucao);

        }

    }


    console.log("");

    console.log(
        `Relações encontradas: ${unicas.length}`
    );


    if (unicas.length === 0) {

        console.log(
            "Nenhuma evolução encontrada."
        );

        return;

    }


    // ======================================
    // SALVAR NO SUPABASE
    // ======================================

    const { error } =
        await supabase
            .from("evolucoes")
            .upsert(
                unicas,
                {
                    onConflict:
                        "pokemon_id,evolucao_id"
                }
            );


    if (error) {

        throw new Error(
            `Erro ao salvar evoluções: ${error.message}`
        );

    }


    console.log(
        `✓ ${unicas.length} relações salvas!`
    );


    console.log(
        "======================================"
    );

    console.log(
        " IMPORTAÇÃO FINALIZADA"
    );

    console.log(
        "======================================"
    );

}


// ==========================================
// EXECUTAR
// ==========================================

importarEvolucoes()
    .catch(erro => {

        console.error(
            "ERRO:",
            erro.message
        );

    });