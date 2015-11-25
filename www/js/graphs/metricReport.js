var MetricReport = function(reportDiv, maxHeight, maxWidth, reportTitle) {
  var svg = null;

  var formatTimeToolTip = d3.time.format("%e %B %H:%M");

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width  = maxWidth - margin.left - margin.right,
      height = maxHeight - margin.top - margin.bottom;

  // var x = d3.scale.ordinal()
  //     .rangeRoundBands([0, width], .7);

  var x = d3.time.scale().range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  //X Axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(5)
      .tickFormat(d3.time.format("%d/%m %H:%M"));

  //Y Axis
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format("d"));

  this.display = function(bulkData){

    if (svg != null){
      console.log('removing svg');
      d3.select("#metricSvg").remove();
    }

    var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.result); });

    console.log('drawing svg');
    svg = d3.select(reportDiv).append("svg")
        .attr("id","metricSvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var result = bulkData;
    var data   = result['data'];

    data.forEach(function(d) {
      d.date   = Date.parse(d.taken_at);
      d.result = +d.value;
    });

    // x.domain(dates);
    x.domain([d3.min(data, function (d) { return d.date; })-1, d3.max(data, function (d) { return d.date; })]);
    y.domain([d3.min(data, function (d) { return d.result; })-1, d3.max(data, function (d) { return d.result; })]);

    //Draw Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      // Rotate  Axis Ticks
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"
            })
      .append("text")
        .attr("x", width / 2 )
        .attr("y", 35 )
        .style("text-anchor", "middle")
        .text("Date");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height / 2)
        .attr("y", - 40)
        .style("text-anchor", "middle")
        .text("Valeur mesurée");

    //Draw Graphic
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 5.5)
      .style("fill", "blue")
      .style("opacity", .8)      // set the element opacity
      .style("stroke", "#f93")    // set the line colour
      .style("stroke-width", 3.5)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.result); })
      .on("mouseover", function(d) {
        d3.select(this).attr("r", 7);
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(formatTimeToolTip(new Date(d.date)) + "<br/>"  + d.result)
          .style("left", d3.event.pageX + "px")
          .style("top", (d3.event.pageY + 18) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("r", 5.5);
          div.transition()
            .duration(500)
            .style("opacity", 0);
      });

    //Title: not displayed
    // svg.append("foreignObject")
    //   .attr("id", "reportTitle")
    //   .attr("x", 0)
    //   .attr("y", height + (margin.bottom - 60))
    //   .attr("width", width)
    //   .attr("height", height / 2)
    //   .append("xhtml:body")
    //   .attr("text-anchor", "middle")
    //   .html(reportTitle);
  };

}