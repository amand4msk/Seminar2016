import re
import numpy as np 

class Message:
    

    message = ""
    spamwords = dict()
    tfIdfVector = None
    

    def __init__(self, id, message, time):
        self.message= message
        self.wordVector = dict()
        self.time = time
        self.id = id
        
   

            
            
            
            