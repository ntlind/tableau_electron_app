import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronsDown } from "react-icons/bi";
import classNames from "../Utilities/classNames";

interface IProps {
  alignTextRight?: boolean;
  options: any;
  selected: any;
  data: any;
  setData: any;
  iconMap: any;
}

export default function Listbox({
  options,
  selected,
  data,
  setData,
  alignTextRight = false,
  iconMap = null,
}: IProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-zinc-300 rounded-md shadow-sm dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white ocus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-500 focus:ring-theme">
          {selected}
          <BiChevronsDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
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
                  <button
                    className={classNames(
                      active
                        ? "bg-zinc-100 text-gray-900 dark:bg-zinc-700"
                        : "text-gray-700 dark:bg-zinc-800",
                      "px-3 py-2 text-sm w-full text-left flex flex-row dark:text-white rounded-xl"
                    )}
                    // @ts-ignore
                    onClick={(e) =>
                      setData({ ...data, chartType: e.target.innerText })
                    }
                  >
                    {iconMap && iconMap[selected]}
                    {option}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
