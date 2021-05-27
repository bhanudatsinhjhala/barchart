const projectName="bar-chart";

var width=800;
    height=400;
    barwidth=width/275;

var tooltip=d3.select(".visHolder")
              .append("div")
              .attr("id","tooltip")
              .style("opacity","0");

var overlay=d3.select(".visHolder")
              .append("div")
              .attr("class","overlay")
              .style("opacity","0");

var svgContainer=d3.select(".visHolder")
                   .append("svg")
                   .attr("width",width+100)
                   .attr("height",height+60);
const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const req= new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload= function(){
  const json= JSON.parse(req.response);
  const dataset=json.data;

  svgContainer.append("text")
              .attr('transform',"rotate(-90)")
              .attr("x",-200)
              .attr("y",80)
              .text("Gross Domestic Product");

  svgContainer.append('text')
              .attr('x', width / 2 + 75)
              .attr('y', height + 50)
              .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
              .attr('class', 'info');

var years= dataset.map(function(value){
  var quarter="";
  var temp=value[0].substring(5,7);

  if(temp=="01"){
    quarter="Q1";
  }else if(temp=="04"){
    quarter="Q2"
  }else if(temp=="07"){
    quarter="Q3";
  }else if(temp=="10"){
    quarter="Q4";
  }

  return value[0].substring(0,4) + " " +quarter+".";
});
//console.log(years);
//console.log(years);

var yearsDate= dataset.map(function(value){
  return new Date(value[0]);
});

var xMax= new Date(d3.max(yearsDate));
xMax.setMonth(xMax.getMonth()+3);

xScale= d3.scaleTime()
          .domain([d3.min(yearsDate), xMax])
          .range([0, width]);

var xAxis=d3.axisBottom().scale(xScale);

svgContainer.append("g")
            .call(xAxis)
            .attr('class','xAxis')
            .attr('transform', 'translate(60,400)');

            var GDP = dataset.map(function (item) {
              return item[1];
            });

            var scaledGDP = [];

            var gdpMax = d3.max(GDP);

            var linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

            scaledGDP = GDP.map(function (item) {
              return linearScale(item);
            });

            var yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

            var yAxis = d3.axisLeft(yAxisScale);

            svgContainer
              .append('g')
              .call(yAxis)
              .attr('id', 'y-axis')
              .attr('transform', 'translate(60, 0)');

  d3.select("svg")
    .selectAll("rect")
    .data(scaledGDP)
    .enter()
    .append("rect")
    .attr('data-date', function (d, i) {
      return dataset[i][0];
    })
    .attr('data-gdp', function (d, i) {
      return dataset[i][1];
    })
    .attr('class', 'bars')
    .attr('x', function (d, i) {
      return xScale(yearsDate[i]);
    })
    .attr('y', function (d) {
      return height - d;
    })
    .attr('width', barwidth)
    .attr('height', function (d) {
      return d;
    })
    .style('fill', '#33adff')
    .attr('transform', 'translate(60, 0)')
    .on('mouseover', function (d, i) {
      i=Math.floor(i);
      overlay
        .transition()
        .duration(0)
        .style('height', d + 'px')
        .style('width', barwidth + 'px')
        .style('opacity', 0.9)
        .style('left', i * barwidth + 0 + 'px')
        .style('top', d + 'px')
        .style('transform', 'translateX(60px)');
      tooltip.transition().duration(200).style('opacity', 0.9);
    // console.log(d);
      tooltip
        .html(
          years[i] +
            '<br>' +
            '$' +
            GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
            ' Billion'
        )
        .attr('data-date', dataset[i][0])
        .style('left', i * barwidth + 25 + 'px')
        .style('top', height - 100 + 'px')
        .style('transform', 'translateX(60px)');
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0);
      overlay.transition().duration(200).style('opacity', 0);
    });
  }
