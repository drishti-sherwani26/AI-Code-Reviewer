const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const messages = document.getElementById("messages");

async function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    // Show user's message
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = text;
    messages.appendChild(userMessage);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    // Show AI thinking message
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.innerHTML = `
        <div class="message-robot">🤖</div>
        <div>
            <strong>AI Assistant</strong>
            <p>Thinking...</p>
        </div>
    `;
    messages.appendChild(botMessage);
    messages.scrollTop = messages.scrollHeight;

    try {
        // CHANGED from localhost:3000 to use your own server!
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Server error");

        // Display AI response
        botMessage.innerHTML = `
            <div class="message-robot">🤖</div>
            <div>
                <strong>AI Assistant</strong>
                <p>${formatResponse(data.reply)}</p>
            </div>
        `;
    } catch (error) {
        console.error(error);
        botMessage.innerHTML = `
            <div class="message-robot">🤖</div>
            <div>
                <strong>AI Assistant</strong>
                <p>Sorry! I couldn't connect to the AI server. (Make sure you set up the /api/chat route!)</p>
            </div>
        `;
    }
    messages.scrollTop = messages.scrollHeight;
}

function formatResponse(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});