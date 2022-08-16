import { type } from "os";
import { useEffect, useState, useRef } from "react";
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getIndexOfString,
  copy,
  move,
  getItems,
  reorder,
  fetchData,
  getTypeIconList,
} from "./DragAndDrop/DragAndDrop";
import CustomListBox from "./Listboxes/IconListbox";
import classNames from "./Utilities/classNames";

let dataURL = {
  line: "https://raw.githubusercontent.com/facebook/prophet/main/examples/example_retail_sales.csv",
  bar: "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv",
};

interface IProps {
  state: any;
  setState: any;
  data: any;
  setData: any;
}

export default function DataSelector({
  state,
  setState,
  data,
  setData,
}: IProps) {
  let isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      // fetchData(dataURL.bar, data, setData)
      isInitialMount.current = false;
    }
    if (data.classifications && state.length === 0) {
      let metric_array = data.classifications!["metric"];
      let dimension_array = data.classifications!["dimension"];
      setState([
        ...state,
        metric_array ? getItems(metric_array) : Array(),
        dimension_array ? getItems(dimension_array) : Array(),
        [],
        [],
        [],
      ]);
    }
  }, [data, state]);

  function onDragEndDuplicate(result: any) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState: any = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      let result: any = move(state[sInd], state[dInd], source, destination);
      const newState: any = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  }

  let iconList = getTypeIconList();
  let typeChoices = Object.keys(iconList).map((key, index) => ({
    value: key,
    id: index,
  }));

  function updateType(e: any, content: string) {
    let newData = data;
    newData.cols[content].type = e;
    setData({ ...newData });
  }
  return (
    <div className="fixed left-0 z-10 flex flex-col justify-between h-screen border-r border-gray-200 w-60 bg-zinc-50 dark:bg-zinc-900 dark:text-white">
      <div className="px-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="py-4 pb-6 text-xl font-bold tracking-wider">
              graphik
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEndDuplicate}>
            {/* Metrics & Dimensions */}
            {state.slice(0, 2).map((el: any, ind: number) => (
              <Droppable
                key={ind}
                droppableId={`${ind}`}
                isDropDisabled={false}
              >
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    className={classNames(
                      snapshot.isDraggingOver
                        ? "bg-blue-50 p-4 pb-6 dark:bg-zinc-500"
                        : "dark:bg-zinc-900",
                      "p-4 pb-6"
                    )}
                    {...provided.droppableProps}
                  >
                    <div className="font-bold dark:text-white">
                      {
                        {
                          0: "Metrics",
                          1: "Dimensions",
                        }[ind]
                      }
                    </div>
                    {el.map((item: any, index: number) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={classNames(
                              snapshot.isDragging &&
                                "bg-blue-900 dark:bg-zinc-500 text-white",
                              "select-none py-2  px-1 rounded-xl"
                            )}
                          >
                            <div className="flex flex-row items-center">
                              <div className="pr-2">
                                <CustomListBox
                                  id={`item-${
                                    item.content
                                  }-${new Date().getTime()}`}
                                  choices={typeChoices}
                                  selected={data.cols[item.content]?.type}
                                  onChange={(e) => updateType(e, item.content)}
                                  iconMap={iconList}
                                />
                              </div>
                              {item.content}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
            <div className={"border-t-2 border-gray-200 pt-6"}></div>
            {/* Other Droppable Areas */}
            {state.slice(2, 5).map((el: any, ind: number) => (
              <Droppable
                key={ind + 2}
                droppableId={`${ind + 2}`}
                isDropDisabled={false}
              >
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    className={classNames(
                      snapshot.isDraggingOver
                        ? "bg-blue-50 p-4 pb-6 dark:bg-zinc-500"
                        : "dark:bg-zinc-900",
                      "p-4 pb-6"
                    )}
                    {...provided.droppableProps}
                  >
                    <div className="font-bold dark:text-white">
                      {
                        {
                          0: "Rows (Y-Axis)",
                          1: "Columns (X-Axis)",
                          2: "Groupers",
                        }[ind]
                      }
                    </div>
                    {el.map((item: any, index: number) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={classNames(
                              snapshot.isDragging &&
                                "bg-blue-900 dark:bg-zinc-500 text-white",
                              "select-none py-2  px-1 rounded-xl"
                            )}
                          >
                            <div className="flex flex-row items-center">
                              <div className="pr-2">
                                <CustomListBox
                                  id={`item-${
                                    item.content
                                  }-${new Date().getTime()}`}
                                  choices={typeChoices}
                                  selected={data.cols[item.content]?.type}
                                  onChange={(e) => updateType(e, item.content)}
                                  iconMap={iconList}
                                />
                              </div>
                              {item.content}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
            {/* TODO make it so you can throw away items by dragging them outside of the draggable */}
            {/* TODO only allow an entry to appear in one droppable */}
            {/* TODO turn the filters, colors, and sizes into boxes */}
            {/* <button className='absolute z-10 theme-button rounded left-[4.5rem] bottom-6 w-24' onClick={(e) => setState([state[0], state[1], [], [], []])}>Reset</button> */}
          </DragDropContext>
        </div>
      </div>
      <button className="flex flex-row items-center justify-center h-24 border-t-[.5px] border-zinc-200 hover:bg-zinc-100">
        Sign In
      </button>
    </div>
  );
}
