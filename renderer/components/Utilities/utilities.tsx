import BarChart from "../D3/BarChart";
import StackedBarChart from "../D3/StackedBarchart";
import HorizontalBarChart from "../D3/HorizontalBarChart";
import HorizontalStackedBarChart from "../D3/HorizontalStackedBarChart";
import { useState } from "react";

import Dropzone from "react-dropzone";
import { HiUpload } from "react-icons/hi";
import * as d3 from "d3";

import LoadD3File from "../LoadD3File";

interface IProps {
  state: any;
  data: any;
}

function getArrayItems({ state, index }: { state: any; index: number }) {
  return state && state[index]?.map((element: any) => element.content);
}

function getRows({ state }: { state: any }) {
  return getArrayItems({ state: state, index: 2 });
}

function getRowDimensions({ state, data }: { state: any; data: any }) {
  return new Set(
    getRows({ state: state })?.map(
      (row: string) => data.cols[row].classification
    )
  );
}

function getColumnDimensions({ state, data }: { state: any; data: any }) {
  return new Set(
    getColumns({ state: state })?.map(
      (row: string) => data.cols[row].classification
    )
  );
}

function getColumns({ state }: { state: any }) {
  return getArrayItems({ state: state, index: 3 });
}

function getGroupers({ state }: { state: any }) {
  return getArrayItems({ state: state, index: 4 });
}

function getSelectionDimensions({ state, data }: { state: any; data: any }) {
  return (
    getArrayItems({ state: state, index: 2 }) &&
    getArrayItems({ state: state, index: 2 })
      .concat(getArrayItems({ state: state, index: 3 }))
      .map(
        (element: any) =>
          data.cols && data.cols[element] && data.cols[element].classification
      )
  );
}

function getMetricsAndDimensions({ state: state, data: data }: IProps) {
  let rowDimensions = getRowDimensions({ state: state, data: data });
  let colDimensions = getColumnDimensions({ state: state, data: data });

  let dimensions =
    rowDimensions.has("dimension") && rowDimensions.size == 1
      ? getRows({ state: state })
      : colDimensions.has("dimension") && colDimensions.size == 1
      ? getColumns({ state: state })
      : null;

  let metrics =
    rowDimensions.has("metric") && rowDimensions.size == 1
      ? getRows({ state: state })
      : colDimensions.has("metric") && colDimensions.size == 1
      ? getColumns({ state: state })
      : null;

  return { dimensions: dimensions, metrics: metrics };
}

export function aggregateData({
  data,
  state,
  operation = "sum",
}: {
  data: any;
  state: any;
  operation: string;
}) {
  let metricDict = getMetricsAndDimensions({ state: state, data: data });

  let dimensions = metricDict["dimensions"];
  let metrics = metricDict["metrics"];

  let operation_map: any = {
    sum: d3.sum,
  };

  if (dimensions?.length > 0 && metrics?.length > 0) {
    let results = d3.flatRollup(
      data.data,
      (row: any) => operation_map[operation](row, (d: any) => d[metrics]),
      ...dimensions.map((k: any) => (d: any) => d[k])
    );

    let col_names = Array.prototype.concat(dimensions, [metrics]);
    const flattened = results?.map((e) => {
      let result_obj: any = {};
      col_names.map((f, index) => {
        result_obj[f] = e[index];
      });

      return result_obj;
    });

    return flattened;
  } else {
    return null;
  }
}

export function renderOrientedBarChart({
  state,
  data,
}: {
  state: any;
  data: any;
}) {
  let colDimensions = getColumnDimensions({ state: state, data: data });
  let rowDimensions = getRowDimensions({ state: state, data: data });

  if (
    data.style.chartType == "BarChart" &&
    colDimensions.has("dimension") &&
    !colDimensions.has("metric") &&
    rowDimensions.has("metric") &&
    !rowDimensions.has("dimension")
  ) {
    let cols = getColumns({ state: state, data: data });
    let rows = getRows({ state: state, data: data });

    let firstCol = cols.shift();

    if (cols.length > 1) {
      return null;
    } else if (cols == undefined || cols.length == 1) {
      return (
        <StackedBarChart
          data={data}
          xVar={firstCol}
          yVar={rows[0]}
          grouper={cols}
        />
      );
    } else {
      return <BarChart data={data} xVar={firstCol} yVar={rows[0]} />;
    }
  } else if (
    data.style.chartType == "BarChart" &&
    !colDimensions.has("dimension") &&
    colDimensions.has("metric") &&
    !rowDimensions.has("metric") &&
    rowDimensions.has("dimension")
  ) {
    let cols = getColumns({ state: state, data: data });
    let rows = getRows({ state: state, data: data });

    let firstRow = rows.shift();

    if (rows.length > 1) {
      return null;
    } else if (cols == undefined || rows.length == 1) {
      return (
        <HorizontalStackedBarChart
          data={data}
          xVar={cols[0]}
          yVar={firstRow}
          grouper={rows}
        />
      );
    } else {
      return <HorizontalBarChart data={data} xVar={cols[0]} yVar={firstRow} />;
    }
  }

  return null;
}

export function DropZoneComponent({
  data,
  setData,
}: {
  data: any;
  setData: any;
}) {
  return (
    <Dropzone
      maxFiles={1}
      // noClick={true}
      // noDrag={true}
      maxSize={1024 * 1024 * 50}
      // accept=".csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain, application/vnd.ms-excel"
      onDrop={async ([file]) => {
        var reader = new FileReader();
        reader.onload = function (e) {
          var contents = e && e.target?.result;

          let csv = LoadD3File(contents as string).then((response: any) => {
            setData({
              ...data,
              data: response["array"],
              cols: response["col_obj"],
              classifications: response["classification_obj"],
            });
          });
        };
        reader.readAsDataURL(file);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div className="h-full col-span-12 lg:col-span-3">
          <section className="flex items-center justify-center w-full h-full mt-4 border-2 border-dashed border-zinc-400 lg:mt-0">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center h-full text-center">
                <HiUpload className="w-20 h-20 mb-3 opacity-50 fill-zinc-500" />
                <div className="text-xl font-semibold xl:text-2xl">
                  Click or drop files here.
                </div>
                <div className="mx-4 mt-2 text-zinc-500">
                  Accepted formats are csv and xlsx
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </Dropzone>
  );
}
