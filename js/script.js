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
  const barWidth = width / dataset.width;

  // Setting up xScale
  const years = dataset.map(([year]) => year.slice(0, 4));
  const yearsToDate = years.map((year) => new Date(year));
  const maxYear = d3.max(yearsToDate);
  maxYear.setMonth(maxYear.getMonth() + 6);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsToDate), maxYear])
    .range([padding, width - padding]);

  // Adding xAxis
  const xAxis = d3.axisBottom().scale(xScale);

  svg
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${height - padding})`);

  // Setting up yScale
  const gdp = dataset.map(([_year, gdp]) => gdp);
  const maxGdp = d3.max(gdp);
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(gdp), maxGdp])
    .range([height - padding, padding]);

  // Adding yAxis
  const yAxis = d3.axisLeft().scale(yScale);

  svg
    .append('g')
    .call(yAxis)
    .attr('transform', `translate(${padding}, 0)`);




}).catch((e) => {
  console.log(e);
});
