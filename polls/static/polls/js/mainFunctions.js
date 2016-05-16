
function getDataForPerson()
{
    		var buttonWordCloud = document.getElementById("getClouds");
		selectedPerson = document.getElementById("selectPerson").value;
		if(selectedPerson < names.length)
		{
			 var selectedPersonText = document.getElementById('selectPerson').options[document.getElementById('selectPerson').selectedIndex].text;
			
			var file=files[selectedPerson];
			
			 var post={
    	 		filename : file
    		 };
    		 
    		 
    		

			var div = createDiv("textbox");
						div.class = "SHOW_TEXT";
						div.innerHTML = selectedPersonText;
						div.style.marginTop ="10px";
						div.style.marginLeft="60px";


			$.post('/polls/postsByDate/', post, function(response){

				var obj = JSON.parse(response);
				console.log(obj);
				
				
			    
			    var div = createDiv('postTimeline');
			    div.style.width = "70%";
			    div.style.height = "80vh";
			    
			    
			    div.style.marginRight ="20px";
			     div.style.display = "inline-block";
			     
			    
				var div = createDiv('container');
					div.id ="box2";
					div.style.display="inline-block";
					div.style.width = "29%";
					
			     
			    var text = document.createElement("div");
			 			text.id = "scrollableTextbox";
			 			text.style.marginTop = "50px";
			 			text.style.height ="70vh";
			 			div.appendChild(text);
			 			
			 	
			 			
			   			text.innerHTML ="This graphic shows how much " +
			   			                 selectedPersonText + " posted in the differenct social networks "
			   			                 + " in the different years and months"
			   			                 + " <br> If you click on one of the points you can see the posts made in this "
			   			                 + "month";

				showPostTimeline(obj, "#postTimeline", "scrollableTextbox");
			});
		}	
		else
		{
			buttonWordCloud.disabled=true; 
		}
}

function getSummary()
{
    var div = createDiv('summary');
        div.style.width="100%";
        div.style.height="100vh";
      
        var socialMediaInp = document.getElementById('selectSocialMedia');
        console.log(socialMediaInp);
        var socialMedia = socialMediaInp.options[document.getElementById('selectSocialMedia').selectedIndex].text;
        
        var socialMediaArr = new Array;
        
        
        if (socialMedia == "both")
        {
        	socialMediaArr[0] = 'facebook';
        	socialMediaArr[1] ='twitter';
        }
        else
        {
        	socialMediaArr[0] = socialMedia;
        }
        
      
	
		var radioValue = "";
		var radios = document.getElementsByName('date');

			for (var i = 0, length = radios.length; i < length; i++) {
			    if (radios[i].checked) {
			        // do whatever you want with the checked radio
			        radioValue = radios[i].value;
			
			        // only one radio can be logically checked, don't check the rest
			        break;
			    }
			}
			
		
		var timeRange= 0;
		var value = '';	
		console.log(radioValue);
		if (radioValue == "range")
		{
			timeRange = 1;
			var inp = document.getElementById("timeRange");
    	    var value = inp.value; 
		}
		else
		{
			var yearInp = document.getElementById("selectYear");
			var monthInp = document.getElementById("selectMonth");
			var year = yearInp.options[document.getElementById('selectYear').selectedIndex].text;
			var month = monthInp.value;
			value = year + "-" + month;
		}
		
		console.log("date: " + value);
		var inp = document.getElementById("numberOfWords");
		console.log(inp.value);
		
		 var file=files[selectedPerson];
    	 var post={
    	 				filename : file,
    	 				timerange: timeRange,
    	 				value: value,
    	 				numberWords : inp.value,
    	 				socialMedia : socialMediaArr
    	 				
    	 };
    	 console.log(post)
    	  
    	  
    	 $.post('/polls/getPostSummary/', post, function(response){
         	var run = false;
       		var obj = JSON.parse(response);
       		console.log(obj);
       		drawSummary(div, "#summary", obj);
       		
      });
}

function getTopicModels()
{
     	var inp = document.getElementById("numberOfTopics");
    	 var topics = inp.value; 
    	 var file=files[selectedPerson];

    	 var post={
    	 				numberOfTopics: topics,
    	 				filename : file
    	 };

            	
    	$.blockUI({ 
    		 message: '<h1>Please wait a moment while the topics are calculated...</h1>',
    		 css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        }
			}); 
 
    	$(document).ajaxStop($.unblockUI); 
    	
    	
    	$.post('/polls/wordCloud/', post, function(response){

				var objArr = JSON.parse(response);
				console.log(objArr);
				
				var obj = objArr["topicsDescription"];
				
	            var parentId = 0;
	       					    
			    var div = createDiv('clouds');
			    div.style.width = "70%";
				div.style.height = "900px";
			      div.style.marginRight ="20px";
			      div.style.marginTop ="-20px";
			     div.style.display = "inline-block";

	       	  visualizeTopic(objArr,objArr["nodes"], obj, obj);
	       	  // cloud("clouds", obj[0]["words"], 100, obj[0]["posts"]);
			     
			    
			 
			     
			     var selectedPersonText = document.getElementById('selectPerson').options[document.getElementById('selectPerson').selectedIndex].text;
				var div = createDiv('container');
					div.id ="box2";
					div.style.display="inline-block";
					div.style.width = "29%";
					
			     
			    var text = document.createElement("div");
			 			text.id = "scrollableTextbox";
			 			text.style.marginTop = "50px";
			 			text.style.height ="100vh";
			 			div.appendChild(text);
			 			
			 	
			 			
			   			text.innerHTML ="This graphic shows how much " +
			   			                 selectedPersonText + " posted in the differenct social networks "
			   			                 + " in the different years and months"
			   			                 + " <br> If you click on one of the points you can see the posts made in this "
			   			                 + "month";

				//showPostTimeline(obj, "#postTimeline", "scrollableTextbox");
				
				

			   
			  	
				
			});
}


function getImpact()
{
	 var div = createDiv('summary');
    
     div.style.height="100vh";
     div.className = "chart";

     
	var file=files[selectedPerson];

	 var post={
	 				filename : file
	 };

	 $.post('/polls/compareImpact/', post, function(response){
		 console.log(response);
    		var obj = JSON.parse(response);
    		console.log(obj);
    		drawImpact("summary", obj);
    		
   });
	 
}


