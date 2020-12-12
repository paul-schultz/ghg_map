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

    console.log(ghgData);

    svg
      .selectAll(".ghg")
      .data(ghgData)
      .enter()
      .append("circle")
      .attr("class", "ghg")
      .attr("r", 5)
      .attr("cx", (d) => {
        var coords = projection([d.X, d.Y]);
        console.log(d.Organization)
        console.log(d.Scope1)
        console.log(coords[0])
        return coords[0];
      })
      .attr("cy", (d) => {
        var coords = projection([d.X, d.Y]);
        return coords[1];
      });
  }
})();
