import Papa from "papaparse";
import moment from "moment";
import {
  HiOutlineCalendar,
  HiOutlineDocument,
  HiOutlineCalculator,
  HiOutlineVariable,
} from "react-icons/hi";

export function getIndexOfString(array: Array<any>, str: string) {
  var newArr = array.reduce(function (acc, curr, index) {
    if (curr == str) {
      acc.push(index);
    }
    return acc;
  }, []);

  return newArr;
}

export function getType(str: string) {
  if (typeof str !== "string") str = str.toString();
  var nan = isNaN(Number(str));
  var isfloat = /^\d*(\.|,)\d*$/;
  var commaFloat = /^(\d{0,3}(,)?)+\.\d*$/;
  var dotFloat = /^(\d{0,3}(\.)?)+,\d*$/;
  let dateFormats = ["MM-DD-YYYY", "YYYY-DD-MM"];
  var email = /^[A-za-z0-9._-]*@[A-za-z0-9_-]*\.[A-Za-z0-9.]*$/;
  var phone = /^\+\d{2}\/\d{4}\/\d{6}$/g;
  if (!nan) {
    if (parseFloat(str) === parseInt(str)) return "integer";
    else return "float";
  } else if (isfloat.test(str) || commaFloat.test(str) || dotFloat.test(str))
    return "float";
  else if (moment(str, dateFormats, true).isValid()) return "date";
  else {
    if (email.test(str)) return "e-mail";
    else if (phone.test(str)) return "phone";
    else return "string";
  }
}

export function getTypeClassification(str: string) {
  let metric_types = ["integer", "float", "number"];

  if (metric_types.includes(str)) {
    return "metric";
  } else {
    return "dimension";
  }
}

/**
 * Moves an item from one list to another list.
 */
export const move = (
  source,
  destination,
  droppableSource,
  droppableDestination
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  // if the user tries to drop their droppable in the wrong place, correct it for them
  let is_moving_metric =
    droppableDestination.droppableId == 0 &&
    getTypeClassification(sourceClone[droppableSource.index].type) == "metric";

  let is_moving_dimension =
    droppableDestination.droppableId == 1 &&
    getTypeClassification(sourceClone[droppableSource.index].type) ==
      "dimension";

  let is_moving_to_selector = droppableDestination.droppableId > 1;

  const result = {};

  if (is_moving_dimension || is_moving_metric || is_moving_to_selector) {
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  } else {
    // don't allow movement if those conditions aren't met
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  }
};

// Copy the draggable from one list to another
export const copy = (
  source,
  destination,
  droppableSource,
  droppableDestination
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];
  if (destClone.some((e) => e.id === `item-${item.content}`)) {
  } else {
    destClone.splice(droppableDestination.index, 0, {
      ...item,
      id: `item-${item.content}`,
    });
  }

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export function getItems(array, offset = 0) {
  return array.map((k: any) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `${k}`,
    type: k && getType(k),
  }));
}

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function getTypeIconList() {
  let iconClass = "h-5 w-5 mx-auto stroke-1";

  let iconMap = {
    float: { icon: <HiOutlineCalculator className={iconClass} />, index: 0 },
    integer: { icon: <HiOutlineVariable className={iconClass} />, index: 1 },
    date: { icon: <HiOutlineCalendar className={iconClass} />, index: 2 },
    // email: { icon: <AtSymbolIcon className={iconClass} />, index: 3 },
    // phone: { icon: <PhoneIcon className={iconClass} />, index: 4 },
    string: { icon: <HiOutlineDocument className={iconClass} />, index: 5 },
  };
  return iconMap;
}
