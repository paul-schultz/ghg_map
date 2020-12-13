(function () {
  var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 600 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;

  // init map of US
  var svg = d3
    .select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // init data sets
  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "ghgDataCity.csv")
    .defer(d3.csv, "ghgDataState.csv")
    .await(ready);

  var projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(1100);

  var path = d3.geoPath().projection(projection);

  var radius = d3.scaleSqrt().domain([0, 1e6]).range([0, 15]);

  // Tooltips for the four datasets
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

  var stateTool1 = d3
    .select("body")
    .append("div")
    .attr("class", "statetooltip1")
    .style("opacity", 0);

  var stateTool2 = d3
    .select("body")
    .append("div")
    .attr("class", "statetooltip2")
    .style("opacity", 0);

  // Render Data function
  function ready(error, data, ghgDataCity, ghgDataState) {
    console.log(data);

    // Render state map svg
    var states = topojson.feature(data, data.objects.states).features;
    console.log(states);

    svg
      .selectAll(".state")
      .data(states)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path);

    // Scope 1 data by city
    svg
      .selectAll(".scope1")
      .data(ghgDataCity)
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

    // Scope 2 data by city
    svg
      .selectAll(".scope2")
      .data(ghgDataCity)
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

    // Scope 1 data by state
    svg
      .selectAll(".statescope1")
      .data(ghgDataState)
      .enter()
      .append("circle")
      .attr("class", "statescope1")
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
        stateTool1.transition().duration(200).style("opacity", 0.9);
        stateTool1
          .html(
            "State: " +
              d.State +
              "<br>" +
              "Gases Included: " +
              d["Gases Included"] +
              "<br>" +
              "Total Scope 1 Emissions: " +
              d.Scope1 +
              " Mt C02e"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", (d) => {
        stateTool1.transition().duration(500).style("opacity", 0);
      });

    // Scope 2 data by state
    svg
      .selectAll(".statescope2")
      .data(ghgDataState)
      .enter()
      .append("circle")
      .attr("class", "statescope2")
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
        stateTool2.transition().duration(200).style("opacity", 0.9);
        stateTool2
          .html(
            "State: " +
              d.State +
              "<br>" +
              "Gases Included: " +
              d["Gases Included"] +
              "<br>" +
              "Total Scope 2 Emissions: " +
              d.Scope2 +
              " Mt C02e"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", (d) => {
        stateTool2.transition().duration(500).style("opacity", 0);
      });
  }

  // Toggle data display 
  function update() {
    d3.selectAll('.checkbox').each((d) => {
      cb = d3.select(this);
      grp = cb.property("value")

      // show group if box is checked
      if(cb.property('checked')) {
        svg.selectAll('.' + grp).style('visibility', 'visible')
      } else {
        svg.selectAll('.' + grp).style('visibility', 'hidden')
      }
    })
  }

  d3.selectAll(".checkbox").on("change",update);

  update()
})();
