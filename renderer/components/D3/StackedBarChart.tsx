import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useWidth } from "../Utilities/useWidth";

interface IProps {
  data: any;
  xVar: string;
  yVar: string;
  grouper?: Array<string>;
}

export default function BarChart({ data, xVar, yVar, grouper }: IProps) {
  const rerenderFlag = useWidth();
  const d3Container = useRef(null);
  const parentRef = useRef(null);
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
  let tickCriteria = yValues.length > 100 ? 4 : 2;

  useEffect(() => {
    let grouperSet = [...new Set(data.aggData.map((x) => x[grouper]))];
    const zMap = grouperSet.reduce((a, v, i) => ({ ...a, [v]: i }), {});
    var colorScale = d3
      .scaleLinear()
      .range(data.style.colors.slice(0, 2))
      .domain([0, grouperSet.length]);

    let margin = { top: 80, right: 50, bottom: 50, left: 80 };

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

      // X axis
      var x = d3
        .scaleBand()
        .range([0, width - margin.right])
        .domain(xValues)
        .padding(0.2);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(
          d3.axisBottom(x).tickValues(
            x.domain().filter(function (e, d) {
              return !(d % 10);
            })
          )
        )
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Add Y axis
      var y = d3
        .scaleLinear()
        .domain([0, Math.max.apply([], yValues)])
        .range([height - margin.bottom, 0]);
      svg.append("g").call(d3.axisLeft(y).ticks(10));

      // Bars
      svg
        .selectAll("barchart")
        .data(data.aggData)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d[xVar]);
        })
        .attr("width", x.bandwidth())
        .attr("fill", (i) => {
          // @ts-ignore
          return colorScale(zMap[i[grouper[0]]]);
        })
        .attr("height", function (d) {
          return height - y(d[yVar]);
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
        .append("title")
        .text((d: any) => `${xVar}: ${d[xVar]}; ${yVar}: ${d[yVar]}`);

      // yAxis Label
      svg
        .append("foreignObject")
        .attr("transform", "rotate(-90)")
        .attr("width", height)
        .attr("height", 24)
        .attr("dy", "1em")
        .attr("y", 0 - margin.left - 5)
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
        .attr("y", height + 60)
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

      // Legend
      let legend = svg
        .selectAll(".legend")
        .data(grouperSet.slice())
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(" + (width - 30) + ", " + i * 20 + ")";
        });

      legend
        .append("rect")
        .attr("x", 10)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (i) => {
          return colorScale(zMap[i]);
        });

      legend
        .append("text")
        .attr("x", 40)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) {
          return d;
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
            borderColor: "#ccc",
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
            left: meta.xHover + 10,
            top: meta.yHover - 25,
            borderColor: "#ccc",
          }}
        >
          {meta.hoverMessage.map((e: any, index: any) => {
            let indexLookup = {
              0: yVar,
              1: xVar,
            };
            return (
              <span key={e}>
                <span className="font-medium">
                  {indexLookup[index] || "grouper"}:
                </span>{" "}
                {e}
              </span>
            );
          })}
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
