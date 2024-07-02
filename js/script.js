const width = 900;
const height = 460;
const padding = 60;

const gdpDataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const svg = d3.select('.chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json(gdpDataUrl).then((jsonResponse) => {
  const dataset = jsonResponse.data;
  const barWidth = width / dataset.length;
  console.log(barWidth)

  // Setting up xScale
  const years = dataset.map(([year]) => year.slice(0, 4));
  const yearsToDate = dataset.map(([year]) => new Date(year));
  const maxYear = d3.max(yearsToDate);
  maxYear.setMonth(maxYear.getMonth());

  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsToDate), maxYear])
    .range([padding, width - padding]);

  // Adding xAxis
  const xAxis = d3.axisBottom().scale(xScale);

  svg
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${height - padding})`)
    .attr('id', 'x-axis');

  // Setting up yScale
  const gdp = dataset.map(([_year, gdp]) => gdp);
  const maxGdp = d3.max(gdp);
  const yScale = d3
    .scaleLinear()
    .domain([0, maxGdp])
    .range([height - padding, padding]);

  const yAxisScale = d3
    .scaleLinear()
    .domain([0, maxGdp])
    .range([height - padding, 0]);

  // Adding yAxis
  const yAxis = d3.axisLeft().scale(yAxisScale);

  svg
    .append('g')
    .call(yAxis)
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis');

  const linearScale = d3.scaleLinear().domain([0, maxGdp]).range([0, height - padding]);
  const scaledGDP = gdp.map(function (item) {
    return linearScale(item);
  });

  svg
    .selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append('rect')
    .attr('x', (_d, i) => {
      console.log(xScale(yearsToDate[i]));
      return xScale(yearsToDate[i]);
    })
    .attr('y', (d) => height - d)
    .attr('width', barWidth)
    .attr('height', (d) => d)
    .style('fill', '#3182bd')
    .attr('transform', `translate(0, -${padding})`)
    .attr('class', 'bar')
    .attr('data-date', (_d, i) => dataset[i][0])
    .attr('data-gdp', (_d, i) => dataset[i][1]);

}).catch((e) => {
  console.log(e);
});
