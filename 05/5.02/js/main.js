/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.2 - Looping with intervals
*/

var margin = { left:80, right:20, top:50, bottom:100 };
const t = d3.transition().duration(700);
var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


// X Scale
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

// Y Scale
var y = d3.scaleLinear()
    .range([height, 0]);

let xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

let yAxisGroup = g.append("g")
    .attr("class", "y axis");

// X Label
const xLabel = g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
const yLabel = g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");

let isRevenue = true;

d3.json("data/revenues.json").then(function(data){
    // console.log(data);

    // Clean data
    data.forEach(function(d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    // run every x milliseconds
    d3.interval(function(){
        update(data);
        isRevenue = !isRevenue;
    }, 1000);

    // run for the first time
    update(data);
});

const update = function (data) {
    let currentY = isRevenue ? "revenue":"profit";
    yLabel.text(isRevenue ? "Revenue": "Profit");
    data = isRevenue ? data : data.slice(1);
    x.domain(data.map(function(d){ return d.month }));
    y.domain([0, d3.max(data, function(d) { return d[currentY] })]);
    // X Axis
    var xAxisCall = d3.axisBottom(x);
    xAxisGroup
        .transition(t)
        .call(xAxisCall);

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return "$" + d; });
    yAxisGroup
        .transition(t)
        .call(yAxisCall);

    // Join
    var rects = g.selectAll("rect")
        .data(data, (item)=> item.month);

    //Exit:
    rects.exit()
        .attr("fill","red")
        .transition(t)
        .attr("height", 0)
        .attr("y", y(0))
        .remove();
    // Update: update existing values
    // rects
    //     .transition(t)
    //     .attr("y", function(d){ return y(d[currentY]); })
    //     .attr("x", function(d){ return x(d.month) })
    //     .attr("width", x.bandwidth)
    //     .attr("height", function(d){ return height - y(d[currentY]); })

    // Enter:
    rects.enter()
        .append("rect")
        .attr("y", y(0))
        .attr("height", 0)
        .attr("width", x.bandwidth)
        .attr("fill", "grey")
        .merge(rects)
        .transition(t)
        .attr("x", function(d){ return x(d.month) })
        .attr("y", function(d){ return y(d[currentY]) })
        .attr("height", function(d){ return height - y(d[currentY]); });

    ;
}







