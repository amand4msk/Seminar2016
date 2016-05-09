import json
import os

file_directory ="twitter"

for file in os.listdir(file_directory):
    print(file)
    if file.endswith(".json"):
        json_data=open(file_directory + "/" + file).read()
        data = json.loads(json_data)
    
        dic = dict()
        dic["title"]="posts"
        dic["fields"]= ["id", "message", "published", "idPost", "person_id"]
        dic["type"]=["integer","text","unknown","text","integer"]
        dic["values"]=[]
        
        #[id, "text, "data", "postID", "personID"
        for p in data:
            post = []
            post.append(p["pk"])
            post.append(p["fields"]["message"])
            post.append(p["fields"]["published"])
            post.append(p["fields"]["idPost"])
            post.append(p["fields"]["person"])
            dic["values"].append(post)
            
        with open("twitter_new/" + file, 'w') as outfile:
            json.dump(dic, outfile)
    