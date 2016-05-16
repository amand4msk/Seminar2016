

function drawImpact(divName, obj)
{
	var tweets = obj["sorted_tw"];
	var fb_posts = obj["sorted_fb"];
	
	var dates  = [];
	var tw_text = [];
	var fb_text = [];
	var twitter_likes = [];
	var facebook_likes = [];
	
	var ndates  = [];
	var ntw_text = [];
	var nfb_text = [];
	var ntwitter_likes = [];
	var nfacebook_likes = [];
	
	
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	var parseDate2 = d3.time.format("%b %d, %Y").parse;
	
	  
	  for (var i in tweets) 
	  {
	    formatDate = d3.time.format("%b %d, %Y");
	    dates.push(formatDate(parseDate(tweets[i].date)));
	    tw_text.push(tweets[i].text);
	    console.log(tweets[i].text);
	    fb_text.push(fb_posts[i].text);
	    twitter_likes.push(tweets[i].likes);
	    facebook_likes.push(fb_posts[i].likes);
	  }
	  
	  console.log(fb_text)
	  
	  for (var i=0; i<dates.length; i++) 
	  { 
	    formatDate = d3.time.format("%Y")
	    if (formatDate(parseDate2(dates[i])) == "2016")
	    {
	      ndates.push(dates[i])
	      ntw_text.push(tw_text[i]);
	      nfb_text.push(fb_text[i]);
	      ntwitter_likes.push(twitter_likes[i])
	      nfacebook_likes.push(facebook_likes[i])
	    }
	  }
	  

			var myDiv = document.getElementById("summary");

			//Create array of options to be added
			var array = ["2016","2015","2014","2013", "2012"];

			var selectList = document.createElement("select");
			
			selectList.id = "opts";
			selectList.onchange = function(){
				console.log("here")
				var new_twitter_likes = [];
			      var new_facebook_likes = [];
			      var new_dates  = [];
			      var new_tw_text = [];
			      var new_fb_text = [];

			      d3.selectAll("svg > *").remove();
			      var selected_year = d3.select(this).property('value');   
			           
			      for (var i=0; i<dates.length; i++) 
			      { 
			        formatDate = d3.time.format("%Y")
			        if (formatDate(parseDate2(dates[i])) == selected_year)
			        {
			          new_dates.push(dates[i])
			          new_tw_text.push(tw_text[i]);
			          new_fb_text.push(fb_text[i]);
			          new_twitter_likes.push(twitter_likes[i])
			          new_facebook_likes.push(facebook_likes[i])
			        }
			      }
			      update(new_dates,new_facebook_likes,new_twitter_likes, new_tw_text, new_fb_text);
			};
			
			myDiv.appendChild(selectList);

			//Create and append the options
			for (var i = 0; i < array.length; i++) {
			    var option = document.createElement("option");
			    option.value = array[i];
			    option.text = array[i];
			    selectList.appendChild(option);
			}
	  
		

	    
	  //initialize timeline (year 2016)
	  update(ndates,nfacebook_likes,ntwitter_likes,ntw_text,nfb_text);
	


	}



