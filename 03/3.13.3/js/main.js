/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/



d3.json("./data/revenues.json")
    .then( data => {

        let barPaddingInner = 0.3;
        let barPaddingOuter = 0.3;
        let width = 600;
        let height = 300;
        const svg = d3.select("#chart-area")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("style", "border: 1px solid black;");

        const margin = {top: 20, right: 20, bottom: 50, left: 80};
        width = width - margin.left  - margin.right;
        height = height - margin.top  - margin.bottom;
        // create y scale
        const y = d3.scaleLinear()
            .domain([0,d3.max(data, val => val.revenue)])
            .range([height, 0]);

        // create x scale
        const x = d3.scaleBand()
            .domain(data.map(d => d.month))
            .range([0,width])
            .paddingInner(barPaddingInner)
            .paddingOuter(barPaddingOuter);

        // create a group for the bars
        const gAxis = svg.append("g")
            .attr("transform", "translate("
                + margin.left+","
                + margin.top+")");

        const xAxisCall = d3.axisBottom(x);

        gAxis.append("g")
            .attr("transform", "translate(0,"+height+")")
            .call(xAxisCall)
            .selectAll("text");

        const xAxisLabel = gAxis.append("g")
            .attr("transform","translate("
                +width/2+","+(height + 30) +")")
            .append("text")
            .text("Month");

        const yAxisCall = d3.axisLeft(y);

        gAxis.append("g")
            .call(yAxisCall);

        const yAxisLabel = gAxis
            .append("g")
            .attr("transform", "translate("
                +(-(margin.left+20)/2)+","+(height/2+30)+")")
            .append("text")
            // .attr("x",-margin.left)
            // .attr("y", -height/2)
            .attr("transform", "rotate(-90)")
            .text("Revenue");

        // Join rects to data
        const rects = gAxis.selectAll("rect")
            .data(data);
        rects.enter()
            .append("rect")
            .attr("x", (val) => {
                return x(val.month);
            })
            .attr("y", val => y(val.revenue))
            .attr("width", x.bandwidth)
            .attr("height", (val)=> {
                return height  - y(val.revenue);
            })
            .attr("fill", "brown");
    });



