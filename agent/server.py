from flask import Flask, request, jsonify, render_template
from main import ask_agent

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    user_input = data.get("prompt", "")
    reply = ask_agent(user_input)
    return jsonify({"response": reply})

if __name__ == "__main__":
    app.run(debug=True)
