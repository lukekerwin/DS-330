var x_offset2 = 1150;

// Overall width and height
var width2 = 1200,
    height2 = 550;

// Margin around the graph
var margin2 = {top: 20, right: 20, bottom: 20, left: x_offset2};

// Origin of the graph
var originX2 = margin2.left;
var originY2 = margin2.top;

//define the the axes of the scatter plot
var x2 = d3.scale.linear().range([50, width2]),
    y2 = d3.scale.linear().range([height2-20,0]);

//define the array for multi-dimensional data
var cars2 = []; 

//create the svg
var svg2 = d3.select(".chart")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + originX2 + "," + originY2 + ")");

//read the data from a file
d3.csv("cars.csv", type2, function(error, data) {
    cars2 = data; // assign the data to the array

    // Populate dropdowns here
    var dimensions = Object.keys(cars2[0]).filter(function(d) {
        return d !== "name" && typeof cars2[0][d] === "number";
    });

    var xDropdown = d3.select("#xDimension");
    xDropdown.selectAll("option")
        .data(dimensions)
        .enter().append("option")
        .text(function(d) { return d; });

    var yDropdown = d3.select("#yDimension");
    yDropdown.selectAll("option")
        .data(dimensions)
        .enter().append("option")
        .text(function(d) { return d; });

    drawSPlot2(); // draw the graph

    function updateScatterPlot() {
        var xDimension = xDropdown.node().value;
        var yDimension = yDropdown.node().value;
    
        // Update the x and y scales based on the selected dimensions
        x2.domain(d3.extent(cars2, function(d) { return d[xDimension]; }));
        y2.domain(d3.extent(cars2, function(d) { return d[yDimension]; }));
    
        // Redraw the x-axis
        svg2.select(".xaxis")
            .transition()
            .duration(1000)
            .call(d3.svg.axis().scale(x2).orient("bottom"));
    
        // Redraw the y-axis
        svg2.select(".yaxis")
            .transition()
            .duration(1000)
            .call(d3.svg.axis().scale(y2).orient("left"));
    
        // Update the dots in the scatter plot
        svg2.selectAll(".dot")
            .transition()
            .duration(1000)
            .attr("cx", function(d) { return x2(d[xDimension]); })
            .attr("cy", function(d) { return y2(d[yDimension]); });
    }
    
    xDropdown.on("change", updateScatterPlot);
    yDropdown.on("change", updateScatterPlot);

});



var polyLines = [];
   dots = [];

//draw scatter plot
function drawSPlot2(){

    //define axes
    var xAxis2 = d3.svg.axis()
	   .scale(x2)
	   .orient("bottom");
    
    var yAxis2 = d3.svg.axis()
	   .scale(y2)
	   .orient("left");
    
    x2.domain([d3.min(cars2, function(d) { return d.year; }),
			 d3.max(cars2, function(d) { return d.year; })]);
    y2.domain([d3.min(cars2, function(d) { return d.power; }),
			d3.max(cars2, function(d) { return d.power; })]);
    //draw axes
    var xPosition2 = height2 -20;
    svg2.append("g")
	   .attr("class", "xaxis")
	   .attr("transform", "translate(0," + xPosition2 + ")")
	   .call(xAxis2);

    var yPosition2 = 50;
    svg2.append("g")
	   .attr("class", "yaxis")
	   .attr("transform", "translate(" + yPosition2 + ", 0)")
	   .call(yAxis2);
    
    //draw dots
    for (var i=0; i<cars2.length; i++) {
     
     //draw a dot
     var dot2 = svg2.append("g")
	   .append("circle")
	   .attr("class", "dot")
	   .attr("cx", function(d) { return x2(cars2[i].year); })
	   .attr("cy", function(d) { return y2(cars2[i].power); })
	   .attr("idx", i) // Assign the array index as an identifier
	   .attr("r", 3)
    	   .style("fill", "black")
	   .on("mouseover", function(d) {
               var idx = d3.select(this).attr("idx");
               highlightData(idx);
           })                  
	   .on("mouseout", function(d) {
               var idx = d3.select(this).attr("idx");
               deHighlightData(idx);
           });                  
     
     dots.push(dot2); // Store the dot reference in the dots array
    }
}

svg2.selectAll(".dot")
    .data(cars2)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) { return x2(d.year); }) // initial x position
    .attr("cy", function(d) { return y2(d.power); }) // initial y position
    .attr("r", 3)
    .style("fill", "black")
    .on("mouseover", function(d, i) {
        highlightData(i);
    })
    .on("mouseout", function(d, i) {
        deHighlightData(i);
    });


//function to coerce numerial data
function type2(d) {
    d.economy = +d.economy; // coerce to number
    d.displacement = +d.displacement; // coerce to number
    d.power = +d.power; // coerce to number
    d.weight = +d.weight; // coerce to number
    d.year = +d.year;
	return d;
}

//highlight data elements
function highlightData(i) {
    dots[i].style("fill", "red").attr("r", 5);
    polyLines[i].style("stroke", "red").style("stroke-width", 5);
    }
//restore the color of the highlighted elements
function deHighlightData(i) {
    dots[i].style("fill", "black").attr("r", 3);
    polyLines[i].style("stroke", "#666").style("stroke-width", 1);
    }


