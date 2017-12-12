var parseTime = d3.timeParse("%m/%d/%y"),
    formatValue = d3.formatPrefix(",.0", 1e9);

// chart 2 metcalfe
var chart2 = d3.select("#svg2"),
    margin2 = {top: 20, right: 50, bottom: 30, left: 50},
    width2 = +chart2.attr("width") - margin2.left - margin2.right,
    height2 = +chart2.attr("height") - margin2.top - margin2.bottom,
    g2 = chart2.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// var parseTime = d3.timeParse("%m/%d/%y");

// chart 2 x scale
var x2 = d3.scaleTime()
    .rangeRound([0, width2]);

// chart 2 y scale
var y2 = d3.scaleLinear()
    .rangeRound([height2, 0]);

// chart 2 metcalfe projection line
var line2 = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y2(d.metcalfe_market_cap); });

// chart 2 actual market cap line
var line_market_cap = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x2(d.date); })
      .y(function(d) { return y2(d.market_cap); });

// load data
d3.csv("./data/data_market_cap.csv", function(d) {
  d.date = parseTime(d.date);
  d.market_cap = +d.market_cap;
  d.metcalfe_market_cap = +d.metcalfe_market_cap;

  return d;
}, function(error, data) {
  if (error) throw error;

  x2.domain(d3.extent(data, function(d) { return d.date; }));
  y2.domain(d3.extent(data, function(d) { return d.market_cap; }));

// chart 2 x axis
  g2.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x2))
    .select(".domain");

// chart 2 y axis
  g2.append("g")
      .call(d3.axisRight(y2).ticks(10).tickFormat(formatValue))
      .attr("transform", "translate(" + (width2) + ",0)")
      .attr('class', 'axis')
      .append("text")
      .attr("fill", "#000")
      .attr("x", -5)
      .attr("y", 5)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Market Capitalization (in billion $)");

// chart 2 project line
  var pm = g2.append("path")
      .datum(data)
      // .duration(750)
      .attr("fill", "none")
      .attr("stroke", "lightcoral")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line2);

// chart 2 actual market capitalization
  var am = g2.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line_market_cap);

function drawLine(path, duration=1000) {
  var totalLength = path.node().getTotalLength();

  path
  .style('opacity',1)
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
  .ease(d3.easePoly)
  .duration(duration)
  .attr("stroke-dashoffset", 0);
}

drawLine(pm);
drawLine(am);
});
