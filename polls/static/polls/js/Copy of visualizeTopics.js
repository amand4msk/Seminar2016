




function visualizeTopic(links, numberOfDocument, posts)
{
    
	var nodes = {};
	
    var maxFontSize = 25;
    var minFontSize = 5; 
    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, group: link.group});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, group: link.group});
    });
    
    var color = d3.scale.category20();
    
    var div = document.getElementById("clouds")
   
    
    var width = div.offsetWidth,
    height = div.offsetHeight; 
    
    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance( function(d) {
        	
        	if (d.source.group == d.target.group)
        	{
        		return 6;
        	}
        	else
        	{
        		return 200;
        	}
        	
        })
        	
        .charge(-500)
        .on("tick", tick)
        .start();
    
    var svg = d3.select("#clouds").append("svg")
        .attr("width", width)
        .attr("height", height);
    
  /*  var link = svg.selectAll(".link")
        .data(force.links())
      .enter().append("line")
        .attr("class", "link");*/
    
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .call(force.drag);
    

    
    node.append("circle")
        .attr("r", 20)
        .style("fill", function(d) { return color(d.group); });
    
    
    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; })
        .style("font-size", function(d) { return d.size; })
        .style("fill", function(d) { return color(d.group); });
    
    function tick() {
     /* link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });*/
    
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

}
