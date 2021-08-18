
"""

Created on Mon May 10 13:41:43 2021
Charity Blockchain
@author: vjmar
Because the blockchain heavily relies on cryptography, there was only so many ways to do things
as all ways use the same libraries such as datetime, hashlib, json. However,
[Khan18]'s video was used as a starting point to learn how to create a generic blockchain.
It was from using this as a template that i created what i needed for this charity application.
"""

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# imports for the blockchain
import datetime # for dates blocks are created
import hashlib # to hash the blocks
import json # to encode the blocks before hashing
from flask import Flask, jsonify, request # to create an object of Flask class and jsonify to return requests
from flask_restful import Resource, Api, reqparse
import requests
from uuid import uuid4
from urllib.parse import urlparse
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


receiver_name = "Vincent"

class Blockchain:
    
# Constructor
    def __init__(self):
        self.chain = [] 
        self.transactions = []      
        self.create_block(proof = 1, previous_hash = '0', reason='') 
        self.nodes = set() 

# Create block function
    def create_block(self, proof, previous_hash, reason):
        block = {'index': len(self.chain) + 1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof':proof,
                 'previous_hash': previous_hash,
                 'transactions': self.transactions,
                 'reason': reason}
        self.chain.append(block) 
        self.transactions = [] 
        return block

# get the last block create function
    def get_previous_block(self):
        return self.chain[-1]

# method to get proof of work - used to verify the block
    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False # Sets to true when you find the solution
        
        while check_proof is False:
            hash_op = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_op[:4] == '0000': # number of '0's can be increased to increase difficulty - improves blockchain validity but increase time taken to verify blocks.
                check_proof = True
            else:
                new_proof += 1
        return new_proof
            
