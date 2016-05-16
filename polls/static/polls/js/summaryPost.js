
function drawSummary(div, divId, obj)
{
	var nodes = obj["nodes"]
	var links =obj["links"]
	
	console.log(nodes)
	console.log(links)

	var div = d3.select("#summary").append("div")   
			 .attr("class", "tooltip")               
			  .style("opacity", 0);

	var width =  document.getElementById("summary").offsetWidth,
	    height = document.getElementById("summary").offsetHeight;

	var color = d3.scale.category20();

	 var force = d3.layout.force()
	        .nodes(d3.values(nodes))
	        .links(links)
	        .size([width, height])
	        .linkDistance( [60])    	
	        .charge(-600)
	        .on("tick", tick )
	        .start();
	    
	    var svg = d3.select("#summary").append("svg")
	        .attr("width", width)
	        .attr("height", height);
	    
	    var link = svg.selectAll(".link")
	        .data(force.links())
	        .enter().append("line")
	        .style("fill", "black")
	        .style("stroke-width", function(d) { return d.weight;})
	        .on("mouseover", function(d){ 
	        	
	        	 d3.select(this).select("line").transition()
				          .duration(750)
				          .style("stroke-width", 10);
	        	
	                        div.transition()     
				                 .delay(200) 
				                .duration(10)      
				                .style("opacity", .9);      
				            div .html(showInformation(d))  
				                .style("left", (d3.event.pageX) + "px")     
				                .style("top", (d3.event.pageY - 28) + "px");    
				            })
	          .on("mouseout", function(d) {       
			            div.transition()        
			                .duration(500)      
			                .style("opacity", 0);   
			       })
	        .attr("class", "link");
	    
	    var node = svg.selectAll(".node")
	        .data(force.nodes())
	        .enter().append("g")
	        .attr("class", "node")
	        .on("mouseover", mouseover)    
	        .on("mouseout", mouseout)
	        .call(force.drag);
	    

	    
	    node.append("circle")
	        .attr("r", 8)
	        .style("fill", "red");
	    
	    
	    node.append("text")
	        .attr("x", 12)
	        .attr("dy", ".35em")
	        .text(function(d) { return d.name; })
	        .style("font-size", function(d) { return d.size; })
	        .style("fill", "red");
	    
	    function tick() {
	      link
	          .attr("x1", function(d) { 
	        	  return d.source.x; })
	          .attr("y1", function(d) { return d.source.y; })
	          .attr("x2", function(d) { return d.target.x; })
	          .attr("y2", function(d) { return d.target.y; });
	    	
	      node
	          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	    }
	    
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
	    
	    	function showInformation(d)
			{
	            console.log(d)
	            var text = d.source.name + " & " + d.target.name;
	            var messages =d.messages;
	            
	            for(var i = 0; i < messages.length; i++)
	                {
	                 text = text + messages[i] +"<br><br>"   
	                }
				
			
				return text;
			}	



}