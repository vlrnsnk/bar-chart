const width = 900;
const height = 460;
const padding = 20;

const gdpDataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const svg = d3.select('.chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json(gdpDataUrl).then((jsonResponse) => {
  const dataset = jsonResponse.data;
  const barWidth = width / dataset.width;

  const years = dataset.map(([year]) => year.slice(0, 4));
  const yearsToDate = years.map((year) => new Date(year));
  const maxYear = d3.max(yearsToDate);
  maxYear.setMonth(maxYear.getMonth() + 6);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsToDate), maxYear])
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom().scale(xScale);

  svg
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${height - padding})`);

}).catch((e) => {
  console.log(e);
});
