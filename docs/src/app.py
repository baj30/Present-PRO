from flask import Flask

app = Flask(__name__)

def greet_user(name):
    return f"Hello, {name}! Welcome to Present PRO."

@app.route("/")
def home():
    return greet_user("User")

@app.route("/about")
def about():
    return "This is the Present PRO project."

if __name__ == "__main__":
    app.run(debug=True)
