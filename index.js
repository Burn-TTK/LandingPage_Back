const express = require("express");
const cors = require("cors");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// JSON 데이터 불러오기
const menuData = JSON.parse(fs.readFileSync("./restaurant_menu_data.json", "utf-8"));

// Swagger 설정
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restaurant Menu API",
            version: "1.0.0",
            description: "식당 및 메뉴 정보를 제공하는 API"
        },
        servers: [{ url: "http://localhost:3000" }]
    },
    apis: ["./index.js"]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: 전체 식당 이름 목록 가져오기
 *     responses:
 *       200:
 *         description: 식당 이름 리스트
 */
app.get("/restaurants", (req, res) => {
    const restaurants = [...new Set(menuData.map(item => item.restaurant_name))];
    res.json(restaurants.map((name, index) => ({ id: index + 1, name })));
});

/**
 * @swagger
 * /restaurants/{name}/menu:
 *   get:
 *     summary: 특정 식당의 메뉴 가져오기
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 해당 식당의 메뉴 리스트
 */
app.get("/restaurants/:name/menu", (req, res) => {
    const { name } = req.params;
    const filteredMenu = menuData.filter(item => item.restaurant_name === name);
    res.json(filteredMenu);
});

app.listen(PORT, () => {
    console.log(`✅ API Server running at http://localhost:${PORT}`);
});
