"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "../layout/AbsoluteSurface", "../chart/Pie", "../map/ChoroplethStates", "../chart/Column", "../common/Text", "css!./Layered"], factory);
    } else {
        root.form_Form = factory(root.d3, root.common_HTMLWidget, root.layout_AbsoluteSurface, root.chart_Pie, root.map_ChoroplethStates, root.chart_Line, root.common_Text);
    }
}(this, function (d3, HTMLWidget, AbsoluteSurface, Pie, ChoroplethStates, Line, Text) {
    function Layered() {
        HTMLWidget.call(this);

        this._tag = "div";
    }
    Layered.prototype = Object.create(HTMLWidget.prototype);
    Layered.prototype.constructor = Layered;
    Layered.prototype._class += " layout_Layered";

    Layered.prototype.publish("padding", 0, "number", "Padding");

    Layered.prototype.publish("widgets", [], "widgetArray", "widgets", null, { tags: ["Private"] });

    Layered.prototype.testData = function () {
        this
            .addLayer(new AbsoluteSurface().widgetX(0).widgetY(0).widgetWidth(100).widgetHeight(100).widget(new Line().testData()))
            .addLayer(new AbsoluteSurface().widgetX(40).widgetY(40).widgetWidth(50).widgetHeight(50).opacity(0.66).widget(new Pie().testData()))
            .addLayer(new AbsoluteSurface().widgetX(30).widgetY(10).widgetWidth(40).widgetHeight(30).widget(new ChoroplethStates().testData()))
        ;
        var context = this;
        setInterval(function () {
            context.widgets().sort(function (l, r) {
                if (Math.random() < 0.5) {
                    return -1;
                }
                return 1;
            });
            context.render();
        }, 3000);
        return this;
    };

    Layered.prototype.addLayer = function(widget) {
        var widgets = this.widgets();
        widgets.push(widget ? widget : new Text().text("No widget defined for layer."));
        this.widgets(widgets);
        return this;
    };

    Layered.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        this._contentContainer = element.append("div")
            .attr("class", "container")
        ;
    };

    Layered.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var context = this;

        element.style("padding", this.padding() + "px");

        var content = this._contentContainer.selectAll(".content.id" + this.id()).data(this.widgets(), function (d) { return d.id(); });
        content.enter().append("div")
            .attr("class", "content id" + this.id())
            .each(function (widget, idx) {
                widget.target(this);
            })
        ;
        content
            .each(function (widget, idx) {
                widget.resize({ width: context.clientWidth(), height: context.clientHeight() }).render();
            })
        ;
        content.exit()
            .each(function (widget, idx) {
                widget
                    .target(null)
                ;
            })
            .remove()
        ;
        content.order();
    };

    return Layered;
}));
