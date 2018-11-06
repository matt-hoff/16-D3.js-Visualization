// Set up SVG Chart Area
// ==============================
var svgWidth = 720;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create an SVG wrapper
// ==============================
var svg = d3
.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// Append group element
// ==============================
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read CSV
// ==============================
var file = "data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
throw error;
}

function successHandle(stateData) {

    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
// Create the scales for the chart
// ==============================
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

// Create the axes
// ==============================
    var xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScale);

// Append the axes to the chartGroup
// ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

// Create Scatter Plot Points
// ==============================

    chartGroup
    .selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "#94BBD1")
    .attr("opacity", ".75")

// // Create Scatter Plot Point Labels
// // ==============================

    chartGroup
    .selectAll("text")
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("dx", function(d) {
        return xScale(d.poverty);
    })
    .attr("dy", function(d) {
        return yScale(d.healthcare);
    })
    .attr("font_family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "red");

// Create axes labels
// ==============================
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "yAxisText")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "xAxisText")
    .text("In Poverty (%)");
}