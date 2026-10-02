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
// BUSCAR DADOS
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
// IMPORTAR FORMAS
// ==========================================

async function importarFormas() {

    console.log("======================================");

    console.log(
        ` IMPORTANDO FORMAS #${POKEMON_INICIAL} → #${POKEMON_FINAL}`
    );

    console.log("======================================");


    let totalFormas = 0;


    for (
        let id = POKEMON_INICIAL;
        id <= POKEMON_FINAL;
        id++
    ) {

        try {

            const especie = await buscar(
                `${API_BASE}/pokemon-species/${id}`
            );


            const variedades =
                especie.varieties || [];


            for (const variedade of variedades) {

                // A forma padrão não é uma forma alternativa
                if (variedade.is_default) {
                    continue;
                }


                const pokemonUrl =
                    variedade.pokemon.url;


                const nomeForma =
                    variedade.pokemon.name;


                const dadosForma =
                    await buscar(pokemonUrl);


                const sprite =
                    dadosForma.sprites
                        ?.front_default || null;


                const dados = {

                    pokemon_id: id,

                    nome: nomeForma,

                    sprite: sprite

                };


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


                console.log(
                    `  ↳ #${String(id).padStart(3, "0")} → ${nomeForma}`
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


    console.log("");

    console.log(
        `Formas processadas: ${totalFormas}`
    );

    console.log("======================================");

    console.log(" IMPORTAÇÃO FINALIZADA");

    console.log("======================================");

}


importarFormas();