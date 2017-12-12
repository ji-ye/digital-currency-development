var formatBillion = d3.formatPrefix(",.0", 1e9);

var margin3 = {top: 8, right: 15, bottom: 20, left: 40},
    width3 = 240 - margin3.left - margin3.right,
    height3 = 180 - margin3.top - margin3.bottom;

var xScale = d3.scaleLinear()
    .range([0, width3]);

var yScale = d3.scaleLinear()
    .range([height3, 0]);

var yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(3);

var area = d3.area()
    .x(function(d) { return xScale(d.year); })
    .y0(height3)
    .y1(function(d) { return yScale(d.value); });

var line3 = d3.line()
    .x(function(d) { return xScale(d.year); })
    .y(function(d) { return yScale(d.value); });

d3.csv("./data/data_event.csv", convertTextToNumbers, function(error, data) {

  xScale.domain(d3.extent(data, function(d) { return d.year; }));
  yScale.domain([d3.min(data, function(d) {  return d.value; })
                ,d3.max(data, function(d) {  return d.value; })]);

  // Nest data by subject.
  var events = d3.nest()
      .key(function(d) { return d.city; })
      .entries(data);

  var nz = events.filter(function(d){ return d.key === "NZ" });
  events = events.filter(function(d){ return d.key !== "NZ" });


  // Add an SVG element for each city
  var chart3 = d3.select("#svg3").selectAll("svg")
      .data(events)
      .enter().append("svg")
      .style("margin-bottom", "10px")
      .attr("width", width3 + margin3.left + margin3.right)
      .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
      .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")")
      ;

  chart3.append("path")
      .attr("class", "line")
      .attr("d", function(d) {return line3(nz[0].values); })
  		.style("stroke", "lightgrey");

  // Add the line path elements
  chart3.append("path")
      .attr("class", "line")
      .attr("d", function(d) {return line3(d.values); });

  // Add a labels
  chart3.append("text")
      .attr("x", (width3 + 10)/2)
      .attr("y", margin3.top)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .attr("fill", "#B35959")
  		.text(function(d) { return d.key; });

  chart3.append("text")
  	.text(xScale.domain()[0] + 1 + " Week prior")
      .attr("x", 0)
      .attr("y", height3 + 15)
      .style("text-anchor", "start")
      .style("font-size", "12px")
      .attr("fill", "#B35959");

  chart3.append("text")
  	.text(xScale.domain()[1] - 2 + " Weeks after")
      .attr("x", width3)
      .attr("y", height3 + 15)
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .attr("fill", "#B35959");

  //add axes
	chart3.append("g")
  .attr("id", "yAxisG")
  .call(yAxis.ticks(5).tickFormat(formatBillion))
	d3.selectAll("path.domain").remove();
	d3.selectAll("line").style("stroke", "silver");

});

function convertTextToNumbers(d) {
  d.year = +d.year;
  d.value = +d.value;
  return d;
}
