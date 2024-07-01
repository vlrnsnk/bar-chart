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

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom(xScale);

  svg
    .append('g')
    .call(xAxis)
    .attr('transform', 'translate(0, 400)');

}).catch((e) => {
  console.log(e);
});
