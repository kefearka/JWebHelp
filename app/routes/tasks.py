from flask import Blueprint, render_template
from flask_login import login_required
from datetime import datetime
from app.models import Service, Point

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/')
@login_required
def tasks_list():
    # Получаем задачи на сегодня
    today = datetime.today().date()
    services = Service.query.filter(Service.date >= today).order_by(Service.date).all()
    
    points_data = []
    for service in services:
        point = Point.query.get(service.point_uid)
        address = point.shop.address if point.shop else point.track.parking
        
        points_data.append({
            'id': service.id,
            'name': point.name,
            'address': address,
            'type': service.type,
            'date': service.date,
            'status': service.result,
            'comment': service.comment
        })
    
    return render_template('tasks/list.html', points=points_data)