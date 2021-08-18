# -*- coding: utf-8 -*-
"""
Spyder Editor

This is the API for login and database checking for benificiaries
Most things on here need redoing still like the hard coded password and hash
"""

from flask import Flask, jsonify, request 
from flask_restful import Resource, Api, reqparse
import mysql.connector
import hashlib
from random import randrange

# Hardcode Charity Login since its not really important for the application - Working
# Also a good way to test if the API is working
def check_login(username, password):
    if (username != 'charity'):
        return False
    if (password != 'charity'):
        return False
    return True

def dummy_paypal():
    randomNo = randrange(11)
    if randomNo > 8:
        return False
    else:
        return True

# Connection to database - WORKING
db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="charitydatabase"
        )

# cursor to pass sql and values
cursor = db.cursor()

# get beneficiary function - WORKING
def get_beneficiaries():
    beneficiaries = []
    
    cursor.execute("SELECT * FROM beneficiaries")
    
    result = cursor.fetchall()
    
    for row in result:
        beneficiaries.append(row)
    
    return {'beneficiaries': beneficiaries}

# add beneficiary to database function - WORKING
def add_beneficiary(name, phone, email):
    response = ''

    try:
        add_beneficiary = ("INSERT INTO beneficiaries "
                        "(name, phone, email) "
                        "VALUES (%s, %s, %s)")
        values = (name, phone, email)
    
        cursor.execute(add_beneficiary, values)
        db.commit()
        
        response = 'Successfully Added'
        return response

    except:
        response = 'An error has occured'
        return response

def hash_for_id(name):
    print(name)
    return int(hashlib.sha256(name.encode('utf-8')).hexdigest(), 16) % 10**20

# Delete beneficiaries by name - WORKING
def remove_beneficiary(name):
    response = ''
    
    try:
        remove_beneficiary = "DELETE FROM beneficiaries WHERE name = %s"
    
        cursor.execute(remove_beneficiary, (name,))
        db.commit()
        
        response = 'Successfully Removed'
        return response
    
    except:
        response = 'Error Occured'
        return response



#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>S>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


app = Flask(__name__)
api = Api(app)

#>>>>>>>>>>>>>>>>>>>>>GET REQUESTS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

class GetBeneficiaries(Resource):
    def get(self):
        response = get_beneficiaries()
        return jsonify(response)
    
api.add_resource(GetBeneficiaries, '/get_beneficiaries')

class PalPayDummy(Resource):
    def get(self):
        response = {'success': dummy_paypal()}
        return jsonify(response)

api.add_resource(PalPayDummy, '/palpay')
#>>>>>>>>>>>>>>>>>>>>>POST REQUESTS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# Login
class Login(Resource):
    def post(self):
        request.get_json(force=True)
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('password', type=str)
        args = parser.parse_args()
        
        response = {'login_success' : check_login(args.username, args.password),
                    'login_hash': str(hash_for_id(args.username))}
        
        if len(args.username) < 1 or len(args.password) < 5:
            return jsonify({"login_success": "failed",
                            "login_hash": "0"})
        
        return jsonify(response)
    
api.add_resource(Login, '/login')

# Check login Hash
class Check_login(Resource):
    def post(self):
        request.get_json(force=True)
        parser = reqparse.RequestParser()
        parser.add_argument('hash', type=str)
        args = parser.parse_args()
        
        response = {'match': str(hash_for_id(str('charity'))) == args.hash}
        return jsonify(response)

api.add_resource(Check_login, '/check_login')

# Add Beneficiary 
class AddBeneficiary(Resource):
    def post(self):
        request.get_json(force=True)
        parser = reqparse.RequestParser()
        parser.add_argument('beneficiary', type=str)
        parser.add_argument('phone', type=str)
        parser.add_argument('email', type=str)
        args = parser.parse_args()
        response = {'message': add_beneficiary(args.beneficiary, args.phone, args.email)}
        
        if len(args.beneficiary) < 1 or len(args.phone) != 11 or "@" not in args.email:
                    response = {'message': add_beneficiary(args.beneficiary, args.phone, args.email)}
        
        return jsonify(response)
        
api.add_resource(AddBeneficiary, '/add_beneficiary')

# Remove beneficiary
class RemoveBeneficiary(Resource):
    def post(self):
        request.get_json(force=True)
        parser = reqparse.RequestParser()
        parser.add_argument('beneficiary', type=str)
        args = parser.parse_args()
        
        response = {'message': remove_beneficiary(args.beneficiary)}
        return jsonify(response)

api.add_resource(RemoveBeneficiary, '/remove_beneficiary')

app.run(host = '0.0.0.0', port = 5000)
    