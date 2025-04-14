const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.post("/restaurant", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send("식당 이름은 필수입니다.");

    const { error } = await supabase
        .from("information")
        .insert([{ restaurant: name }]);

    if (error) {
        console.error("에러:", error.message);
        return res.status(500).send("식당 저장 중 에러 발생");
    }

    res.status(200).send("식당 정보 저장 완료");
});

app.post("/phone", async (req, res) => {
    const { phone } = req.body;

    const { data: latest, error } = await supabase
        .from("information")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);

    if (error || !latest || latest.length === 0)
        return res.status(400).send("먼저 식당을 입력해야 합니다.");

    const latestId = latest[0].id;

    const { error: updateError } = await supabase
        .from("information")
        .update({ phone })
        .eq("id", latestId);

    if (updateError) {
        console.error("전화번호 저장 오류:", updateError.message);
        return res.status(500).send("전화번호 저장 실패");
    }

    res.status(200).send("전화번호 저장 완료");
});

app.listen(5000, () => {
    console.log("서버 실행 중: http://localhost:5000");
});
