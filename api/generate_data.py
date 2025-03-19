# api/generate_data.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Point, Service, Device, Key
from datetime import datetime, timedelta
from faker import Faker
import random

fake = Faker('ru_RU')
engine = create_engine('sqlite:///database.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

def generate_full_data():
    # Генерация 25 точек
    for _ in range(25):
        point = Point(
            name=fake.company(),
            address=fake.street_address(),
            point_type=random.choice(['shop', 'truck']),
            phone=fake.phone_number(),
            area=fake.city(),
            franchise=random.choice([True, False]),
            actual=random.choice([True, False]),
            owner=fake.name(),
            comment=fake.sentence(),
            parking=fake.address() if random.random() > 0.7 else None,
            driver=fake.name() if random.random() > 0.5 else None,
            govnumber=fake.license_plate() if random.random() > 0.6 else None
        )
        session.add(point)
        session.flush()  # Для получения ID
        
        # Устройства (3-5 на точку)
        for _ in range(random.randint(3,5)):
            session.add(Device(
                point_uid=point.uid,
                name=f"Устройство {fake.word()}",
                ip=fake.ipv4(),
                location=fake.street_address(),
                comment=fake.sentence()
            ))
        
        # Ключи (1-2 на точку)
        for _ in range(random.randint(1,2)):
            session.add(Key(
                point_uid=point.uid,
                place=f"Коробка №{random.randint(1,15)}",
                comment=fake.sentence()
            ))
        
        # Сервисные задания (2-4 на точку)
        for _ in range(random.randint(2,4)):
            session.add(Service(
                point_uid=point.uid,
                type=random.choice(['Срочная', 'Плановая']),
                date=fake.date_between(
                    start_date='-30d', 
                    end_date='+60d'
                ),
                result=random.choice(['Выполнено', 'Ожидает', 'Перенесено']),
                comment=fake.text(max_nb_chars=200)
            ))
    
    session.commit()
    print("Сгенерировано: 25 точек, 100+ устройств, 40+ ключей, 80+ сервисных заданий")

if __name__ == '__main__':
    generate_full_data()