from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class Point(db.Model):
    uid = db.Column(db.Integer, unique=True, primary_key=True)
    actual = db.Column(db.Boolean)
    name = db.Column(db.String(50))
    franchise = db.Column(db.Boolean)
    owner = db.Column(db.String(100))
    address = db.Column(db.String(100))
    area = db.Column(db.String(50))
    phone = db.Column(db.String(50)) 
    ptype = db.Column(db.String(50))
    driver = db.Column(db.String(50))
    govnumber = db.Column(db.String(25))
    comment = db.Column(db.String(100))

class Device(db.Model):
    id = db.Column(db.Integer)
    point_uid = db.Column(db.Integer)
    name = db.Column(db.String(50))
    ip = db.Column(db.String(50))
    location = db.Column(db.String(50))
    comment = db.Column(db.String(100))

class Service(db.Model):
    id = db.Column(db.Integer)
    point_uid = db.Column(db.Integer)
    stype = db.Column(db.String(50))
    date = db.Column(db.Date)
    result = db.Column(db.Array)
    comment = db.Column(db.String(100))

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Point.query.all()
    return jsonify([task.to_dict() for task in tasks])

if __name__ == '__main__':
    app.run(debug=True)