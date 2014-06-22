Sheetsee.d3ColumnChart = function(data, options) {
	// format data into units and labels
	var data = data.map(function(r) {
	  var labels = options.labels
	  var units = options.units
	  return {units: r[units], labels: r[labels], hexcolor: r.hexcolor}
	})

	//  m = [t0, r1, b2, l3]
	var m = options.m,
	    w = options.w - m[1] - m[3],
	    h =  options.h - (m[0] + m[2])
	var format = d3.format(",.0f")

	var x = d3.scale.linear().range([0, w]),
	    y = d3.scale.ordinal().rangeRoundBands([0, h], .1)

	var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h).tickFormat(d3.format("1s")),
	    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0)

	var svg = d3.select(options.div).append("svg")
	    .attr("width", w + m[1] + m[3])
	    .attr("height", h + m[0] + m[2])
	  .append("g")
	    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")

	x.domain([0, d3.max(data, function(d) { return d.units })]) // 0 to max of units
	y.domain(data.map(function(d) { return d.labels })) // makes array of labels

	var mouseOver = function() {
	    var rect = d3.select(this)
	    var indexValue = rect.attr("index_value")

	    var barSelector = "." + "rect-" + indexValue
	    var selectedBar = d3.selectAll(barSelector)
	    selectedBar.style("fill", options.hiColor)

	    var valueSelector = "." + "value-" + indexValue
	    var selectedValue = d3.selectAll(valueSelector)
	    selectedValue.style("fill", options.hiColor)

	    var textSelector = "." + "labels-" + indexValue
	    var selectedText = d3.selectAll(textSelector)
	    selectedText.style("fill", options.hiColor)
	}

	var mouseOut = function() {
	    var rect = d3.select(this)
	    var indexValue = rect.attr("index_value")

	    var barSelector = "." + "rect-" + indexValue
	    var selectedBar = d3.selectAll(barSelector)
	    selectedBar.style("fill", function(d) { return d.hexcolor})

	    var valueSelector = "." + "value-" + indexValue
	    var selectedValue = d3.selectAll(valueSelector)
	    selectedValue.style("fill", "#333333")

	    var textSelector = "." + "labels-" + indexValue
	    var selectedText = d3.selectAll(textSelector)
	    selectedText.style("fill", "#333")
	}

	var bar = svg.selectAll("g.bar")
	  .data(data)
	.enter().append("g")
	  .attr("class", "bar")
	  .attr("transform", function(d) { return "translate(0," + y(d.labels) + ")" })

	bar.append("text")
	  .attr("x", function(d) { return x(d.units) })
	  .attr("y", y.rangeBand() / 2)
	  .attr("dx", 12)
	  .attr("dy", ".35em")
	  .attr("text-anchor", "end")
	  .attr("index_value", function(d, i) { return "index-" + i })
	  .text(function(d) { return format(d.units) })
	  .attr("class", function(d, i) { return "value-" + "index-" + i })
	  .on('mouseover', mouseOver)
	  .on("mouseout", mouseOut)

	bar.append("text")
	  .attr("x", -5)
	  .attr("y", y.rangeBand() / 2)
	  .attr("dx", 0)
	  .attr("dy", ".35em")
	  .attr("text-anchor", "end")
	  .attr("index_value", function(d, i) { return "index-" + i })
	  .text(function(d) { return d.labels })
	  .attr("class", function(d, i) { return "value-" + "index-" + i })
	  .on('mouseover', mouseOver)
	  .on("mouseout", mouseOut)

	bar.append("rect")
	  .attr("width", function(d) { return x(d.units)})
	  .attr("height", y.rangeBand())
	  .attr("index_value", function(d, i) { return "index-" + i })
	  .style("fill", function(d) { return d.hexcolor})
	  .on('mouseover', mouseOver)
	  .on("mouseout", mouseOut)
	  .attr("class", function(d, i) { return "rect-" + "index-" + i })

	svg.append("g")
	  .attr("class", "x axis")
	  .call(xAxis)
	.append("text")
	  // .attr("transform", "rotate(-90)")
	  .attr("y", -20)
	  .attr("x", m[1])
	  .attr("class", "xLabel")
	  .style("text-anchor", "end")
	  .text(function() {
	    if (options.xaxis) return options.xaxis
	    return
	  })
}
