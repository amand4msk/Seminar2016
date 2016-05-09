
function showPostTimeline(obj, div, textbox)
{

		var likertData = obj; 
    
    console.log(likertData);
    
    // call the chart
   // d3Likert('#display-likert-chart', likertData, {height: 740, width: $('#chart-element-id').width() });
    
     var d3PrePropData = [];   
    
    var dataObject = likertData;

    var height =  document.getElementById("drawing").offsetHeight,
        width =  document.getElementById("postTimeline").offsetWidth,
        margin = {left: 0, right: 0, top: 0, bottom: 0};

    
    var svg = d3.select('#postTimeline')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

                    
    var x = d3.scale.linear()
                .range([-150, (width - 430)]);

    var xScale = d3.scale.linear()
        .domain([1, 13])
        .range([230, width+10]);

    
    var dataset = [
                   {"keyword": "Jan"},
                   {"keyword": "Feb" },
                   {"keyword": "Mar"},
                   {"keyword": "Apr"},
                   {"keyword": "Mai"},
                   {"keyword": "Jun"},
                   {"keyword": "Jul"},
                   {"keyword": "Aug"},
                   {"keyword": "Sep"},
                   {"keyword": "Oct"},
                   {"keyword": "Nov"},
                   {"keyword": "Dec"}
               ];
    
 
    var xAxis = d3.svg.axis()
        .scale(x)
       .tickFormat(function(d,i) { return dataset[i].keyword; })
       .orient("top");
     
        

   /* var ratingFormat = d3.format("<");
    xAxis.tickFormat(ratingFormat);*/

    x.domain([1, 12]);

    // add x-axis
    svg.append("g")
        .attr("class", "x axis")   
        .attr("transform", "translate(386," + 60 + ")")
        .style("font", "20px 'Helvetica Neue'")
        .style("fill", "white")  
        .call(xAxis);


    // 
    // get the min/max number of votes across all ratings
    // => necessary to keep the scales the same for each factor
    var totalMaxRatings = [];
    var totalMinRatings = [];
    var arr = [];

    $.each(dataObject, function(index, data){

        arr = d3.entries(data.rating);
        var maxValue = d3.max(arr, function(d) { return +d.value; });
        var minValue = d3.min(arr, function(d) { return +d.value; });
        
        totalMaxRatings.push(maxValue);
        totalMinRatings.push(minValue);

    });

    maxValue = d3.max(totalMaxRatings, function(d){return +d});
    minValue = d3.min(totalMinRatings, function(d){return +d});
    

    // set up radius scales
    var rScale = d3.scale.linear()
        .domain([minValue, maxValue])
        .range([2, 20]);
    
    // set up the tooltip for mouseovers
    var div = d3.select(div).append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);


    // Add each rating row
    $.each(dataObject, function(index, data){
        
        var ratingArr = d3.entries(data.rating);

        // get the max number of votes within this ranking
        var rangeMaxValue = d3.max(ratingArr, function(d) { return +d.value; });

        var g = svg.append('g');
                    
        // used for setting a bg on the hover event
        var rect = g.selectAll('rect')
                    .data(ratingArr)
                    .enter()
                    .append('rect')
                    .attr('width', width)
                    .attr('height', 40)
                    .attr("x", 0)
                    .attr("y", (index * 40) + 80)
                    .style('fill', 'none');

        
        var circles = g.selectAll('circle')
            .data(ratingArr)
            .enter()
            .append('circle')
                .attr("cx", function(d, i) {  return xScale(d.key); })
                .attr("cy", (index * 40) + 100)
                .attr("r", function(d) { return rScale(d.value); })
                .attr("title", function(d){return d.value; })
                .style("fill", function(d) { 
                    // if this is the highest rated value,
                    // give it a different colour
                    if(d.value == rangeMaxValue){
                        return 'rgb(252, 187, 161)';
                    }else{
                        return "#ccc";
                    }    
                })
              .on("click", function(d,i)
	            {
	                 click(obj[index]["message"][i+1]);  
	            })
            .on("mouseover", function(d) { 
                div.transition()  
                	.delay(1000) 
                    .duration(200)      
                    .style("opacity", .9);      
                div .html(dataset[d.key-1].keyword +": "   + d.value + " posts")  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");    

            })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });


        // Add the actual values as text below the 
        // circles => used for display on label mouseover
        var text = g.selectAll("text")
            .data(ratingArr)
            .enter()
            .append("text");

        text
            .attr("y", (index * 40) + 105)
            .attr("x",function(d, i) { return xScale(d.key) - 12; })
            .attr("class","value")
            .style('fill', 'red')
            .text(function(d){ return d.value; })
            .style("display","none");

        // Y-axis labels (contain html)
        g.append("foreignObject")
            .attr("y", (index * 40) + 90)
            .attr("x", 20)
            .attr("class","chart-label")
            .attr("width", 150)
            .attr("height", 40)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .append("xhtml:body")
            .style("font", "20px 'Helvetica Neue'")
            .style("line-height", "40px")
            .style("fill", "red")
            .style("background", "transparent")
            .html('<i class="glyphicon glyphicon-info-sign">&nbsp;</i>' + data.name );

        
    });


    function mouseover(p) {
        var g = d3.select(this).node().parentNode;
        d3.select(g).style('cursor', "pointer");
        d3.select(g).selectAll('rect').attr('class', 'hover');
        d3.select(g).selectAll("circle").style("display","none");
        d3.select(g).selectAll("text.value").style("display","block");
    }

    function mouseout(p) {
        var g = d3.select(this).node().parentNode;
        
        d3.select(g).style('cursor', "normal");
        d3.select(g).selectAll('rect').attr('class', 'no-hover');
        d3.select(g).selectAll("circle").style("display","block");
        d3.select(g).selectAll("text.value").style("display","none");
    }
    
    function click(messages)
    {
    	
    	var text = document.getElementById("scrollableTextbox");
    		
    	var value = "";
    	var idx = 1;
    	for(var i = 0; i < messages.length; i++)
    		{
    			if(messages[i]!="")
    			{
    				value = value + "(" + idx +  ")" +  messages[i] + "<br><br>"; 
    				idx = idx +1;
    			}
    			
    		}
    	
    		text.innerHTML = value; 

    		
    }
}
    