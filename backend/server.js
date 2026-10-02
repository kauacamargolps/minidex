const express = require("express");
const cors = require("cors");

const supabase = require("./supabase");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "API da Pokédex funcionando!"
    });
});

app.get("/teste", async (req, res) => {
    try {
        console.log("Testando conexão com Supabase...");

        const { data, error } = await supabase
            .from("pokemon")
            .select("id, nome")
            .limit(1);

        console.log("Resultado:", data);
        console.log("Erro:", error);

        if (error) {
            return res.status(500).json({
                sucesso: false,
                erro: error.message,
                detalhes: error
            });
        }

        res.json({
            sucesso: true,
            dados: data
        });

    } catch (erro) {
        console.log("ERRO CAPTURADO:", erro);

        res.status(500).json({
            sucesso: false,
            tipo: erro.name,
            erro: erro.message
        });
    }
});

const PORTA = process.env.PORT || 3000;

app.get("/pokemon", async (req, res) => {
    const { data, error } = await supabase
        .from("pokemon")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        return res.status(500).json({
            erro: error.message
        });
    }

    res.json(data);
});

app.get("/pokemon/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1 || id > 251) {
        return res.status(400).json({
            erro: "ID de Pokémon inválido"
        });
    }

    // ==========================================
    // BUSCAR O POKÉMON
    // ==========================================

    const { data: pokemon, error: erroPokemon } =
        await supabase
            .from("pokemon")
            .select("*")
            .eq("id", id)
            .single();

    if (erroPokemon) {
        return res.status(500).json({
            erro: erroPokemon.message
        });
    }


    // ==========================================
    // BUSCAR TODAS AS RELAÇÕES DE EVOLUÇÃO
    // ==========================================

    const { data: todasEvolucoes, error: erroEvolucoes } =
        await supabase
            .from("evolucoes")
            .select("pokemon_id, evolucao_id");

    if (erroEvolucoes) {
        return res.status(500).json({
            erro: erroEvolucoes.message
        });
    }


    // ==========================================
    // ENCONTRAR A LINHA EVOLUTIVA COMPLETA
    // ==========================================

    const idsLinha = new Set([id]);

    let houveAlteracao = true;

    while (houveAlteracao) {

        houveAlteracao = false;

        for (const relacao of todasEvolucoes) {

            if (
                idsLinha.has(relacao.pokemon_id) &&
                !idsLinha.has(relacao.evolucao_id)
            ) {
                idsLinha.add(relacao.evolucao_id);
                houveAlteracao = true;
            }

            if (
                idsLinha.has(relacao.evolucao_id) &&
                !idsLinha.has(relacao.pokemon_id)
            ) {
                idsLinha.add(relacao.pokemon_id);
                houveAlteracao = true;
            }
        }
    }


    // ==========================================
    // BUSCAR DADOS DOS POKÉMON DA LINHA
    // ==========================================

    const ids = [...idsLinha];

    const { data: evolucoes, error: erroLinha } =
        await supabase
            .from("pokemon")
            .select("id, nome, sprite")
            .in("id", ids)
            .order("id", { ascending: true });

    if (erroLinha) {
        return res.status(500).json({
            erro: erroLinha.message
        });
    }


    // ==========================================
    // BUSCAR FORMAS ALTERNATIVAS
    // ==========================================

    const { data: formas, error: erroFormas } =
        await supabase
            .from("formas")
            .select("id, nome, sprite")
            .eq("pokemon_id", id)
            .order("id");

    if (erroFormas) {
        return res.status(500).json({
            erro: erroFormas.message
        });
    }


    // ==========================================
    // RESPOSTA
    // ==========================================

    res.json({
        ...pokemon,
        evolucoes,
        formas
    });
});

console.log("SUPABASE_URL existe?", !!process.env.SUPABASE_URL);
console.log("SUPABASE_SECRET_KEY existe?", !!process.env.SUPABASE_SECRET_KEY);

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});