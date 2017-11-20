import * as _ from "lodash";
import { Layer } from "./file";
import { DimensionSize } from "./component";

export function widthSizingRule(
  layer: Layer,
  parentLayer?: Layer
): DimensionSize {
  const flexDirection = _.get(
    parentLayer,
    ["parameters", "flexDirection"],
    "column"
  );
  const { width = null, flex = 0, alignSelf = null } = layer.parameters;

  if (flexDirection === "row") {
    if (flex === 1) {
      return "Fill";
    } else if (width == null) {
      return "FitContent";
    } else {
      return width;
    }
  } else {
    if (alignSelf === "stretch") {
      return "Fill";
    } else if (width == null) {
      return "FitContent";
    } else {
      return width;
    }
  }
}

export function heightSizingRule(
  layer: Layer,
  parentLayer?: Layer
): DimensionSize {
  const flexDirection = _.get(
    parentLayer,
    ["parameters", "flexDirection"],
    "column"
  );
  const { height = null, flex = 0, alignSelf = null } = layer.parameters;

  if (flexDirection === "row") {
    if (alignSelf === "stretch") {
      return "Fill";
    } else if (height == null) {
      return "FitContent";
    } else {
      return height;
    }
  } else {
    if (flex === 1) {
      return "Fill";
    } else if (height == null) {
      return "FitContent";
    } else {
      return height;
    }
  }
}
