//define the svg area
var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

//define the the axes in parallel coordinate
var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {};

var line = d3.svg.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .interpolate("linear");

var axis = d3.svg.axis().orient("left");


//define the array for multi-dimensional data
var cars = []; 

//define the array to hold all lines
var polyLines = [];

//create the svg
var svg = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//read the data from a file
d3.csv("cars.csv", type, function(error, data) {
    cars = data;//assign the data to the array
    drawpc(); //draw the graph
    drawxyplot();
});

function drawpc() {
    
    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
                return d != "name" && 
                (y[d] = d3.scale.linear()
                            .domain(d3.extent(cars, function(p) { return +p[d]; }))
            .range([height, 0]));
    }));

    // Add polylines
    for (var i=0; i< cars.length; i++) {
        var lineData = [];
        
        //prepare data
        for (var prop in cars[i]) {
             if (prop != "name" ) {
                 var point = {};
                 var val = cars[i][prop];
                 point['x'] = x(prop);
                 point['y'] = y[prop](val);
                 lineData.push(point);
             }
        }
        
        //draw a poly line
        var pLine=svg.append("g")
                    .attr("class", "polyline")    
                    .append("path")
                    .attr("d", line(lineData))
                    .attr("idx", i) // Assign the array index as an identifier
                    .on("mouseover", function(d) {
                        var idx = d3.select(this).attr("idx");
                        highlightData(idx);
                    })                  
                    .on("mouseout", function(d) {
                        var idx = d3.select(this).attr("idx");
                        deHighlightData(idx);
                    });
                        
       polyLines.push(pLine); // Store the polyline reference in the polyLines array
    }

    //add dimension axes 
    var g = svg.selectAll(".dimension")
	   .data(dimensions)
	   .enter().append("g")
	   .attr("class", "dimension")
	   .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
    
    //add an axis and title.
    g.append("g")
	   .attr("class", "axis")
	   .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
	   .append("text")
	   .style("text-anchor", "middle")
	   .attr("y", -9)
	   .text(function(d) { return d; });
    
};

function type(d) {
    d.economy = +d.economy; // coerce to number
    d.displacement = +d.displacement; // coerce to number
    d.power = +d.power; // coerce to number
    d.weight = +d.weight; // coerce to number
    d.year = +d.year;
	return d;
}

function drawxyplot() {
        
        //define axes
        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
        
        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        
        x.domain([d3.min(cars, function(d) { return d.year; }),
                d3.max(cars, function(d) { return d.year; })]);
        y.domain([d3.min(cars, function(d) { return d.power; }),
                d3.max(cars, function(d) { return d.power; })]);
        //draw axes
        var xPosition = height -20;
        svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + xPosition + ")")
        .call(xAxis);
    
        var yPosition = 50;
        svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + yPosition + ", 0)")
        .call(yAxis);
        
        //draw dots
        for (var i=0; i<cars.length; i++) {
        
        //draw a dot
        var dot = svg.append("g")
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return x(cars[i].year); })
        .attr("cy", function(d) { return y(cars[i].power); })
        .attr("idx", i)
        .attr("r", 3)
        	   .style("fill", "black")
        .on("mouseover", function(d) {
                d3.select(this).style("fill", "red").attr("r", 5);  })                  
        .on("mouseout", function(d) {
                d3.select(this).style("fill", "black").attr("r", 3);  });                  
        }
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
