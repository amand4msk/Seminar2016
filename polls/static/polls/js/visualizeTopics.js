




function visualizeTopic(links, numberOfDocument, posts)
{
	var color = d3.scale.category20();
	console.log(links);
	var data = links;
	
	
	var div = d3.select("#clouds").append("div")   
				.attr("class", "tooltip")               
				.style("opacity", 0);
	
		var diameter = 960,
		    format = d3.format(",d");
		
		var pack = d3.layout.pack()
		    .size([diameter - 4, diameter - 4])
		    .value(function(d) { return d.size; });
		
		var svg = d3.select("#clouds").append("svg")
		         .attr("width", diameter)
		         .attr("height", diameter)
		         .append("g")
		         .attr("transform", "translate(2,2)");
		
		var node = svg.datum(data).selectAll(".node")
		      .data(pack.nodes)
		      .enter().append("g")
		      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		
		//  node.append("title")
		  //    .text(function(d) { return showInformation(d); });
		    
		 node.on("click", function(d,i)
		        {
			 		console.log(d);
					 if (d.children)
				    	{
				    		messages = d.posts;
				    		nrDocs = d.numberOfDocus;
				    		
				    	}
				    	else
				        {
				    		messages = d.parent.posts;
				    		nrDocs = d.parent.numberOfDocus;
				    	}
			 
			 
		             click(messages);  
		        })

		
		  node.filter(function(d){ return d.parent; })
		      .append("circle")	      
		      .attr("r", function(d) { return d.r; })
		      .style("stroke", function(d) { return color(d.group); })
		      .style("fill", function(d) { return color(d.group); });
		
		  node.filter(function(d) { return !d.children; }).append("text")
		      .attr("dy", ".3em")
		      .style("text-anchor", "middle")
		      .style("font-size", function(d) { 
		    	  return d.size+10;})
		     .style("fill", "white")
		      .text(function(d) { return d.name.substring(0, d.r / 3); });
		
		
		d3.select(self.frameElement).style("height", diameter + "px");
		
		  
	    function mouseover() {
	      d3.select(this).select("circle").transition()
	          .duration(750)
	          .attr("r", 16);
	        
	      d3.select(this).select("text").transition()
	            .duration(750)
	            .style("font-size", 25);
	    }
	    
	    function mouseout() {
	      d3.select(this).select("circle").transition()
	          .duration(750)
	          .attr("r", 8);
	        
	        d3.select(this).select("text").transition()
	            .duration(750)
	            .style("font-size",function(d) { return d.size; });
	    }
	    
	    function click(messages)
	    {
	    	console.log(messages);
	    	var text = document.getElementById("scrollableTextbox");
	    		
	    	var value = "";
	    	var idx = 1;
	    	for(var i = 0; i < messages.length; i++)
	    		{
	    			if(messages[i]!="")
	    			{
	    				value = value   + "(" + idx +  ")" + messages[i]["date"] + "<br>";
	    				value = value +  messages[i]["value"] + "<br><br>"; 
	    				idx = idx +1;
	    			}
	    			
	    		}
	    	
	    		text.innerHTML = value; 

	    		
	    }
	    
	    function showInformation(d)
		{
	    	console.log(d);
	    	var words;
	    	
	    	if (d.children)
	    	{
	    		words = d.words;
	    		nrDocs = d.numberOfDocus;
	    		
	    	}
	    	else
	        {
	    		words = d.parent.words;
	    		nrDocs = d.parent.numberOfDocus;
	    	}
	    	
			var text = 'Documents in this topic: ' + nrDocs;
			text = text + '<br>';
			text = text + 'Other words for this topics: <br><br>';
			
			for(var i = 5; i < words.length; i++)
			{
				text = text + words[i]["text"] + ' ';
				if ((i-5+1)%4 == 0){
					text = text + '<br>';
				}
			}
			
			console.log(text);
			return text;
		}

}
