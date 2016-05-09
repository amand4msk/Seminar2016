class Person:
    
    self.messages = []
    
    def __init__(self, name):
        self.name = name
        
    def addMessage(self, message):
        self.messages.append(message)