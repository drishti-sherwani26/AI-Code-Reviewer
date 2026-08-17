from flask import Flask, request, jsonify, send_from_directory
import subprocess
import tempfile
import os

app = Flask(__name__, static_folder="static")


@app.route("/compile", methods=["POST"])

def compile_code():

    data = request.get_json()

    code = data.get("code", "")
    user_input = data.get("input", "")
    language = data.get("language", "")

    if not code.strip():
        return jsonify({
            "success": False,
            "error": "Please enter some code."
        })


    try:

        # ====================================
        # C
        # ====================================

        if language == "c":
            return run_c(code, user_input)


        # ====================================
        # C++
        # ====================================

        elif language == "cpp":
            return run_cpp(code, user_input)


        # ====================================
        # PYTHON
        # ====================================

        elif language == "python":
            return run_python(code, user_input)


        # ====================================
        # JAVASCRIPT
        # ====================================

        elif language == "javascript":
            return run_javascript(code, user_input)


        # ====================================
        # UNKNOWN LANGUAGE
        # ====================================

        else:

            return jsonify({
                "success": False,
                "error": "Unsupported programming language."
            })


    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })


# ============================================
# C
# ============================================

def run_c(code, user_input):

    with tempfile.TemporaryDirectory() as temp_dir:

        source_file = os.path.join(
            temp_dir,
            "program.c"
        )

        executable = os.path.join(
            temp_dir,
            "program"
        )


        # Save C code

        with open(source_file, "w") as file:
            file.write(code)


        # Compile C

        compile_result = subprocess.run(

            [
                "gcc",
                source_file,
                "-o",
                executable
            ],

            capture_output=True,
            text=True,
            timeout=10
        )


        # Compilation error

        if compile_result.returncode != 0:

            return jsonify({
                "success": False,
                "error": compile_result.stderr
            })


        # Run program

        return execute_program(
            [executable],
            user_input
        )


# ============================================
# C++
# ============================================

def run_cpp(code, user_input):

    with tempfile.TemporaryDirectory() as temp_dir:

        source_file = os.path.join(
            temp_dir,
            "program.cpp"
        )

        executable = os.path.join(
            temp_dir,
            "program"
        )


        # Save C++ code

        with open(source_file, "w") as file:
            file.write(code)


        # Compile C++

        compile_result = subprocess.run(

            [
                "g++",
                source_file,
                "-o",
                executable
            ],

            capture_output=True,
            text=True,
            timeout=10
        )


        # Compilation error

        if compile_result.returncode != 0:

            return jsonify({
                "success": False,
                "error": compile_result.stderr
            })


        # Run program

        return execute_program(
            [executable],
            user_input
        )


# ============================================
# PYTHON
# ============================================

def run_python(code, user_input):

    with tempfile.TemporaryDirectory() as temp_dir:

        source_file = os.path.join(
            temp_dir,
            "program.py"
        )


        # Save Python code

        with open(source_file, "w") as file:
            file.write(code)


        # Run Python

        return execute_program(

            [
                "python3",
                source_file
            ],

            user_input
        )


# ============================================
# JAVASCRIPT
# ============================================

def run_javascript(code, user_input):

    with tempfile.TemporaryDirectory() as temp_dir:

        source_file = os.path.join(
            temp_dir,
            "program.js"
        )


        # Save JavaScript code

        with open(source_file, "w") as file:
            file.write(code)


        # Run JavaScript

        return execute_program(

            [
                "node",
                source_file
            ],

            user_input
        )


# ============================================
# EXECUTE PROGRAM
# ============================================

def execute_program(command, user_input):

    try:

        result = subprocess.run(

            command,

            input=user_input,

            capture_output=True,

            text=True,

            timeout=5
        )


        # Runtime error

        if result.returncode != 0:

            return jsonify({

                "success": False,

                "error": result.stderr

            })


        # Successful execution

        return jsonify({

            "success": True,

            "output": result.stdout

        })


    except subprocess.TimeoutExpired:

        return jsonify({

            "success": False,

            "error":
                "Program execution timed out."

        })


# ============================================
# START FLASK SERVER
# ============================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5001
    )