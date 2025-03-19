from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Point(Base):
    __tablename__ = 'points'
    
    uid = Column(Integer, primary_key=True)
    actual = Column(Boolean, default=True)
    name = Column(String(100))
    point_type = Column(String(10))  # shop/truck
    address = Column(String(200))
    area = Column(String(50))
    phone = Column(String(20))
    parking = Column(String(200))
    driver = Column(String(100))
    govnumber = Column(String(15))
    
    services = relationship("Service", back_populates="point")
    devices = relationship("Device", back_populates="point")
    keys = relationship("Key", back_populates="point")

class Service(Base):
    __tablename__ = 'services'
    
    id = Column(Integer, primary_key=True)
    point_uid = Column(Integer, ForeignKey('points.uid'))
    type = Column(String(20))        # Срочная/Плановая
    date = Column(Date)
    result = Column(String(20))     # Выполнено/Ожидает/Перенесено
    comment = Column(String(500))
    
    point = relationship("Point", back_populates="services")

class Device(Base):
    __tablename__ = 'devices'
    
    id = Column(Integer, primary_key=True)
    point_uid = Column(Integer, ForeignKey('points.uid'))
    name = Column(String(50))
    ip = Column(String(15))
    location = Column(String(100))
    
    point = relationship("Point", back_populates="devices")

class Key(Base):
    __tablename__ = 'keys'
    
    id = Column(Integer, primary_key=True)
    point_uid = Column(Integer, ForeignKey('points.uid'))
    place = Column(String(50))      # Номер коробки
    comment = Column(String(200))
    
    point = relationship("Point", back_populates="keys")