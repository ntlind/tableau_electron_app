// @ts-nocheck
import * as d3 from "d3";
import {
  getType,
  getTypeClassification,
  getTypeIconList,
} from "../components/DragAndDrop/DragAndDrop";

export default function LoadD3File(url: string) {
  return d3.csv(url).then((response: any) => {
    let columns = response.columns;
    let types = Object.values(response[0]).map((key, val) => getType(key));
    let classifications = types.map((e) => getTypeClassification(e));
    let iconList = getTypeIconList();

    let col_obj = columns.reduce(function (result, item, index, array) {
      let values = response.map((value: any) => value[item]);
      result[item] = {
        type: { id: iconList[types[index]].index, value: types[index] },
        classification: classifications[index],
        values: values,
        aggregation: classifications[index] === "metric" ? "sum" : null,
      };
      return result;
    }, {});

    let classification_obj = classifications.reduce(function (
      result,
      item,
      index,
      array
    ) {
      if (result[item]) {
        result[item] = result[item].concat(response.columns![index]);
      } else {
        result[item] = [response.columns![index]];
      }
      return result;
    },
    {});

    return {
      array: response,
      col_obj: col_obj,
      classification_obj: classification_obj,
    };
  });
}
