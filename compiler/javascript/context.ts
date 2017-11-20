import { ParameterType, Layer, createLayerMap } from "./file";

interface ContextItem {
  path: string[];
  access: "read" | "write";
  type: ParameterType;
  items: {
    [key: string]: ContextItem;
  };
}

interface Context {
  [key: string]: ContextItem;
}

export function createContext(rootLayer: Layer): Context {
  const layerItems = Object.keys(createLayerMap(rootLayer))
    .map(name => {
      return {
        path: ["layers", name],
        access: "read",
        type: "any",
        items: {}
      };
    })
    .reduce((acc, item) => {
      acc[item.path[1]] = item;
      return acc;
    }, {});

  const layers: ContextItem = {
    path: ["layers"],
    access: "read",
    type: "any",
    items: layerItems
  };

  return {
    layers
  };
}
