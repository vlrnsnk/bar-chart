const width = 900;
const height = 460;
const padding = 60;

const gdpDataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const svg = d3.select('.chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const tooltip = d3.select('.chart')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

d3.json(gdpDataUrl).then((jsonResponse) => {
  const dataset = jsonResponse.data;
  const barWidth = width / dataset.length;

  // Setting up xScale
  const yearsToDate = dataset.map(([year]) => new Date(year));
  const maxYear = d3.max(yearsToDate);
  maxYear.setMonth(maxYear.getMonth());

  const xScale = d3.scaleTime()
    .domain([d3.min(yearsToDate), maxYear])
    .range([padding, width - padding]);

  // Adding xAxis
  const xAxis = d3.axisBottom().scale(xScale);

  svg.append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${height - padding})`)
    .attr('id', 'x-axis');

  // Setting up yScale
  const gdp = dataset.map(([_year, gdp]) => gdp);
  const maxGdp = d3.max(gdp);

  const yScale = d3.scaleLinear()
    .domain([0, maxGdp])
    .range([height - padding, 0]);

  // Adding yAxis
  const yAxis = d3.axisLeft().scale(yScale);

  svg.append('g')
    .call(yAxis)
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis');

  const linearScale = d3.scaleLinear().domain([0, maxGdp]).range([0, height - padding]);
  const scaledGDP = gdp.map(function (item) {
    return linearScale(item);
  });

  // Mapping years to year + quarter
  const yearsAndQuarters = dataset.map(([year]) => {
    let quarterOfYear = '';
    const monthOfYear = year.slice(5, 7);

    switch (monthOfYear) {
      case '01':
        quarterOfYear = 'Q1';
        break;
      case '04':
        quarterOfYear = 'Q2';
        break;
      case '07':
        quarterOfYear = 'Q3';
        break;
      case '10':
        quarterOfYear = 'Q4';
        break;
    }

    return `${year.slice(0, 4)} ${quarterOfYear}`;
  });

  svg.selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append('rect')
    .attr('x', (_d, i) => xScale(yearsToDate[i]))
    .attr('y', (d) => height - d)
    .attr('width', barWidth)
    .attr('height', (d) => d)
    .style('fill', '#3182bd')
    .attr('transform', `translate(0, -${padding})`)
    .attr('class', 'bar')
    .attr('data-date', (_d, i) => dataset[i][0])
    .attr('data-gdp', (_d, i) => dataset[i][1])
    .attr('index', (_d, i) => i)
    .on('mouseover', (event, d) => {
      const index = event.target.getAttribute('index');
      tooltip.html(`${yearsAndQuarters[index]}<br>$${gdp[index]} Billion`)
        .style('left', `${index * barWidth + 10}px`)
        .style('top', `${height - 150}px`)
        // .style('transform', `translateX(${padding}px)`)
        .style('opacity', 0.9)
        .attr('data-date', dataset[index][0]);
    })
    .on('mouseout', () => {
      // tooltip.transition().duration(200).style('opacity', 0);
      tooltip.style('opacity', 0);
    });

}).catch((e) => {
  console.log(e);
});
//
// document.getElementsByClassName('chart')[0].addEventListener('mouseover', (event) => {
//   console.log(event.target);
// });
