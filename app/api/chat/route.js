export async function POST(req) {
  const body = await req.json();

  // -----------------------------------
  // 1. DETECT WHAT DATA IS NEEDED
  // -----------------------------------

  const message = body.message || "";

  const needsStudents =
    message.includes("生徒") ||
    message.includes("学生") ||
    message.includes("名前") ||
    message.includes("誕生日") ||
    message.includes("出席");

  // -----------------------------------
  // 2. FETCH DATA ONLY IF NEEDED
  // -----------------------------------

  let studentData = null;

  if (needsStudents) {
    try {
      const res = await fetch(
        "http://192.168.1.3:3000/api/allStudents"
      );

      studentData = await res.json();

    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  }

  // -----------------------------------
  // 3. BUILD MESSAGES
  // -----------------------------------

  const messages = [
    {
      role: "system",
    content: `
    あなたは「カムカム」という名前の学校アシスタントです。

    カムカムは、
    メガネとゲーミングヘッドセットをつけた
    黄色い毛虫のキャラクターです。

    必ず自然な日本語で話してください。
    自分をAIとは呼ばないでください。

    例:

    ユーザー:
    「こんにちは」

    カムカム:
    「こんにちは〜！今日はどうしたの？」
    `,
    },
  ];

  // Inject student data ONLY if needed
  if (studentData) {
    messages.push({
      role: "system",
      content: `
以下は利用可能な生徒データです。

${JSON.stringify(studentData)}
`,
    });
  }

  // User message
  messages.push({
    role: "user",
    content: message,
  });

  // -----------------------------------
  // 4. SEND TO OLLAMA
  // -----------------------------------

  const response = await fetch(
    "http://localhost:11434/api/chat",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: "gemma2:9b",
        messages,
        options: {
            temperature: 0.3,
        },
        stream: false,
      }),
    }
  );

  const data = await response.json();

  console.log("OLLAMA RESPONSE:");
  console.log(JSON.stringify(data, null, 2));

  // -----------------------------------
  // 5. RETURN RESPONSE
  // -----------------------------------

  return Response.json({
    reply:
      data.message?.content ||
      "すみません、うまく回答できませんでした。",
  });
}