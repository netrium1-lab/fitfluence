const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// AI 시나리오 작성을 위한 Gemini 함수
exports.generateScenario = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { prompt } = req.body;
      
      // API 키는 환경변수에서 가져오도록 설정 (나중에 등록할 예정)
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const fullPrompt = `당신은 전문 영상 시나리오 작가입니다. 
      입력된 주제 '${prompt}'에 대해 다음 구조로 시나리오를 작성해주세요.
      1. 제목
      2. 전체 줄거리 (3문장 이내)
      3. 장면별 상세 묘사 (각 장면은 이미지 생성 AI가 이해하기 쉽게 시각적 묘사를 포함해주세요)
      
      응답은 반드시 한국어로 작성해주세요.`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      res.status(200).json({
        status: "success",
        scenario: text
      });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  });
});
