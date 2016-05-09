

 function drawMatrix(div, miserables, min, max )
 {	
	 var rangeX = 0;
	 var rangeY = 100; 
		 var colors = 
		     [  
		         d3.rgb(255,204,204),
		         d3.rgb(255,153,153),
		         d3.rgb(255, 102,102),
		         d3.rgb(255,51,51),
		         d3.rgb(255,0,0),
		         d3.rgb(230,0,0),
		         d3.rgb(204,0,0),
		         d3.rgb(153,0,0),
		         d3.rgb(102,0,0),
		         d3.rgb(90,0,0),
		         d3.rgb(90,0,0),
		         d3.rgb(0,0,0)
		         
		         ];
		     
		 function getColor(i, color)
		 {
			 
			 
		     var c = d3.rgb(255,0,0); 
		     var j = 0;
		     i = (i - min)/(max-min)
	         i = i*(rangeY-rangeX)+rangeX
		     var idx = Math.floor(i/10); 

		    
		     console.log(idx);
		      c = colors[idx];
					
					return c;
		 }
				
	
		var margin = {top: 150, right: 100, bottom: 10, left: 200},
		     width = 500,
		    height = 500;
		
		var documentWidth = document.getElementById("occurence").offsetWidth;
		
		
		var divTooplTip = d3.select(div).append("div")   
        			.attr("class", "tooltip")               
        			.style("opacity", 0);
		
		var x = d3.scale.ordinal().rangeBands([0, width]),
		 z = d3.scale.linear().domain([0, 4]).clamp(true),
		 c = d3.scale.category10().domain(d3.range(10));
		
		var svg = d3.select(div).append("svg")
		 			.attr("width", documentWidth)
					 .attr("height", height + margin.top + margin.bottom)

		.append("g")
		 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		//d3.json("foo.json", function(miserables) {
		var matrix = [],
		   nodes = miserables.nodes,
		   n = nodes.length;
		
		// Compute index per node.
		nodes.forEach(function(node, i) {
		 node.index = i;
		 node.count = 0;
		 matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
		});
		
		// Convert links to matrix; count character occurrences.
		miserables.links.forEach(function(link) {
		 matrix[link.source][link.target].z += link.value;
		 matrix[link.target][link.source].z += link.value;
		 matrix[link.source][link.source].z += link.value;
		 matrix[link.target][link.target].z += link.value;
		 nodes[link.source].count += link.value;
		 nodes[link.target].count += link.value;
		});
		
		     
		//alert("matrix = "+  ) 
		
		// Precompute the orders.
		var orders = {
		 name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
		 count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
		 group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
		};
		
		// The default sort order.
		x.domain(orders.name);
		
		svg.append("rect")
		   .attr("class", "background")
		   .attr("width", width)
		   .attr("height", height)
		   .style("margin", 200)
		   .style("fill", "beige")
		   
		
		   
		var row = svg.selectAll(".row")
		   .data(matrix)
		   .enter().append("g")
		   .attr("class", "row")
		   .attr("transform", function(d, i) {  return "translate(0," + x(i) + ")"; })
		   .each(row);
		
		row.append("line")
		   .attr("x2", width);
		
		row.append("text")
		   .attr("x", -6)
		   .attr("y", x.rangeBand() / 5)
		   .attr("dy", ".32em")
		   .attr("text-anchor", "end")
		   .style("font", "20px 'Helvetica Neue'")
		   .text(function(d, i) { return nodes[i].name; });
		
		var column = svg.selectAll(".column")
		   .data(matrix)
		   .enter().append("g")
		   .attr("class", "column")
		   .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
		
		column.append("line")
		   .attr("x1", -width);
		
		column.append("text")
		   .attr("x", 6)
		   .attr("y", x.rangeBand() / 5)
		   .attr("dy", ".32em")
		   .attr("text-anchor", "start")
		   .text(function(d, i) { return nodes[i].name; });
		
		function row(row) {
		 var cell = d3.select(this).selectAll(".cell")
		     .data(row.filter(function(d) { return d.z; }))
		     .enter().append("rect")
		     .attr("class", "cell")
		     .attr("x", function(d) { return x(d.x); })
		     .attr("width", x.rangeBand())
		     .attr("height", x.rangeBand())
		     .style("fill-opacity", function(d) { return z(d.z); })
		     .style("fill", function(d,i) {
		    	 if (d.x==d.y)
		    		 {
		    		 	return d3.rgb(0,0,0);
		    		
		    		 }
		    	 else
		    		 {
		    		 return getColor(d.z, d3.rgb(0,0,0));
		    		 }
		    	  })
		      .on("mouseover", mouseover)
		        .on("mouseout", mouseout)

		  }

		  function mouseover(p) {

			  if(p.x==p.y)
				  {
				  return ""; 
				  }
			  
			 divTooplTip.transition()     
	            .delay(1000) 
	            .duration(10)      
                .style("opacity", .9);      
			 divTooplTip.html(miserables.nodes[p.y]['name'] + ' & ' + miserables.nodes[p.x]['name'] + "<br>" + p.z)  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");  
		    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
		    d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
		  }

		  function mouseout() {

			  divTooplTip.transition()        
              .duration(500)      
              .style("opacity", 0);  
		    d3.selectAll("text").classed("active", false);
		  }





 
 }
    


