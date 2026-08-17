const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const messages = document.getElementById("messages");


async function sendMessage() {

    const text = input.value.trim();

    if (text === "") {
        return;
    }


    // -------------------------
    // Show user's message
    // -------------------------

    const userMessage = document.createElement("div");

    userMessage.className = "user-message";

    userMessage.textContent = text;

    messages.appendChild(userMessage);


    // Clear input

    input.value = "";


    // Scroll to bottom

    messages.scrollTop = messages.scrollHeight;


    // -------------------------
    // Show AI thinking message
    // -------------------------

    const botMessage = document.createElement("div");

    botMessage.className = "bot-message";

    botMessage.innerHTML = `
        <div class="message-robot">
            🤖
        </div>

        <div>
            <strong>AI Assistant</strong>

            <p>
                Thinking...
            </p>
        </div>
    `;

    messages.appendChild(botMessage);


    // -------------------------
    // Send message to backend
    // -------------------------

    try {

        const response = await fetch(
            "http://localhost:3000/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: text
                })
            }
        );


        const data = await response.json();


        // -------------------------
        // Check for errors
        // -------------------------

        if (!response.ok) {

            throw new Error(
                data.error || "Server error"
            );

        }


        // -------------------------
        // Display AI response
        // -------------------------

        botMessage.innerHTML = `
            <div class="message-robot">
                🤖
            </div>

            <div>
                <strong>AI Assistant</strong>

                <p>
                    ${formatResponse(data.reply)}
                </p>
            </div>
        `;


    } catch (error) {

        console.error(error);


        botMessage.innerHTML = `
            <div class="message-robot">
                🤖
            </div>

            <div>
                <strong>AI Assistant</strong>

                <p>
                    Sorry! I couldn't connect to
                    the AI server.
                </p>
            </div>
        `;

    }


    messages.scrollTop = messages.scrollHeight;

}


// -------------------------
// Format AI response
// -------------------------

function formatResponse(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

}


// -------------------------
// Send button
// -------------------------

sendButton.addEventListener(
    "click",
    sendMessage
);


// -------------------------
// Enter key
// -------------------------

input.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);