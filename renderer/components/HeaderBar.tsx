import { useEffect, useState, useRef, useCallback } from "react";
import { ImParagraphLeft } from "react-icons/im";
import { BsPaintBucket } from "react-icons/bs";
import Switch from "../components/ToggleSwitch";
import Listbox from "./Listboxes/Listbox";
import ColorPickerWidget from "../components/ColorPicketWidget";
import LoadD3File from "./LoadD3File";

export default function HeaderBar({
  isOn,
  setIsOn,
  data,
  setData,
  state,
  setState,
}: {
  isOn: boolean;
  setIsOn: any;
  data: any;
  setData: any;
  state: any;
  setState: any;
}) {
  let iconList = getChartIconList();
  let typeChoices = Object.keys(iconList).map((key, index) => key);

  return (
    <div className="fixed w-full pr-4 h-14 pl-60">
      <div className="flex flex-row items-center justify-between h-full px-2 py-4 pl-6 space-x-2">
        <div className="flex flex-row w-full space-x-4">
          <Listbox
            options={typeChoices}
            selected={data.style.chartType}
            data={data}
            setData={setData}
            iconMap={iconList}
          />
          <ColorPickerWidget
            data={data}
            setData={setData}
            icon={<BsPaintBucket className="w-5 h-5" />}
          />
          <button
            className="theme-button-outline"
            onClick={(e) => {
              LoadD3File("/hierarchical_retail_sales.csv").then(
                (response: any) => {
                  setData({
                    ...data,
                    data: response["array"],
                    cols: response["col_obj"],
                    classifications: response["classification_obj"],
                  });
                }
              );
            }}
          >
            Load test data
          </button>
          <button
            className="theme-button-outline"
            onClick={(e) => {
              LoadD3File("/hierarchical_retail_sales.csv").then(
                (response: any) => {
                  setData({
                    ...data,
                    data: response["array"],
                    cols: response["col_obj"],
                    classifications: response["classification_obj"],
                  });
                  setState([
                    [],
                    [],
                    [
                      {
                        content: "datetime",
                        id: "item-datetime0-1658126461166",
                        type: "string",
                      },
                      {
                        content: "state",
                        id: "item-state0-1658126461166",
                        type: "string",
                      },
                    ],
                    [
                      {
                        content: "sales",
                        id: "item-sales0-1658126461166",
                        type: "number",
                      },
                    ],
                  ]);
                }
              );
            }}
          >
            Load test data and set state
          </button>
        </div>
        <Switch isOn={isOn} setIsOn={(e: any) => setIsOn(e)} />
      </div>
    </div>
  );
}

export function getChartIconList() {
  let iconClass = "h-5 w-5 stroke-1 text-theme mr-2 dark:text-sky-200";

  let iconMap = {
    BarChart: <ImParagraphLeft className={iconClass} />,
  };
  return iconMap;
}
