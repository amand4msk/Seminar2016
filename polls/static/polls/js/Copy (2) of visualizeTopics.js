




function visualizeTopic(links, numberOfDocument, posts)
{
    
	var json = {
			 "name": "flare",
			 "children": [
			  {
			   "name": "analytics",
			   "children": [
			    {
			     "name": "cluster",
			     "children": [
			      {"name": "AgglomerativeCluster", "size": 3938},
			      {"name": "CommunityStructure", "size": 3812},
			      {"name": "MergeEdge", "size": 743}
			     ]
			    },
			    {
			     "name": "graph",
			     "children": [
			      {"name": "BetweennessCentrality", "size": 3534},
			      {"name": "LinkDistance", "size": 5731}
			     ]
			    }
			   ]
			  }
			 ]
			};

			var r = 960,
			    format = d3.format(",d"),
			    fill = d3.scale.category20c();

			var bubble = d3.layout.pack()
			    .sort(null)
			    .size([r, r])
			    .padding(1.5);

			var vis = d3.select("#clouds").append("svg")
			    .attr("width", r)
			    .attr("height", r)
			    .attr("class", "bubble");


			  var node = vis.selectAll("g.node")
			      .data(bubble.nodes(classes(json))
			      .filter(function(d) { return !d.children; }))
			    .enter().append("g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			  node.append("title")
			      .text(function(d) { return d.className + ": " + format(d.value); });

			  node.append("circle")
			      .attr("r", function(d) { return d.r; })
			      .style("fill", function(d) { return fill(d.packageName); });


				  
			  node.append("text")
			  	   .attr("x", 10)
				   .attr("y",-20)
				   .attr("dy", ".35em")
			       .attr("text-anchor","middle")
			       .text("Maria             Maria")
			       .style("fill", "white")
			       .style("font-size", function(d) { return 15;});
			  
			  node.append("text")
			       .attr("x",10)			  
				   .attr("y", 0)
			   	  .attr("dy",".35em")	
			   	  .attr("text-anchor","middle")
			      .text("Maria 3")
			      .style("color", "white")
			      .style("font-size", function(d) { return 15;});
			  
			  node.append("text")
			      .attr("x",10)
			   	  .attr("text-anchor","middle")
				  .attr("y", 20)
				  .attr("dy",".35em")		     	
			      .text("Maria 2")
			      .style("color", "white")
			      .style("font-size", function(d) { return 15;});
			  


			// Returns a flattened hierarchy containing all leaf nodes under the root.
			function classes(root) {
			  var classes = [];

			  function recurse(name, node) {
			    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
			    else classes.push({packageName: name, className: node.name, value: node.size});
			  }

			  recurse(null, root);
			  return {children: classes};
			}

}
