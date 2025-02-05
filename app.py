from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Подключение к базе данных
conn = sqlite3.connect("sosal.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        balance INTEGER DEFAULT 0,
        energy INTEGER DEFAULT 100,
        clickMultiplier REAL DEFAULT 1,
        energyUpgradeCost INTEGER DEFAULT 200,
        clickUpgradeCost INTEGER DEFAULT 200,
        clickPower REAL DEFAULT 3
    )
""")
conn.commit()

# Получение данных пользователя
@app.route("/api/user/<user_id>", methods=["GET"])
def get_user(user_id):
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user_data = cursor.fetchone()
    if not user_data:
        return jsonify({}), 404
    columns = [desc[0] for desc in cursor.description]
    return jsonify(dict(zip(columns, user_data)))

# Сохранение данных пользователя
@app.route("/api/user/<user_id>", methods=["POST"])
def save_user(user_id):
    data = request.json
    cursor.execute("""
        INSERT OR REPLACE INTO users (id, balance, energy, clickMultiplier, energyUpgradeCost, clickUpgradeCost, clickPower)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, data.get("balance", 0), data.get("energy", 100), data.get("clickMultiplier", 1),
          data.get("energyUpgradeCost", 200), data.get("clickUpgradeCost", 200), data.get("clickPower", 3)))
    conn.commit()
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(debug=True)