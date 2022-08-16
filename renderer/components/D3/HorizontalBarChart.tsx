import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useWidth } from "../Utilities/useWidth";

interface IProps {
  data: any;
  xVar: string;
  yVar: string;
}

export default function BarChart({ data, xVar, yVar }: IProps) {
  const d3Container = useRef(null);
  const parentRef = useRef(null);
  const rerenderFlag = useWidth();
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const [meta, setMeta] = useState({
    title: `${xVar} on ${yVar}`,
    xLabel: xVar,
    yLabel: yVar,
    xPopUp: null,
    yPopUp: null,
    popUpMessage: "Type your message here",
    hoverMessage: null,
    xHover: null,
    yHover: null,
  });

  let xValues = data.aggData.map((e: any) => e[xVar]);
  let yValues = data.aggData.map((e: any) => e[yVar]);
  let fontSize = "12px";
  let axisLabelFontSize = "16px";
  let accentColor = data.style.colors[2];
  let tickCriteria = xValues.length > 100 ? 4 : 2;

  useEffect(() => {
    let margin = { top: 60, right: 30, bottom: 60, left: 120 };

    setHeight(parentRef.current.offsetHeight - margin.top - margin.bottom);
    setWidth(parentRef.current.offsetWidth - margin.left - margin.right);

    d3.select("g").remove();
    if (data && d3Container.current && height) {
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // xAxis
      var x = d3
        .scaleLinear()
        .domain([0, Math.max.apply([], xValues)])
        .range([0, width]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // yAxis
      var y = d3.scaleBand().range([0, height]).domain(yValues).padding(0.2);
      svg.append("g").call(
        d3.axisLeft(y).tickValues(
          y.domain().filter(function (e, d) {
            return !(d % 30);
          })
        )
      );

      // Color
      let colorVar;
      if (data.style.colorScale === "xAxis_gradient") {
        svg
          .append("linearGradient")
          .attr("id", "line-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .selectAll("stop")
          .data([
            { offset: "0%", color: data.style.colors[0] },
            { offset: "100%", color: data.style.colors[1] },
          ])
          .enter()
          .append("stop")
          .attr("offset", function (d: any) {
            return d.offset;
          })
          .attr("stop-color", function (d: any) {
            return d.color;
          });

        colorVar = "url(#line-gradient)";
      } else if (data.style.colorScale === "yAxis_gradient") {
        svg
          .append("linearGradient")
          .attr("id", "line-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", "100%")
          .selectAll("stop")
          .data([
            { offset: "0%", color: data.style.colors[0] },
            { offset: "100%", color: data.style.colors[1] },
          ])
          .enter()
          .append("stop")
          .attr("offset", function (d: any) {
            return d.offset;
          })
          .attr("stop-color", function (d: any) {
            return d.color;
          });

        colorVar = "url(#line-gradient)";
      } else {
        colorVar = Array.isArray(data.style.colors)
          ? data.style.colors[0]
          : data.style.colors;
      }

      // Bars
      svg
        .selectAll("hbarchart")
        .data(data.aggData)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(0);
        })
        .attr("y", function (d) {
          return y(d[yVar]);
        })
        // disabled as it conflicts with hoverover features
        // .on("click", function (e) {
        //   //@ts-ignore
        //   if (d3.select(this).style("fill") == accentColor) {
        //     //@ts-ignore
        //     d3.select(this).style("fill", colorVar);
        //   } else {
        //     //@ts-ignore
        //     d3.select(this).style("fill", accentColor);
        //   }
        // })
        // Hoverovers
        .on("mouseover", function (e, d) {
          setMeta({
            ...meta,
            hoverMessage: [d[yVar], d[xVar]],
            xHover: e.x,
            yHover: e.y,
          });
        })
        .on("mouseout", function (e, d) {
          setMeta({ ...meta, hoverMessage: null, xHover: null, yHover: null });
        })
        .attr("width", function (d) {
          return x(d[xVar]);
        })
        .attr("height", y.bandwidth()) // always equal to 0
        .attr("fill", colorVar)

        // Tooltip
        .append("title")
        .text((d) => `${xVar}: ${d[xVar]}; ${yVar}: ${d[yVar]}`);

      // yAxis Label
      svg
        .append("foreignObject")
        .attr("transform", "rotate(-90)")
        .attr("width", height)
        .attr("height", 24)
        .attr("dy", "1em")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - height)
        .append("xhtml:body")
        .attr("xmlns", "http://www.w3.org/1999/xhtml")
        .html(
          `<div id='yLabel' contenteditable="true" style='font-size:${axisLabelFontSize}; text-align:center; width:100%; height:100%; background-color:transparent'>${meta.yLabel}</div>`
        )
        .on("keydown", (e: any) => {
          if (e.key == "Enter") {
            setMeta({ ...meta, yLabel: e.srcElement.innerText });
          }
        });

      // xAxis Label
      svg
        .append("foreignObject")
        .attr("width", width)
        .attr("height", 24)
        .attr("x", 0)
        .attr("y", height + 30)
        .append("xhtml:body")
        .attr("xmlns", "http://www.w3.org/1999/xhtml")
        .html(
          `<div id='xLabel' contenteditable="true" style='font-size:${axisLabelFontSize}; text-align:center; width:100%; height:100%; background-color:transparent'>${meta.xLabel}</div>`
        )
        .on("keydown", (e: any) => {
          if (e.key == "Enter") {
            setMeta({ ...meta, xLabel: e.srcElement.innerText });
          }
        });

      // Title
      svg
        .append("foreignObject")
        .attr("width", width)
        .attr("height", 24)
        .attr("x", 0)
        .attr("y", -28)
        .append("xhtml:body")
        .attr("xmlns", "http://www.w3.org/1999/xhtml")
        .html(
          `<div id='title' contenteditable="true" style='font-size:${axisLabelFontSize}; text-align:center; width:100%; height:100%; background-color:transparent'>${meta.title}</div>`
        )
        .on("keydown", (e: any) => {
          if (e.key == "Enter") {
            setMeta({ ...meta, title: e.srcElement.innerText });
          }
        });

      svg.exit().remove();
    }
  }, [data, d3Container.current, parentRef, meta, rerenderFlag]);

  return (
    <div ref={parentRef} className="w-full h-full">
      {meta.xPopUp != null && meta.yPopUp != null ? (
        <div
          id="popup"
          className="absolute flex items-center justify-center w-48 p-2 overflow-auto text-center break-words bg-transparent bg-white border rounded shadow resize-none hover:resize dark:bg-zinc-800"
          style={{
            left: meta.xPopUp,
            top: meta.yPopUp,
            borderColor: accentColor,
          }}
          contentEditable={true}
          onKeyDown={(e: any) => {
            if (e.key == "Enter") {
              setMeta({
                ...meta,
                popUpMessage: e.nativeEvent.srcElement.innerText,
              });
            }
          }}
          onClick={(e: any) => {
            if (e.shiftKey) {
              setMeta({ ...meta, xPopUp: null, yPopUp: null });
            }
          }}
        >
          {meta.popUpMessage}
        </div>
      ) : null}
      {meta.hoverMessage != null ? (
        <div
          className="absolute flex flex-col p-2 space-y-2 bg-white border rounded dark:bg-zinc-800"
          style={{
            left: meta.xHover,
            top: meta.yHover - 25,
            borderColor: accentColor,
          }}
        >
          <span>
            <span className="font-medium">{yVar}:</span> {meta.hoverMessage[0]}
          </span>
          <span>
            <span className="font-medium">{xVar}:</span> {meta.hoverMessage[1]}
          </span>
        </div>
      ) : null}
      <svg
        className="w-full h-full d3-component"
        ref={d3Container}
        onClick={(e) => {
          if (e.shiftKey) {
            setMeta({ ...meta, xPopUp: e.clientX, yPopUp: e.clientY });
          }
        }}
        onMouseOut={(e) => {
          setMeta({ ...meta, hoverMessage: null });
        }}
      />
    </div>
  );
}
