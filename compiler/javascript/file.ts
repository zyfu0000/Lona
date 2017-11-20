type LayerType =
  | "View"
  | "Text"
  | "Image"
  | "Animation"
  | "Children"
  | "Component";

type ParameterPrimitiveType = "Undefined" | "Bool" | "Number" | "String";
type ParameterAliasType = string;
type ParameterEnumerationType = { name: "Enumeration"; of: any[] };
type ParameterArrayType = { name: "Array"; of: ParameterType[] };
type ParameterNamedType = { name: "Named"; alias: string; of: ParameterType };

export type ParameterType =
  | ParameterPrimitiveType
  | ParameterAliasType
  | ParameterEnumerationType
  | ParameterArrayType
  | ParameterNamedType;

export interface ParameterDefinition {
  type: ParameterType;
  name: string;
  defaultValue?: any;
}

export interface Layer {
  name: string;
  type: LayerType;
  visible: boolean;
  parameters: any;
  children: Layer[];
}

interface Value {
  type: ParameterType;
  data: any;
}

export interface LogicValueParameter {
  type: "value";
  value: Value;
}

export interface LogicIdentifierParameter {
  type: "identifier";
  value: {
    path: string[];
  };
}

export type LogicParameter = LogicValueParameter | LogicIdentifierParameter;

export function getLogicParameterName(parameter: LogicParameter) {
  switch (parameter.type) {
    case "identifier":
      return parameter.value.path.join(".");
    case "value":
      return JSON.stringify(parameter.value.data);
  }
}

export interface LogicNode {
  function: {
    name: string;
    arguments: {
      [key: string]: LogicParameter;
    };
  };
  nodes: LogicNode[];
}

export interface ComponentFile {
  rootLayer: Layer;
  parameters: ParameterDefinition[];
  logic: LogicNode[];
}

export function parse(input: string): ComponentFile {
  const parsed = JSON.parse(input);

  const { rootLayer, parameters, logic } = parsed;

  return {
    rootLayer,
    parameters,
    logic
  };
}

export function forEachLayer(layer: Layer, f: (layer: Layer) => void) {
  f(layer);

  layer.children.map(child => forEachLayer(child, f));
}

export function createLayerMap(rootLayer: Layer) {
  const map: { [key: string]: Layer } = {};

  forEachLayer(rootLayer, layer => {
    map[layer.name] = layer;
  });

  return map;
}
