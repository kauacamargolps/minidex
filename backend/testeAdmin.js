require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

console.log("URL:", process.env.SUPABASE_URL ? "OK" : "FALTANDO");
console.log(
    "SECRET:",
    process.env.SUPABASE_SECRET_KEY ? "OK" : "FALTANDO"
);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

async function testar() {
    const { data, error } = await supabase
        .from("pokemon")
        .select("id")
        .limit(1);

    if (error) {
        console.error("ERRO:", error.message);
        return;
    }

    console.log("CONEXÃO ADMIN OK!");
    console.log(data);
}

testar();