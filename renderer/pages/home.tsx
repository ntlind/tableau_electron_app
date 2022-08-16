import type { NextPage } from "next";
import Head from "next/head";
import DataSelector from "../components/SideBar";
import { useEffect, useState, useRef } from "react";
import HeaderBar from "../components/HeaderBar";
import DataTable from "../components/DataTable";
import {
  aggregateData,
  renderOrientedBarChart,
  DropZoneComponent,
} from "../components/Utilities/utilities";
import * as d3 from "d3";

let colorScaleOptions = ["xAxis_gradient", "yAxis_gradient", "solid"];
let defaultStyle = {
  chartType: "BarChart",
  colorScale: colorScaleOptions[0],
  selectedPalette: "Blues",
  palettes: {
    Tableau: d3.schemeTableau10, // note: have to update colors below as well
    Blues: d3.schemeBlues[3],
    Greens: d3.schemeGreens[3],
    "Orange to Red": d3.schemeOrRd[3],
    "Purple to Blue": d3.schemePuBu[3],
    "Yellow to Purple": ["#FFFF00", "#9F2B68", "#ff0000"],
    "Grey Monochrome": ["#ccc", "#808080", "#ff0000"],
    Pastel: [
      "#A1C9F4",
      "#FFB482",
      "#8DE5A1",
      "#FF9F9B",
      "#D0BBFF",
      "#DEBB9B",
      "#FAB0E4",
      "#CFCFCF",
      "#FFFEA3",
      "#B9F2F0",
    ],
  },
  colors: d3.schemeBlues[3],
  recentColors: ["#ff562e", "#0000bb", "#bb0091", "#f8005e"],
};

const Home: NextPage = () => {
  const isMounted = useRef(false);
  const [state, setState] = useState<any>([]);
  const [dark, setDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<any>({
    data: null,
    aggData: null,
    cols: {},
    classifications: null,
    style: defaultStyle,
  });

  useEffect(() => {
    if (data.data != null && isLoaded == false) {
      setIsLoaded(true);
    }

    if (data.data != null) {
      let aggregatedData = aggregateData({
        data: data,
        state: state,
        operation: "sum",
      });
      if (aggregatedData?.length != data.aggData?.length) {
        setData({ ...data, aggData: aggregatedData });
      }
    }

    return () => {
      isMounted.current = false;
    };
  }, [state, data]);

  return (
    <div>
      <Head>
        <title>Tableau Webapp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={dark ? "w-screen h-screen dark" : "w-screen h-screen"}>
        <DataSelector
          state={state}
          setState={setState}
          data={data}
          setData={setData}
        />
        <HeaderBar
          isOn={dark}
          setIsOn={(e: any) => setDark(e)}
          data={data}
          setData={setData}
          state={state}
          setState={setState}
        />
        <div className="grid h-full grid-rows-4 bg-transparent ml-60 dark:bg-zinc-900 dark:text-white">
          <div className="w-full row-span-3 p-12">
            {data.aggData ? (
              renderOrientedBarChart({ state: state, data: data })
            ) : (
              <DropZoneComponent />
            )}
          </div>
          <div className="relative row-span-1 overflow-x-auto border-t border-zinc-200">
            {data.data && <DataTable array={data.data} />}
          </div>
        </div>
      </main>
      {/* 
      <footer className='flex items-center ml-60 h-screen-1/12'>
        graphic
      </footer> */}
    </div>
  );
};

export default Home;