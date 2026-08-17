const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("SERVER.JS STARTED");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.send("AI Code Reviewer Server is running!");
});

app.post("/api/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const response = await client.responses.create({

            model: "gpt-5",

            instructions: `
You are an AI Code Reviewer and programming assistant.

Help users with:

- C
- C++
- Java
- Python
- JavaScript
- HTML
- CSS
- SQL
- Data Structures
- Algorithms
- LeetCode
- Debugging
- Compiler errors
- Code explanation
- Code optimization
- Time complexity
- Space complexity

When the user provides code:

1. Understand the code.
2. Find the problem.
3. Explain the problem simply.
4. Give corrected code when necessary.
5. Explain what was changed.
6. Mention time and space complexity when relevant.

Keep explanations beginner-friendly.
`,

            input: userMessage
        });

        res.json({
            reply: response.output_text
        });

   } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
        error: error.message
    });
}
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`AI Code Reviewer running at http://localhost:${PORT}`);
});