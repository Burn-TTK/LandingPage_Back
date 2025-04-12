// index.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());            // CORS 허용
app.use(express.json());    // JSON 바디 파싱

let lastRestaurant = null;  // 임시 저장용

// 식당 저장
app.post("/restaurant", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send("식당 이름은 필수입니다.");
    }

    lastRestaurant = { name }; // 서버 메모리에 저장
    console.log("식당 데이터 : ", lastRestaurant);
    res.status(200).send("식당 정보 저장 완료");
});

// 전화번호 저장
app.post("/phone", (req, res) => {
    const { phone } = req.body;

    if (!lastRestaurant) {
        return res.status(400).send("먼저 식당 이름을 입력해야 합니다.");
    }

    lastRestaurant.phone = phone;
    console.log(" 전화번호까지 받은 데이터 : ", lastRestaurant);
    res.status(200).send("전화번호 저장 완료");
});

app.listen(5000, () => {
    console.log(" 서버 실행 중: http://localhost:5000");
});
