(function (exports) {
  const MAX_SCORE = 100;
  let height = 0;
  let width = 0;
  let margin = 0;
  let svg = null;
  let lastMarkCoordinate = null;
  let barHeight = () => {
    return height / 10;
  };

  //TODO: This only works for two sequential points.
  // We need to implement a check for multiple points
  let _isTooClose = function (mark1_x, mark2_x) {
    let dist = Math.abs(mark1_x - mark2_x);
    return dist < 3 * barHeight();
  };

  let _calculateMarkX = function (score) {
    return ((width - 2 * margin) / MAX_SCORE) * score + margin;
  };
  let _addMark = function (context) {
    context.moveTo(0, barHeight());
    context.lineTo(-barHeight() / 2, 0);
    context.lineTo(barHeight() / 2, 0);
    context.closePath();
    return context;
  };

  let drawMark = function (score, legend, fill = false) {
    let mark_x = _calculateMarkX(score);
    let mark_y = height / 2 - (3 / 2) * barHeight();
    let tooClose = false;
    if (lastMarkCoordinate && _isTooClose(mark_x, lastMarkCoordinate.x)) {
      tooClose = true;
    }

    let mark = svg.append("g");
    let fill_color = !fill ? "none" : "black";
    mark
      .append("path")
      .style("stroke", "black")
      .style("fill", fill_color)
      .attr("d", _addMark(d3.path()));
    mark
      .append("text")
      .attr("x", 0)
      .attr("y", tooClose ? -barHeight() : -(barHeight() / 6))
      .attr("text-anchor", "middle")
      .attr("font-size", "1.5em")
      .text(legend);

    lastMarkCoordinate = { x: mark_x, y: mark_y };
    mark.attr("transform", `translate(${mark_x}, ${mark_y})`);
  };

  let draw = function (divID) {
    const PAGE_CONTENT_WIDTH = document.getElementById(divID).offsetWidth;
    width = PAGE_CONTENT_WIDTH;
    height = width / 3;
    margin = height / 6;

    // Create the SVG container.
    svg = d3
      .select(`#${divID}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Add bar
    let bar = svg.append("g");
    bar
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width - 2 * margin)
      .attr("height", barHeight())
      .attr("stroke", "black")
      .attr("fill", "#6A9341");
    bar
      .append("text")
      .attr("x", 0)
      .attr("y", barHeight() * 2)
      .text($.i18n("study-fl-results-graphic-legend-1"));
    bar
      .append("text")
      .attr("x", width - 2 * margin)
      .attr("y", barHeight() * 2)
      .attr("text-anchor", "end")
      .text($.i18n("study-fl-results-graphic-legend-2"));
    bar.attr(
      "transform",
      `translate(${margin}, ${height / 2 - barHeight() / 2})`
    );
  };

  exports.results = {};
  exports.results.drawGraphic = draw;
  exports.results.drawMark = drawMark;
})((window.LITW = window.LITW || {}));
