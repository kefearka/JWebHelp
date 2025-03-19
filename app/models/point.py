from app import db

class Point(db.Model):
    __tablename__ = 'points'
    
    uid = db.Column(db.Integer, primary_key=True)
    actual = db.Column(db.Boolean, default=True)
    name = db.Column(db.String(100), nullable=False)
    franchise = db.Column(db.Boolean, default=False)
    owner = db.Column(db.String(100))
    comment = db.Column(db.Text)
    
    shop = db.relationship('Shop', backref='point', uselist=False)
    track = db.relationship('Track', backref='point', uselist=False)
    services = db.relationship('Service', backref='point')
    keys = db.relationship('Key', backref='point')
    devices = db.relationship('Device', backref='point')

class Shop(db.Model):
    __tablename__ = 'shops'
    
    id = db.Column(db.Integer, primary_key=True)
    point_uid = db.Column(db.Integer, db.ForeignKey('points.uid'))
    address = db.Column(db.String(200), nullable=False)
    area = db.Column(db.String(50))
    phone = db.Column(db.String(20))

class Track(db.Model):
    __tablename__ = 'tracks'
    
    id = db.Column(db.Integer, primary_key=True)
    point_uid = db.Column(db.Integer, db.ForeignKey('points.uid'))
    parking = db.Column(db.String(200))
    driver = db.Column(db.String(100))
    govnumber = db.Column(db.String(15))