//margins, width, and height of the chart
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//create the chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//scale of x axis
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear()
    .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));
    
var testArray = [6,1,8,5,2,7,4,3,9];
var bardata=[];

var isAscending = true;

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var formatPercent = d3.format(".0%");

d3.tsv("data.tsv", type, function(error, data) {

    //passing the data to bardata
    bardata = data;
    
    //defining the axes
    x.domain(bardata.map(function(d) { return d.name; }));
    y.domain([0, d3.max(bardata, function(d) { return d.value; })]);
    //x axis
    chart.append("g")
       .attr("class", "xaxis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
    //y axis
    chart.append("g")
       .attr("class", "yaxis")
       .call(yAxis);

    //building bars
    chart.selectAll(".bar")
        .data(bardata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); }) 
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand())
        .on("mouseover", function(d){
            d3.select(this).style("fill", "darkred");
    
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.name+ " = " + d.value)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d){
            d3.select(this).style("fill", "steelblue");
    
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});

        d3.select("svg")
            .on("mousedown", function(){
                var coords = d3.mouse(this);
                var xPos = coords[0];
                var yPos = coords[1];
                if (xPos < margin.left && yPos < height + margin.bottom) {
                    console.log("Clicking on Y axis at " + xPos + ", " + yPos);
                    sortDataY();
                    updateChart();
                }
                if (yPos > height + margin.bottom && xPos > margin.left) {
                    console.log("Clicking on X axis at " + xPos + ", " + yPos);
                    sortDataX();
                    updateChart();
                }

            })



//function to process numerical data 
function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}

function sortDataY() {
    if (isAscending) {
        bardata.sort(function(a,b) {return a.value - b.value;});
    } else {
        bardata.sort(function(a,b) {return b.value - a.value;});
    }
    isAscending = !isAscending;
}

function sortDataX() {
    if (isAscending) {
        bardata.sort(function(a,b) {return d3.ascending(a.name, b.name);});
    } else {
        bardata.sort(function(a,b) {return d3.descending(a.name, b.name);});
    }
    isAscending = !isAscending;
}

function updateChart() {
    x.domain(bardata.map(function(d) { return d.name; }));
    y.domain([0, d3.max(bardata, function(d) { return d.value; })]);

    chart.selectAll(".bar")
        .data(bardata)
        .transition()
        .duration(0)
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        
    chart.select(".xaxis")
        .transition()
        .duration(0)
        .call(xAxis);

}