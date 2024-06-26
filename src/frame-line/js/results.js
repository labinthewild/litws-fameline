(function (exports) {
    const PAGE_CONTENT_WIDTH = document.getElementById('content').offsetWidth;
    const MAX_GRAPH_WIDTH = 900;
    const MAX_GRAPH_HEIGHT = 400;
    const MAX_SCORE = 100;
    // Declare the chart dimensions and margins.
    const width = Math.min(PAGE_CONTENT_WIDTH, MAX_GRAPH_WIDTH);
    const height = MAX_GRAPH_HEIGHT;
    const barHeight = height/10;
    let svg = null;

    let _calculateMarkX = function (score) {
        return (width/MAX_SCORE*score)
    }
    let _addMark = function (context){
        context.moveTo(barHeight/2,barHeight)
        context.lineTo(0,0)
        context.lineTo(barHeight, 0)
        context.closePath()
        return context
    }

    let drawMark = function(score, legend, fill= false) {
        let mark = svg.append("g");
        let fill_color = !fill ? "none" : "black";
        mark.append("path")
            .style("stroke", "black")
            .style("fill", fill_color)
            .attr('d', _addMark(d3.path()))
        mark.append("text")
            .attr('x', barHeight/2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5em')
            .text(legend)
        mark.attr('transform', `translate(${_calculateMarkX(score)}, ${height/2-(3/2*barHeight)})`)
    }
    let draw = function(divID) {
        // Create the SVG container.
        svg = d3.select(`#${divID}`)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Add bar
        let bar = svg.append("g");
        bar.append("rect")
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', barHeight)
            .attr('stroke', 'black')
            .attr('fill', '#6A9341')
        bar.append("text")
            .attr('x', 0)
            .attr('y', barHeight*2)
            .text($.i18n('study-fl-results-graphic-legend-1'))
        bar.append("text")
            .attr('x', width)
            .attr('y', barHeight*2)
            .attr('text-anchor', 'end')
            .text($.i18n('study-fl-results-graphic-legend-2'))
        bar.attr('transform', `translate(${0}, ${height/2-(barHeight/2)})`);
    }

    exports.results = {};
    exports.results.drawGraphic = draw;
    exports.results.drawMark = drawMark;

})( window.LITW = window.LITW || {} );