# Returns the cryptographic hash of a block
    def hash(self, block): 
        encoded_block = json.dumps(block, sort_keys = True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
        
# Check if the blockchian is valid
    def is_chain_valid(self):
        previous_block = self.chain[0] # initially get first block
        block_index = 1
        
        while block_index < len(self.chain): # go through the whole chain
            block = self.chain[block_index] # current block
            
            if block['previous_hash'] != self.hash(previous_block): # means previous hash doesnt match hash of previous block -  block is invalid!
                return False 
           
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            
            if hash_operation[:4] != '0000': # means  if first 4 chars of the hash isnt 0000
                return False # blockchain is invalid
            
            previous_block = block
            block_index += 1
            
        return True # if no problems the chain is valid
          
# Add transactions to a block
    def add_transaction(self, sender, receiver, amount): # adds transactions to a block
        
        if not len(sender) > 0 or not len(receiver) > 0:
            return;
        
        self.transactions.append({'from': sender,
                                  'to': receiver,
                                  'amount': round(amount, 2)})
        previous_block = self.get_previous_block()
        
        return previous_block['index'] + 1
    
# Add nodes
    def add_node(self, node_address):
        parsed_url = urlparse(node_address)
        self.nodes.add(parsed_url.netloc) # because parsed_url = ParseResult(scheme='http', netloc='127.0.0.1:5000', path='/', params='', query='', fragment='')
        
# replace with valid chain function
    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                if response.json()['valid'] == True: # Only adopt the valid chains
                    length = response.json()['chain_length']
                    chain = response.json()['blockchain']
                    if length > max_length:
                        max_length = length
                        longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            return True
        return False

# add block to blockchain function
    def mine(self, reason):
        prev_block = blockchain.get_previous_block() #get prev block
        prev_proof = prev_block['proof'] # get prev proof of work
        proof = blockchain.proof_of_work(prev_proof) # current proof 
        prev_hash = blockchain.hash(prev_block)
        
        # blockchain.add_transaction(sender = node_address, receiver = receiver_name, amount = 1)
        current_block = blockchain.create_block(proof, prev_hash, reason) # block is appended and returned
        
        response = {'message': "Block added to the chain.",
                    'index': current_block["index"],
                    'timestamp': current_block["timestamp"],
                    'proof': current_block["proof"],
                    'prev_hash': current_block["previous_hash"],
                    'transacions': current_block["transactions"]
                    }
        return response
        
# Calculate total amount donated
    def total_donated(self):
        block_index = 1
        total_donated = 0
        
        while block_index < len(self.chain): # go through the whole chain
            block = self.chain[block_index] # current block
            
            if block["reason"] == 'Donation':
                amount = block["transactions"][0]["amount"]
                total_donated += amount
            
            block_index += 1
            
        response = total_donated
        return response

# Calculate amount given to beneficiaries
    def total_to_beneficiary(self):
        block_index = 1
        total_donated = 0
        
        while block_index < len(self.chain): # go through the whole chain
            block = self.chain[block_index] # current block
            
            if block['reason'] == 'Beneficiary':
                amount = block["transactions"][0]["amount"]
                total_donated += amount
            
            block_index += 1
            
        response = total_donated
        return response

# Calculate difference
    def donation_leftover(self):
        donated = blockchain.total_donated() 
        given = blockchain.total_to_beneficiary();
        total = donated - given
    
        return total
    
# Check Validity
    def replace_if_invalid(self):
        if self.is_chain_valid != True:
            is_chain_replaced = blockchain.replace_chain()
            if is_chain_replaced:
                response = {'message': 'Current chain was replaced.',
                            'new_chain': blockchain.chain}
                return response
            else:
                response = {'message': 'No change required',
                            'actual_chain': blockchain.chain}
                return response
        return 
       
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>################################################################################################################
# Create the web app - Flask
app = Flask(__name__)
api = Api(app)

# Create an address for the node on Port (5000 for now)
node_address = str(uuid4()).replace('-', '') # creates a node address on port 5000

# Create a blockchain - create instance of it
blockchain = Blockchain()

#>>>>>>>>>>>>>>>>>>>>>GET REQUESTS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


class TotalDonated(Resource):
    def get(self):
        response = blockchain.total_donated()
        return jsonify(response)
api.add_resource(TotalDonated ,'/total_donated')

class TotalMovedToBeneficiary(Resource):
    def get(self):
        blockchain.replace_if_invalid()
        response = blockchain.total_to_beneficiary()
        return jsonify(response)
api.add_resource(TotalMovedToBeneficiary ,'/total_to_beneficiary')

class GetFullChain(Resource):
    def get(self):
        return {'blockchain': blockchain.chain,
                'chain_length': len(blockchain.chain),
                'valid': blockchain.is_chain_valid()}
api.add_resource(GetFullChain, '/get_chain')

class CheckValidity(Resource):
    def get(self):
        is_valid = blockchain.is_chain_valid(blockchain.chain)
        return {'valid': is_valid}
api.add_resource(CheckValidity, '/is_valid')

# replace the chain with the longest chain if current chain is shorter!
class ReplaceChain(Resource):
    def get(self):
        is_chain_replaced = blockchain.replace_chain()
        if is_chain_replaced:
            response = {'message': 'Current chain was replaced with a larger chain.',
                        'new_chain': blockchain.chain}
        else:
            response = {'message': 'No change required',
                        'actual_chain': blockchain.chain}
        return jsonify(response)
    
api.add_resource(ReplaceChain, '/replace_chain')

#>>>>>>>>>>>>>>>>>>>>>POST REQUESTS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


# add transaction to blockchain - donate to charity
class DonateToCharity(Resource):
    def post(self):
        blockchain.replace_if_invalid()
        request.get_json(force=True)
        parser = reqparse.RequestParser()
        parser.add_argument('sender', type=str)
        parser.add_argument('amount', type=float)
        args = parser.parse_args()
        
        sender = args['sender']
        amount= args['amount']
        
        blockchain.reason = 'Donation'
        blockchain.add_transaction(sender, 'Charity', amount)
        response = blockchain.mine(reason="Donation")
        return jsonify(response)
api.add_resource(DonateToCharity, '/donate')
        
# add transaction to blockchain - move to beneficiary
class MoveToBeneficiary(Resource):
    def post(self):
        blockchain.replace_if_invalid()
        request.get_json(force=True)
        parser = reqparse.RequestParser()
        parser.add_argument('beneficiary', type=str)
        parser.add_argument('amount', type=float)
        args = parser.parse_args()
        
        beneficiary = args['beneficiary']        
        amount = args['amount']
        
        blockchain.reason = 'Beneficiary'
        blockchain.add_transaction('Charity', beneficiary, amount)
        response = blockchain.mine(reason="Beneficiary")
            
        return jsonify(response)
api.add_resource(MoveToBeneficiary, '/move_to_beneficiary')

        
# >>>>>>>>>>>>>> Decentralise blockchain
    # connecting new nodes
@app.route('/connect_node', methods=['POST'])
def connect_node():
    json = request.get_json()
    nodes = json.get('nodes') # grabs the json file with the list of nodes
    if nodes is None:
        return "No node", 400
    for node in nodes:
        blockchain.add_node(node)
    response = {'message': 'All the nodes are now connected.',
                'total_nodes': list(blockchain.nodes)}
    return jsonify(response), 201
    

# Run the app - just copy-past from documentation 
app.run(host = '0.0.0.0', port = 5003)


# some notes:
# Get request - to get something
# Post - need to create something then send (post) it to the API
# Reason is: 'Donation' or 'Beneficiary'
