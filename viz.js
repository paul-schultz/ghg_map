(function () {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 600 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;

  var svg = d3
    .select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "ghgData.csv")
    .await(ready);

  var projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(1200);

  var path = d3.geoPath().projection(projection);

  var radius = d3.scaleSqrt().domain([0, 1e6]).range([0, 15]);

  var tool1 = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip1")
    .style("opacity", 0);

  var tool2 = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);

  function ready(error, data, ghgData) {
    console.log(data);

    var states = topojson.feature(data, data.objects.states).features;
    console.log(states);

    svg
      .selectAll(".state")
      .data(states)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path);

    svg
      .selectAll(".scope1")
      .data(ghgData)
      .enter()
      .append("circle")
      .attr("class", "scope1")
      .attr("r", (d) => {
        return radius(d.Scope1);
      })
      .attr("cx", (d) => {
        var coords = projection([d.X, d.Y]);
        return coords[0];
      })
      .attr("cy", (d) => {
        var coords = projection([d.X, d.Y]);
        return coords[1];
      })
      .on("mouseover", (d) => {
        tool1.transition().duration(200).style("opacity", 0.9);
        tool1
          .html(
            "Organization: " +
              d.Organization +
              "<br>" +
              "City: " +
              d.City +
              "<br>" +
              "State: " +
              d.State +
              "<br>" +
              "Gases Included: " +
              d["Gases Included"] +
              "<br>" +
              "Scope 1 Emissions: " +
              d.Scope1 +
              " Mt C02e"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", (d) => {
        tool1.transition().duration(500).style("opacity", 0);
      });

    svg
      .selectAll(".scope2")
      .data(ghgData)
      .enter()
      .append("circle")
      .attr("class", "scope2")
      .attr("r", (d) => {
        return radius(d.Scope2);
      })
      .attr("cx", (d) => {
        var coords = projection([d.X, d.Y]);
        return coords[0];
      })
      .attr("cy", (d) => {
        var coords = projection([d.X, d.Y]);
        return coords[1];
      })
      .on("mouseover", (d) => {
        tool2.transition().duration(200).style("opacity", 0.9);
        tool2
          .html(
            "Organization: " +
              d.Organization +
              "<br>" +
              "City: " +
              d.City +
              "<br>" +
              "State: " +
              d.State +
              "<br>" +
              "Gases Included: " +
              d["Gases Included"] +
              "<br>" +
              "Scope 2 Emissions: " +
              d.Scope2 +
              " Mt C02e"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", (d) => {
        tool2.transition().duration(500).style("opacity", 0);
      });
  }
})();
