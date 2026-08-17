const runBtn = document.getElementById("runBtn");

const languageSelect =
    document.getElementById("languageSelect");

const codeEditor =
    document.getElementById("codeEditor");

const customInput =
    document.getElementById("customInput");

const outputText =
    document.getElementById("outputText");

const errorText =
    document.getElementById("errorText");

const editorHeading =
    document.getElementById("editorHeading");


// ========================================
// LANGUAGE CHANGE
// ========================================

languageSelect.addEventListener("change", function () {

    const language = languageSelect.value;


    // ---------------- C ----------------

    if (language === "c") {

        editorHeading.textContent =
            "C Code Editor";

        codeEditor.value =
`#include <stdio.h>

int main()
{
    printf("Hello World");

    return 0;
}`;

    }


    // ---------------- C++ ----------------

    else if (language === "cpp") {

        editorHeading.textContent =
            "C++ Code Editor";

        codeEditor.value =
`#include <iostream>
using namespace std;

int main()
{
    cout << "Hello World";

    return 0;
}`;

    }


    // ---------------- Python ----------------

    else if (language === "python") {

        editorHeading.textContent =
            "Python Code Editor";

        codeEditor.value =
`print("Hello World")`;

    }


    // ---------------- JavaScript ----------------

    else if (language === "javascript") {

        editorHeading.textContent =
            "JavaScript Code Editor";

        codeEditor.value =
`console.log("Hello World");`;

    }

});


// ========================================
// RUN CODE
// ========================================

runBtn.addEventListener("click", async function () {

    const code = codeEditor.value;

    const customInput =
        document.getElementById("customInput").value;

    const language =
        languageSelect.value;


    // Check empty code

    if (!code.trim()) {

        outputText.textContent = "";

        errorText.textContent =
            "Please enter some code.";

        return;

    }


    // Show compiling message

    outputText.textContent =
        "Running program...";

    errorText.textContent = "";


    try {

        const response = await fetch(
            "/compile",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    code: code,

                    input: customInput,

                    language: language

                })
            }
        );


        const result =
            await response.json();


        // -----------------------------
        // SUCCESS
        // -----------------------------

        if (result.success) {

            outputText.textContent =
                result.output ||
                "Program executed successfully.";

            errorText.textContent =
                "No errors";

        }


        // -----------------------------
        // ERROR
        // -----------------------------

        else {

            outputText.textContent = "";

            errorText.textContent =
                result.error ||
                "Compilation / Runtime error.";

        }


    }

    catch (error) {

        console.error(error);

        outputText.textContent = "";

        errorText.textContent =
            "Unable to connect to compiler server.";

    }

});