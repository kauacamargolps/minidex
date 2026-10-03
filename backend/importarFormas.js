require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);


// ==========================================
// CONFIGURAÇÃO
// ==========================================

const POKEMON_INICIAL = 1;
const POKEMON_FINAL = 251;

const API_BASE = "https://pokeapi.co/api/v2";


// ==========================================
// BUSCAR DADOS DA API
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
// IDENTIFICAR TIPO DA FORMA
// ==========================================

function classificarForma(nome) {

    const nomeMinusculo = nome.toLowerCase();


    // Mega Evolução
    if (nomeMinusculo.includes("mega")) {
        return "mega";
    }


    // Formas regionais
    if (nomeMinusculo.includes("alola")) {
        return "alola";
    }

    if (nomeMinusculo.includes("galar")) {
        return "galar";
    }

    if (nomeMinusculo.includes("hisui")) {
        return "hisui";
    }

    if (nomeMinusculo.includes("paldea")) {
        return "paldea";
    }


    // Gigantamax
    if (
        nomeMinusculo.includes("gmax") ||
        nomeMinusculo.includes("gigantamax")
    ) {
        return "gigantamax";
    }


    // Qualquer outra forma
    return "outra";
}


// ==========================================
// IMPORTAR FORMAS
// ==========================================

async function importarFormas() {

    console.log("======================================");

    console.log(
        ` IMPORTANDO FORMAS #${POKEMON_INICIAL} → #${POKEMON_FINAL}`
    );

    console.log("======================================");


    let totalFormas = 0;


    // ==========================================
    // PERCORRER POKÉMON
    // ==========================================

    for (
        let id = POKEMON_INICIAL;
        id <= POKEMON_FINAL;
        id++
    ) {

        try {

            // Busca a espécie
            const especie = await buscar(
                `${API_BASE}/pokemon-species/${id}`
            );


            const variedades =
                especie.varieties || [];


            // ==========================================
            // PERCORRER VARIEDADES
            // ==========================================

            for (const variedade of variedades) {

                // Ignora a forma padrão
                if (variedade.is_default) {
                    continue;
                }


                const pokemonUrl =
                    variedade.pokemon.url;


                const nomeForma =
                    variedade.pokemon.name;


                // Busca os dados específicos da forma
                const dadosForma =
                    await buscar(pokemonUrl);


                // ==========================================
                // SPRITES
                // ==========================================

                const sprite =
                    dadosForma.sprites?.front_default || null;


                const spriteShiny =
                    dadosForma.sprites?.front_shiny || null;


                // ==========================================
                // CLASSIFICAR FORMA
                // ==========================================

                const tipo =
                    classificarForma(nomeForma);


                // ==========================================
                // DADOS PARA O SUPABASE
                // ==========================================

                const dados = {

                    pokemon_id: id,

                    nome: nomeForma,

                    tipo: tipo,

                    sprite: sprite,

                    sprite_shiny: spriteShiny

                };


                // ==========================================
                // SALVAR NO SUPABASE
                // ==========================================

                const { error } =
                    await supabase
                        .from("formas")
                        .upsert(
                            dados,
                            {
                                onConflict:
                                    "pokemon_id,nome"
                            }
                        );


                if (error) {

                    throw new Error(
                        error.message
                    );

                }


                totalFormas++;


                // ==========================================
                // LOG
                // ==========================================

                console.log(
                    `  ↳ #${String(id).padStart(3, "0")} → ${nomeForma} | ${tipo}`
                );

            }


            console.log(
                `✓ #${String(id).padStart(3, "0")}`
            );


        } catch (erro) {

            console.error(
                `✗ Erro no Pokémon #${id}:`,
                erro.message
            );

        }

    }


    // ==========================================
    // FINAL
    // ==========================================

    console.log("");

    console.log(
        `Formas processadas: ${totalFormas}`
    );

    console.log("======================================");

    console.log(" IMPORTAÇÃO FINALIZADA");

    console.log("======================================");

}


// ==========================================
// EXECUTAR
// ==========================================

importarFormas();