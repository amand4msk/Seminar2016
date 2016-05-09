 function cloud(id, frequentWords, idParent, numberOfDocument, posts)
    {
    	var nrDocs = numberOfDocument;
    	var formatTime = d3.time.format("%e %B");
    	
    	
    	
    	function getColor(i, color)
		{
			var j = 0;
			while (j < i)
			{
				color = d3.rgb(color).brighter(1);
				j = j+1;
			}
			
			return color;
		}
		
		function showInformation(word)
		{
			var text = 'Documents in this topic: ' + nrDocs;
			text = text + '<br>';
			text = text + 'Other words for this topics: <br><br>';
			
			for(var i = 5; i < frequentWords.length; i++)
			{
				text = text + frequentWords[i]["text"] + ' ';
				if ((i-5+1)%4 == 0){
					text = text + '<br>';
				}
			}
			return text;
		}
		

		

		function openPostsWindow()
		{
			var iDiv = document.getElementById("clouds");
			iDiv.style.display = 'none';           // Hide
			
			var backButton = document.getElementById("backButton");
			backButton.style.display = 'block';
			
			var backButton = document.getElementById("getClouds");
			backButton.style.display = 'none';
			
			var divPosts = document.getElementById("posts");
			divPosts.style.display ='block';
			
			for(var i = 0; i < posts.length; i++)
			{
				if(posts[i]["value"]!='')
				{
					var d = document.createElement("div");
					
					d.innerHTML = posts[i]["date"] + "<br>" + posts[i]["value"];
					d.style.color = "white";
					d.style.marginTop = "10pt";
					d.style.marginLeft = "10pt";
					d.style.fontSize = "15pt";
					divPosts.appendChild(d);
				}
				
				
				
			} 
		}
		
		
		
function draw(words) {
		 var iDiv = document.createElement('div');
	    		iDiv.id = t;
	    		iDiv.style.display = "inline-block";
				 iDiv.style.height = layout.size()[1];
   				 iDiv.style.width = layout.size()[0];
	    		
	    		document.getElementById('clouds').appendChild(iDiv);	
			
			
		
		  d3.select('#clouds').append("svg")
		  		 
		      .attr("width", layout.size()[0])
		      .attr("height", layout.size()[1])
		      .attr("margin", function(d) { return Math.floor((Math.random() * 50) + 1) + "px";})
		       .append("g")
		      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
		      .selectAll("text")
		      .data(words)
		      .enter().append("text")
		      .style("font-size", function(d) { return d.size + "px"; })
		      .style("font-family", "Impact")
		      .style("fill", function(d, i) { return getColor(i,colourValue); })
		      .attr("text-anchor", "middle")
		      .attr("transform", function(d) {
		        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		      })
		      .on("mouseover", function(d) {      
			            div.transition()     
			                 .delay(1000) 
			                .duration(10)      
			                .style("opacity", .9);      
			            div .html(showInformation())  
			                .style("left", (d3.event.pageX) + "px")     
			                .style("top", (d3.event.pageY - 28) + "px");    
			            })    
			    .on("mouseout", function(d) {       
			            div.transition()        
			                .duration(500)      
			                .style("opacity", 0);   
			       })
			     .on("click", function(d) {
			     	  openPostsWindow();
			     })
			 
		      .text(function(d) { return d.text; });
		      	    
		}
	
	
			var div = d3.select("clouds").append("div")   
			
		              .attr("class", "tooltip")               
		              .style("opacity", 0);
			
		
	
    		var frequency_list = frequentWords.slice(0,5);
			var colourValue = colors[id];	
				
				var t=  "cell" + id;
				var layout =  d3.layout.cloud()
				    .size([300, 300])
				    .words(frequency_list)
				    .padding(5)
				    .rotate(function() { return 0; })
				    .font("Impact")
				    .fontSize(function(d) { return d.size; })
				    .on("end", draw);
				    layout.start();
	    }
	    