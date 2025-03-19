from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Point, Service, Device, Key
from datetime import datetime, timedelta

fake = Faker('ru_RU')
engine = create_engine('sqlite:///database.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

def create_points(count=20):
    for _ in range(count):
        point = Point(
            name=fake.company(),
            point_type=fake.random_element(['shop', 'truck']),
            address=fake.address(),
            area=fake.city(),
            phone=fake.phone_number(),
            parking=fake.address() if fake.boolean() else None,
            driver=fake.name() if fake.boolean() else None,
            govnumber=fake.license_plate() if fake.boolean() else None
        )
        session.add(point)
        create_related_data(point)
    session.commit()

def create_related_data(point):
    # Устройства
    for _ in range(fake.random_int(1, 4)):
        session.add(Device(
            point=point,
            name=fake.word(),
            ip=fake.ipv4(),
            location=fake.street_address()
        ))
    
    # Ключи
    if fake.boolean(70):
        session.add(Key(
            point=point,
            place=f"Коробка №{fake.random_int(1, 10)}",
            comment=fake.sentence()
        ))
    
    # Сервисные задания
    for _ in range(fake.random_int(1, 3)):
        session.add(Service(
            point=point,
            type=fake.random_element(['Срочная', 'Плановая']),
            date=fake.date_between(
                start_date=datetime.now() - timedelta(days=30),
                end_date=datetime.now() + timedelta(days=30)
            ),
            result=fake.random_element(['Выполнено', 'Ожидает', 'Перенесено']),
            comment=fake.sentence()
        ))

if __name__ == '__main__':
    create_points()
    print("Тестовые данные созданы: 20 объектов с устройствами, ключами и задачами")