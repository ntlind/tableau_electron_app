import { useEffect, useState, useRef, useCallback } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import useClickOutside from "./Utilities/useClickOutside";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  BiChevronsDown,
  BiArrowFromLeft,
  BiArrowFromTop,
} from "react-icons/bi";
import { BsSquareFill } from "react-icons/bs";

import classNames from "./Utilities/classNames";

interface IProps {
  alignTextRight?: boolean;
  options: any;
  selected: any;
  data: any;
  setData: any;
}

let lookupNextStep = {
  xAxis_gradient: { next: "yAxis_gradient", icon: <BiArrowFromLeft /> },
  yAxis_gradient: { next: "solid", icon: <BiArrowFromTop /> },
  solid: { next: "xAxis_gradient", icon: <BsSquareFill /> },
};

function ColorDropdown({
  options,
  data,
  setData,
  alignTextRight = false,
  iconMap = null,
}: IProps) {
  let [selection, setSelection] = useState(options[0]);

  useEffect(() => {}, []);

  return (
    <Menu as="div" className="relative inline-block text-left w-[80%] z-50">
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md shadow-sm border-zinc-300 whitespace-nowrap text-ellipsis dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white ocus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-500 focus:ring-theme">
          {data.style.selectedPalette}
          <BiChevronsDown className="w-5 h-5 ml-2 -mr-1 " aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={
            alignTextRight
              ? "absolute right-0 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none"
              : "absolute left-0 mt-2 origin-top-left bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none"
          }
        >
          <div className="py-1 bg-white dark:bg-zinc-800">
            {/* @ts-ignore */}
            {options.map((option, index) => (
              <Menu.Item key={option}>
                {({ active }) => (
                  <div
                    className={classNames(
                      active
                        ? "bg-zinc-100 text-gray-900 dark:bg-zinc-700"
                        : "text-gray-700 dark:bg-zinc-800",
                      "px-3 py-2 text-sm w-full text-left flex flex-row dark:text-white rounded-xl hover:cursor-pointer"
                    )}
                    onClick={(e) => {
                      let newStyle = { ...data.style };
                      newStyle.selectedPalette = e.target.innerText;
                      newStyle.colors = newStyle.palettes[e.target.innerText];
                      setData({ ...data, style: newStyle });
                    }}
                  >
                    {option}
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default function ColorPickerWidget({
  data,
  setData,
  icon,
}: {
  data: any;
  setData: any;
  icon: any;
}) {
  const [showPicker, setShowPicker] = useState<any>(false);
  const [showMenu, setShowMenu] = useState(false);
  const popover = useRef(null);

  let paletteChoices = Object.keys(data.style.palettes).map(
    (key, index) => key
  );

  useEffect(() => {}, [showMenu, showPicker, data]);

  const close = useCallback(() => {
    let newColors = data.style.colors.filter(
      (x: string) => !data.style.recentColors.includes(x)
    );
    if (newColors.length > 0) {
      let newStyle = { ...data.style };
      newColors.forEach((element: string) => {
        newStyle.recentColors.unshift(element);
        newStyle.recentColors.pop();
      });
      setData({ ...data, style: newStyle });
    }
    setShowMenu(false);
    setShowPicker(false);
  }, [data]);
  useClickOutside(popover, close);

  function customColorPicker({
    data,
    setData,
    colorIndex,
  }: {
    data: any;
    setData: any;
    colorIndex: number;
  }) {
    return (
      <div>
        <HexColorPicker
          color={data.style.colors[colorIndex]}
          onChange={(e) => {
            let updatedStyle = { ...data.style };
            updatedStyle.colors[colorIndex] = e;
            setData({ ...data, style: updatedStyle });
          }}
        />
        <div className="flex flex-row items-center justify-between px-2 bg-white">
          <div className="flex flex-row items-center justify-start">
            <div
              className="w-4 h-4 mr-1"
              style={{ background: data.style.colors[colorIndex] }}
            ></div>
            <HexColorInput
              className="w-16 text-center uppercase"
              color={data.style.colors[colorIndex]}
              onChange={(e) => {
                let updatedStyle = { ...data.style };
                updatedStyle.colors[colorIndex] = e;
                setData({ ...data, style: updatedStyle });
              }}
            />{" "}
          </div>
          <div className="flex flex-row items-center justify-end">
            {data.style.recentColors.map((color: string) => (
              <button
                key={color}
                className="w-4 h-4 mr-1"
                style={{ background: color }}
                onClick={(e) => {
                  let updatedStyle = { ...data.style };
                  updatedStyle.colors[colorIndex] = color;
                  setData({ ...data, style: updatedStyle });
                }}
              ></button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative px-2 py-1 border rounded shadow-inner hover:cursor-pointer border-zinc-300 dark:hover:bg-zinc-700 dark:bg-zinc-800"
      onClick={(e) => setShowMenu(true)}
    >
      <div className="flex flex-col items-center justify-center space-y-[.1rem] dark:text-white text-zinc-900  border-zinc-300">
        {icon}
        <span
          className="w-4 h-[.4rem] rounded-sm border-zinc-500 dark:border-none"
          style={{
            backgroundImage: `linear-gradient(to right, ${data.style.colors[0]} , ${data.style.colors[1]})`,
          }}
        ></span>
      </div>
      <div className="absolute -left-20 top-10 w-[200px]">
        {showMenu && (
          <div ref={popover} className="cursor-default">
            <div
              className="flex flex-row p-1 space-x-1"
              style={{
                backgroundImage: `linear-gradient(to right, ${data.style.colors[0]} , ${data.style.colors[1]})`,
              }}
            >
              <ColorDropdown
                options={paletteChoices}
                selected={paletteChoices[0]}
                data={data}
                setData={setData}
              />
              <button
                className="relative px-1 border rounded-md shadow-inner border-zinc-300 bg-white dark:bg-zinc-800 dark:hover:bg-zinc-700 w-[20%]"
                onClick={(e) => {
                  let newStyle = { ...data.style };
                  //@ts-ignore
                  newStyle.colorScale =
                    lookupNextStep[data.style.colorScale].next;
                  setData({ ...data, style: newStyle });
                }}
              >
                <div className="flex flex-col items-center justify-center dark:text-white text-zinc-900">
                  {lookupNextStep[data.style.colorScale].icon}
                </div>
              </button>
            </div>
            <div className="flex flex-row">
              <button
                className="w-1/3 h-8"
                style={{ background: data.style.colors[0] }}
                onClick={(e) => setShowPicker(0)}
              >
                <span className="text-white mix-blend-difference">Primary</span>
              </button>
              <button
                className="w-1/3 h-8"
                style={{ background: data.style.colors[1] }}
                onClick={(e) => setShowPicker(1)}
              >
                <span className="text-white mix-blend-difference">Second.</span>
              </button>
              <button
                className="w-1/3 h-8"
                style={{ background: data.style.colors[2] }}
                onClick={(e) => setShowPicker(2)}
              >
                <span className="text-white mix-blend-difference">Accent</span>
              </button>
            </div>
            {typeof showPicker === "number" &&
              customColorPicker({
                data: data,
                setData: setData,
                colorIndex: showPicker,
              })}
          </div>
        )}
      </div>
    </div>
  );
}
