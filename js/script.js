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

const highlighter = d3.select('.chart')
  .append('div')
  .style('opacity', 0)
  .attr('class', 'highlighter');

d3.json(gdpDataUrl).then((jsonResponse) => {
  const dataset = jsonResponse.data;
  const barWidth = (width - padding - padding) / dataset.length;

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

  // Adding caption to xAxis
  svg.append('text')
    .attr('x', 200)
    .attr('y', 455)
    .html('A Guide to the National Income and Product Accounts of the United States (NIPA) - (http://www.bea.gov/national/pdf/nipaguid.pdf)')
    .style('font-size', '1.2rem');

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

  // Adding caption to y-axis
  svg.append('text')
    .text('Gross Domestic Product')
    .attr('x', -200)
    .attr('y', 90)
    .attr('transform', 'rotate(-90)')
    .style('font-size', '1.6rem');

  // Creating sclaled GDP
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
    .on('mouseenter', (event, d) => {
      const index = event.target.getAttribute('index');

      highlighter.transition()
        .duration(0)
        .style('opacity', 0.9)
        .style('width', `${barWidth}px`)
        .style('height', `${d}px`)
        .style('top', `${height - padding - d}px`)
        .style('left', `${(Number(index) + 1) * barWidth+ 60}px`)
        .attr('transform', 'translateX(60)');

      tooltip.html(
        `${yearsAndQuarters[index]}<br>$${gdp[index].toFixed(1)
          .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} Billion`
      )
        .style('left', `${index * barWidth + 100}px`)
        .style('top', `${height - 170}px`)
        .attr('data-date', dataset[index][0]);
      tooltip.transition().duration(200).style('opacity', 0.9);
    })
    .on('mouseleave', () => {
      tooltip.transition().duration(200).style('opacity', 0);
      highlighter.transition().duration(200).style('opacity', 0);
    });

}).catch((e) => {
  console.log(e);
});
