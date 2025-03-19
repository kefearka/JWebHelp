from flask import jsonify, request, render_template
from . import app, db
from .models import Point, Service

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    from datetime import datetime
    try:
        date_str = request.args.get('date')
        date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else None
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    query = Service.query.join(Point)
    if date:
        query = query.filter(Service.date == date)
    
    tasks = query.all()
    
    result = []
    for service in tasks:
        result.append({
            "id": service.id,
            "name": service.point.name,
            "address": service.point.address,
            "date": service.date.isoformat(),
            "type": service.type,
            "result": service.result,
            "key_box": next((k.place for k in service.point.keys), None)
        })
    
    return jsonify(result)

@app.route('/api/tasks/<int:task_id>/complete', methods=['