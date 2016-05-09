

function drawPointCloud(posts, tagIdSvg, textbox, maxPost)
{
	
/*
	var width = 960,
	    height = 500;

	var fill = d3.scale.category10();

	var nodes = d3.range(1300).map(function(i) {
	  return {index: i};
	});
	
	d3.layout.pack()
    	.sort(null)
    	.size([width, height])
    	.children(function(d) { return d.values; })
    	.value(function(d) { return d.radius * d.radius; })
    	.nodes({values: d3.nest()
    		.key(function(d) { return d.cluster; })
    		.entries(nodes)});


	var force = d3.layout.force()
	   .nodes(nodes)
	    .size([width, height])
	    .gravity(.02)
	    .charge(0)
	    .on("tick", tick)
	    .start();

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var node = svg.selectAll(".node")
	    .data(nodes)
	  .enter().append("circle")
	    .attr("class", "node")
	    .attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; })
	    .attr("r", 8)
	    .style("fill", function(d, i) { return fill(i & 2); })
	    .style("stroke", function(d, i) { return d3.rgb(fill(i & 2)).darker(2); })
	    .call(force.drag)
	    .on("mousedown", function() { d3.event.stopPropagation(); });

	svg.style("opacity", 1e-6)
	  .transition()
	    .duration(1000)
	    .style("opacity", 1);

	d3.select("body")
	    .on("mousedown", mousedown);

	function tick(e) {

	  // Push different nodes in different directions for clustering.
	  var k = 6 * e.alpha;
	  nodes.forEach(function(o, i) {
	    o.y += i & 2 ? k : -k;
	    o.x += i & 2 ? k : -k;
	  });

	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}

	function mousedown() {
	  nodes.forEach(function(o, i) {
	    o.x += (Math.random() - .5) * 40;
	    o.y += (Math.random() - .5) * 40;
	  });
	  force.resume();
	}


	*/
	
		var width = document.getElementById("drawing").offsetWidth,
		    height = 600
		    padding = 10,
		    min_padding = 0,
		    max_padding = 50,
		    minRadius=1;
		    maxRadius = 10,
		    n =posts.length;
		   

		  var   height = 550,
		    padding = 1.5, // separation between same-color nodes
		    clusterPadding = 60, // separation between different-color nodes
		    maxRadius = 7;

		var n = posts.length+Math.floor(posts.length/2), // total number of nodes
		    m = 2; // number of distinct clusters
		
		
		// The largest node for each cluster.
		var clusters = new Array(m);

		var nodes = [];
		for (var i = 0; i < posts.length; i++){
			
			var j = 0;
				
		      var r = Math.floor((Math.random() * maxRadius) + minRadius);
		      var d = {cluster: j,
		    		  radius: r,
		    		  x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
		    	       y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()};
			  clusters[j] = d;
			  nodes.push(d);
		}
		
			for (var i = 0;  i < Math.round(posts.length/2); i++){
			
					var j = 1;
					
			      var r = Math.floor((Math.random() * maxRadius) + minRadius);
			      var d = {cluster: j,
			    		  radius: r,
			    		  x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
			    	       y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
			    		  };
				  clusters[j] = d;
				  nodes.push(d);
			}

		console.log(nodes);
	var color = d3.scale.category10()
	    .domain(d3.range(m));

var links = [
             {"source": 1, "target": 0, "value": 1},
             {"source": 2, "target": 0, "value": 8},
             {"source": 3, "target": 0, "value": 10},
             {"source": 3, "target": 2, "value": 6},
             {"source": 4, "target": 0, "value": 1},
             {"source": 5, "target": 0, "value": 1}
               ];

		d3.layout.pack()
	    .sort(null)
	    .size([width, height])
	    .children(function(d) { return d.values; })
	    .value(function(d) { return d.radius * d.radius; })
	    .nodes({values: d3.nest()
	      .key(function(d) { return d.cluster; })
	      .entries(nodes)});

	

	var svg = d3.select("#pointCloud").append("svg")
	    .attr("width", width)
	    .attr("height", height);


	var force = d3.layout.force()
			.nodes(nodes)
			.size([width, height])
			.gravity(.02)
			.charge(0)
			.on("tick", tick)
			.start();

	var node = svg.selectAll("circle")
	    .data(nodes)
	  .enter().append("circle")
	    .style("fill", function(d) { return color(d.cluster); })
	    .call(force.drag);

	node.transition()
	    .duration(750)
	    .delay(function(d, i) { return i * 5; })
	    .attrTween("r", function(d) {
	      var i = d3.interpolate(0, d.radius);
	      return function(t) { return d.radius = i(t); };
	    });

	function tick(e) {
	  node
	      .each(cluster(10 * e.alpha * e.alpha))
	      .each(collide(.5))
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}

	// Move d to be adjacent to the cluster node.
	function cluster(alpha) {
	  return function(d) {
	    var cluster = clusters[d.cluster];
	    if (cluster === d) return;
	    var x = d.x - cluster.x,
	        y = d.y - cluster.y,
	        l = Math.sqrt(x * x + y * y),
	        r = d.radius + cluster.radius;
	    if (l != r) {
	      l = (l - r) / l * alpha;
	      d.x -= x *= l;
	      d.y -= y *= l;
	      cluster.x += x;
	      cluster.y += y;
	    }
	  };
	}

	// Resolves collisions between d and all other circles.
	function collide(alpha) {
	  var quadtree = d3.geom.quadtree(nodes);
	  return function(d) {
	    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
	        nx1 = d.x - r,
	        nx2 = d.x + r,
	        ny1 = d.y - r,
	        ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== d)) {
	        var x = d.x - quad.point.x,
	            y = d.y - quad.point.y,
	            l = Math.sqrt(x * x + y * y),
	            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
	        if (l < r) {
	          l = (l - r) / l * alpha;
	          d.x -= x *= l;
	          d.y -= y *= l;
	          quad.point.x += x;
	          quad.point.y += y;
	        }
	      }
	      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	    });
	  };
	}

		
		/*
				.on("click", function(d,i)
						{
				          $.blockUI({
				        message: posts[i]['text'],
				        css: { 
				            border: 'none', 
				            padding: '15px', 
				            height: 'auto',
				            width: '500px',
				            backgroundColor: '#000', 
				            '-webkit-border-radius': '10px', 
				            '-moz-border-radius': '10px', 
				            opacity: .5, 
				            color: '#fff' 
				        }
				          }); 
				          $('.blockOverlay').attr('title','Click to unblock').click($.unblockUI);
						})
		        .on("mouseover", function(d,i) {      
		        	textbox.innerHTML=posts[i]['text']; 
					            })    
		         .on("mouseout", function(d) {       
					            textbox.innerHTML=""; 
					       });
		       */
		


}