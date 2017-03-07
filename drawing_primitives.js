// Should contain all of these inside a class

class Artist {
    constructor(svg_width, svg_height, data_x_min, data_x_max, data_y_min, data_y_max) {
        var margin = 10;
        this.xscale = d3.scaleLinear()
            .domain([data_x_min, data_x_max])
            .range([0, svg_width]);

        this.yscale = d3.scaleLinear()
            .domain([data_y_min, data_y_max])
            .range([0, svg_height]);

        var svg = d3.select("svg").html("")
            .attr("width", svg_width + 2 * margin)
            .attr("height", svg_height + 2 * margin)
            .style("border-width", "2px")
            .style("border-style", "solid")
            .style("border-color", "darkblue");

        this.great_g = svg.append("g").attr("transform", "translate(" + margin + "," + margin + ")");
    }

    clear_all() {
        this.great_g.html("");
    }

    clear(id) {
        d3.select("svg #" + id).remove();
    }

    draw_line(id, points) {
        var lines = this.great_g.append("g").attr("id", id);

        var xscale = this.xscale;
        var yscale = this.yscale;

        var valueline = d3.line()
            .x(function (d) {
                return xscale(d[0]);
            })
            .y(function (d) {
                return yscale(d[1]);
            });

        lines
            .append("path")
            .attr("fill", "transparent")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", valueline(points));
    }

    draw_circle(id, x, y, r) {
        var circle_g = this.great_g.append("g").attr("id", id);

        circle_g.append("circle")
            .attr("cx", this.xscale(x))
            .attr("cy", this.yscale(y))
            .attr("r", (this.xscale(r) + this.yscale(r)) / 2)
    }

    draw_square(id, x, y, l) {
        var square_g = this.great_g.append("g").attr("id", id);

        square_g.append("rect")
            .attr("x", this.xscale(x))
            .attr("y", this.yscale(y))
            .attr("width", (this.xscale(l) + this.yscale(l)) / 2)
            .attr("height", (this.xscale(l) + this.yscale(l)) / 2)
            .attr("fill", "green");
    }
}