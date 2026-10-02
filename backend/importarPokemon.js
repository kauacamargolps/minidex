require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

// ==========================================
// CONFIGURAÇÃO
// ==========================================

// Para adicionar novas gerações,
// basta alterar POKEMON_FINAL.
//
// Gen I:       151
// Gen II:      251
// Gen III:     386
// Gen IV:      493
// Gen V:       649
// Gen VI:      721
// Gen VII:     809
// Gen VIII:    905
// Gen IX:      1025

const POKEMON_INICIAL = 1;
const POKEMON_FINAL = 251;


// ==========================================
// CONFIGURAÇÃO DA POKEAPI
// ==========================================

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
// DESCOBRIR FRAQUEZAS
// ==========================================

function calcularFraquezas(tipo1, tipo2) {

    const tabela = {

        normal: {
            fraquezas: ["fighting"]
        },

        fire: {
            fraquezas: [
                "water",
                "ground",
                "rock"
            ]
        },

        water: {
            fraquezas: [
                "electric",
                "grass"
            ]
        },

        electric: {
            fraquezas: [
                "ground"
            ]
        },

        grass: {
            fraquezas: [
                "fire",
                "ice",
                "poison",
                "flying",
                "bug"
            ]
        },

        ice: {
            fraquezas: [
                "fire",
                "fighting",
                "rock",
                "steel"
            ]
        },

        fighting: {
            fraquezas: [
                "flying",
                "psychic",
                "fairy"
            ]
        },

        poison: {
            fraquezas: [
                "ground",
                "psychic"
            ]
        },

        ground: {
            fraquezas: [
                "water",
                "grass",
                "ice"
            ]
        },

        flying: {
            fraquezas: [
                "electric",
                "ice",
                "rock"
            ]
        },

        psychic: {
            fraquezas: [
                "bug",
                "ghost",
                "dark"
            ]
        },

        bug: {
            fraquezas: [
                "fire",
                "flying",
                "rock"
            ]
        },

        rock: {
            fraquezas: [
                "water",
                "grass",
                "fighting",
                "ground",
                "steel"
            ]
        },

        ghost: {
            fraquezas: [
                "ghost",
                "dark"
            ]
        },

        dragon: {
            fraquezas: [
                "ice",
                "dragon",
                "fairy"
            ]
        },

        dark: {
            fraquezas: [
                "fighting",
                "bug",
                "fairy"
            ]
        },

        steel: {
            fraquezas: [
                "fire",
                "fighting",
                "ground"
            ]
        },

        fairy: {
            fraquezas: [
                "poison",
                "steel"
            ]
        }
    };


    const fraquezas = new Set();


    if (tabela[tipo1]) {

        for (
            const fraqueza
            of tabela[tipo1].fraquezas
        ) {

            fraquezas.add(fraqueza);

        }
    }


    if (tipo2 && tabela[tipo2]) {

        for (
            const fraqueza
            of tabela[tipo2].fraquezas
        ) {

            fraquezas.add(fraqueza);

        }
    }


    return [...fraquezas];
}


// ==========================================
// IMPORTAR POKÉMON
// ==========================================

async function importarPokemon() {

    console.log("======================================");

    console.log(
        ` IMPORTANDO POKÉMON #${POKEMON_INICIAL} → #${POKEMON_FINAL}`
    );

    console.log("======================================");


    for (
        let id = POKEMON_INICIAL;
        id <= POKEMON_FINAL;
        id++
    ) {

        try {

            // ------------------------------
            // Pokémon
            // ------------------------------

            const pokemon = await buscar(
                `${API_BASE}/pokemon/${id}`
            );


            // ------------------------------
            // Tipos
            // ------------------------------

            const tipo1 =
                pokemon.types.find(
                    tipo => tipo.slot === 1
                )?.type.name || null;


            const tipo2 =
                pokemon.types.find(
                    tipo => tipo.slot === 2
                )?.type.name || null;


            // ------------------------------
            // Fraquezas
            // ------------------------------

            const fraquezas =
                calcularFraquezas(
                    tipo1,
                    tipo2
                );


            // ------------------------------
            // Sprite
            // ------------------------------

            const sprite =
                pokemon.sprites
                    ?.front_default || null;
            
            const spriteShiny =
                pokemon.sprites
                    ?.front_shiny || null;


            // ------------------------------
            // Dados para o Supabase
            // ------------------------------
            const dados = {
                id: pokemon.id,
                nome: pokemon.name,
                tipo_1: tipo1,
                tipo_2: tipo2,
                fraquezas: fraquezas,
                sprite: sprite,
                sprite_shiny: spriteShiny
            };


            // ------------------------------
            // Salvar
            // ------------------------------

            const { error } =
                await supabase
                    .from("pokemon")
                    .upsert(
                        dados,
                        {
                            onConflict: "id"
                        }
                    );


            if (error) {

                throw new Error(
                    error.message
                );

            }


            console.log(
                `✓ #${String(id).padStart(3, "0")} ${pokemon.name}`
            );


        } catch (erro) {

            console.error(
                `✗ Erro no Pokémon #${id}:`,
                erro.message
            );

        }
    }


    console.log("");

    console.log("======================================");

    console.log(" IMPORTAÇÃO FINALIZADA");

    console.log("======================================");

}


importarPokemon();