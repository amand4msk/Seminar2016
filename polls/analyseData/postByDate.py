import operator
import json 
import datetime

def getPost(file, sm, minYear):
    file = "DATA/" + file; 
    json_data=open(file).read()
    
    now = datetime.datetime.now()
    yearNow = now.year
    rangeYear = yearNow-minYear+1
    
    data = json.loads(json_data)
    values = data["values"]
    words = dict();
            
    messagesText = []
    postIds = []
    dates = []
    posts = []
            
    years = dict() 
    
    for i in range(0, rangeYear):
        years[yearNow-i]= dict()       
    
 
    for value in values:
        date = value[2].split(" ")[0]
        d = date.split("-")
        year = int(d[0])
        month = int(d[1])
        
        if year in years:
            if month in years[year]:
                years[year][month]= years[year][month]+1
            else:
                years[year][month] = 1
      
    
    listYears = []
    for year in years:
        listYears.append(year)
        for i in range(1,13):
            if i not in years[year]:
                years[year][i] = 0
       
    listYears.sort(reverse=True)         
    X=[]
    for year in listYears:
        Y = dict()
        Y["rating"]=years[year]
        Y["name"]= sm + " " + str(year)
        X.append(Y)

     
    return X
  

socialMedia=["Facebook", "Twitter"]
file = "barackobama.json"
arr = []
minYear = 2011
for sm in socialMedia:
    X = getPost(file, sm, minYear)
    arr.append(X)
 
merge = []   
for i in range(0, len(arr[0])):
    for j in range(0, len(socialMedia)):
        merge.append(arr[j][i])
        
with open('data.json', 'w') as outfile:
    json.dump(merge, outfile)
    
    
    
    
    
    