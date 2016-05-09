from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import scipy


class Cluster:

    messages = []
    centroid = None 
   

    def __init__(self, centroid, message):
       
        self.centroid = centroid

        self.messages = []
        self.messages.append(message)
        self.values = np.array(message.tfIdfVector)
        
        
    def addMessage(self,message):
        self.messages.append(message)
        self.values = np.vstack([self.values, message.tfIdfVector])
        self.calculateCentroid()
        
    def calculateCentroid(self):
        self.centroid = np.average(self.values, axis=0)
        
    def simClusterMessage(self, vector):
        dist =  cosine_similarity([vector], [self.centroid])
        if dist[0][0] > 0.4:
            return dist
        else:
            return 0
        
            
        