function update(dates,facebook_likes,twitter_likes,tw_text,fb_text)
{
	var width =  document.getElementById("summary").offsetWidth,
    height = document.getElementById("summary").offsetHeight;
	
	  data= {};
	  var data = {
	    labels: dates,
	    series: [
	      {
	        label: 'Facebook',
	        texts: fb_text,
	        values: facebook_likes
	      },
	      {
	        label: 'Twitter',
	        texts: tw_text,
	        values: twitter_likes
	      }]
	    };

	 
	  
	  var chartWidth       = 1000,
	      barHeight        = 20,
	      groupHeight      = barHeight * data.series.length,
	      gapBetweenGroups = 10,
	      spaceForLabels   = 150,
	      spaceForLegend   = 150;
	
	  // Zip the series data together (first values, second values, etc.)
	  var zippedData = [];
	  var text = [];
	
	  for (var i=0; i<data.labels.length; i++) {
	    for (var j=0; j<data.series.length; j++) {
	      zippedData.push(data.series[j].values[i]);
	      text.push(data.series[j].texts[i]);
	
	    }
	  }
	  

	  // Color scale
	  var color = d3.scale.category20();
	  var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;
	  
	  
	
	  var x = d3.scale.linear()
	      .domain([0, d3.max(zippedData)])
	      .range([0, chartWidth*20]);
	
	  var y = d3.scale.linear()
	      .range([chartHeight + gapBetweenGroups, 0]);
	
	  var yAxis = d3.svg.axis()
	      .scale(y)
	      .tickFormat('')
	      .tickSize(0)
	      .orient("left");
	
	  //Create tooltip on chart bars
	  var tip = d3.tip()
	    .attr('class', 'd3-tip')
	    //.offset([-10, 0])
	
	    .html(function(d,i) {
	      return text[i];
	    })

     var svg = d3.select("#summary").append("svg")
	        .attr("width", width)
	        .attr("height", height);
		  // Specify the chart area and dimensions
	var chart = svg.select(".chart")
		      .attr("width", spaceForLabels + chartWidth + spaceForLegend)
		      .attr("height", chartHeight);
		  
		 
		
		  chart.call(tip);
		  
		 
		
		  // Create bars
		  var bar = chart.selectAll("g")
		      .data(zippedData)
		      .enter().append("g")
		      .attr("transform", function(d, i) {
		        return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
		      });
		
		   
		      bar.append("rect")
		          .attr("fill", function(d,i) { return color(i % data.series.length); })
		          .attr("class", "bar")
		          .attr("width", function(d,i) 
		          {
		             max = 0.0
		             for(var j=0; j<zippedData.length; j++)
		             {  
		               if (zippedData[j] > max) 
		                  max = zippedData[j]
		                  
		              } 
		    
		 
		            return Math.floor(zippedData[i]*1000/max);
		      
		          })
		          .attr("height", barHeight - 1)
		          .on('mouseover', tip.show)
		          .on('mouseout', tip.hide);
		     
		  // Add text label in bar
		  bar.append("text")
		      .attr("x", function(d,i) { 
		            max = 0.0
		             for(var j=0; j<zippedData.length; j++)
		             {  
		             if (zippedData[j] > max) 
		                  max = zippedData[j]
		              } 
		             
		            return Math.floor(((zippedData[i]*1000)/max)  + 40);
		      
		      })
		      .attr("y", barHeight / 2) 
		      .attr("fill", "red")
		      .attr("dy", ".35em")
		      .text(function(d) { return d; });
		
		  // Draw labels
		  bar.append("text")
		      .attr("class", "label")
		      .attr("x", function(d) { return - 10; })
		      .attr("y", groupHeight / 2)
		      .attr("dy", ".35em")
		      .text(function(d,i) {
		        if (i % data.series.length === 0)
		          return data.labels[Math.floor(i/data.series.length)];
		        else
		          return ""});
		
		  chart.append("g")
		        .attr("class", "y axis")
		        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
		        .call(yAxis);
		
		  // Draw legend
		  var legendRectSize = 18,
		      legendSpacing  = 4;
		
		  var legend = chart.selectAll('.legend')
		      .data(data.series)
		      .enter()
		      .append('g')
		      .attr('transform', function (d, i) {
		          var height = legendRectSize + legendSpacing;
		          var offset = -gapBetweenGroups/2;
		          var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
		          var vert = i * height - offset;
		          return 'translate(' + horz + ',' + vert + ')';
		      });
		
		  legend.append('rect')
		      .attr('width', legendRectSize)
		      .attr('height', legendRectSize)
		      .style('fill', function (d, i) { return color(i); })
		      .style('stroke', function (d, i) { return color(i); });
		
		  legend.append('text')
		      .attr('class', 'legend')
		      .attr('x', legendRectSize + legendSpacing)
		      .attr('y', legendRectSize - legendSpacing)
		      .text(function (d) { return d.label; }); 
		  
}

