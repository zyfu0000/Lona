import { Layer } from "./file";
import { widthSizingRule, heightSizingRule } from "./flexboxConversion";
import { Comparator } from "lodash";

export type Element = {
  tag: string;
  jsxAttributes: { name: string; value: string }[];
  styleAttributes: { name: string; value: string }[];
  content?: string;
};

export type DimensionSize = "Fill" | "FitContent" | number;
export type Direction = "Row" | "Column";
export type Alignment = "Start" | "Center" | "End";

export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface LayoutParameters {
  verticalSize: DimensionSize;
  horizontalSize: DimensionSize;
  margin: EdgeInsets;
}

export interface LayoutParentParameters extends LayoutParameters {
  direction: Direction;
  verticalAlignment: Alignment;
  horizontalAlignment: Alignment;
  padding: EdgeInsets;
}

export interface ViewParameters extends LayoutParentParameters {
  backgroundColor?: string;
}

export interface TextParameters extends LayoutParameters {
  textStyle?: string;
  value?: string;
}

export class Component {
  name: string;
  visible: boolean;

  // toCode(): string {
  //   throw new Error(`Component.toCode() not implemented for ${this.name}.`);
  // }

  toElement(parent?: ParentComponent): Element {
    throw new Error(`Component.toElement() not implemented for ${this.name}.`);
  }

  static create(layer: Layer, parent?: Layer): Component {
    const { name, visible = true, children = [] } = layer;

    const childrenComponents = children
      .map(child => Component.create(child, layer))
      // TODO: Remove when we have all components and throw an error instead
      .filter(x => !!x);

    switch (layer.type) {
      case "View": {
        const {
          flexDirection = "column",
          marginTop = 0,
          marginRight = 0,
          marginBottom = 0,
          marginLeft = 0,
          paddingTop = 0,
          paddingRight = 0,
          paddingBottom = 0,
          paddingLeft = 0,
          backgroundColor = null
        } = layer.parameters;

        const parameters: ViewParameters = {
          verticalSize: heightSizingRule(layer, parent),
          horizontalSize: widthSizingRule(layer, parent),
          direction: flexDirection === "row" ? "Row" : "Column",
          verticalAlignment: "Start",
          horizontalAlignment: "Start",
          margin: {
            top: marginTop,
            right: marginRight,
            bottom: marginBottom,
            left: marginLeft
          },
          padding: {
            top: paddingTop,
            right: paddingRight,
            bottom: paddingBottom,
            left: paddingLeft
          },
          backgroundColor: backgroundColor
        };

        return new ViewComponent(name, visible, parameters, childrenComponents);
      }

      case "Text": {
        const {
          marginTop = 0,
          marginRight = 0,
          marginBottom = 0,
          marginLeft = 0,
          font = null,
          text = null
        } = layer.parameters;

        const parameters: TextParameters = {
          verticalSize: heightSizingRule(layer, parent),
          horizontalSize: widthSizingRule(layer, parent),
          margin: {
            top: marginTop,
            right: marginRight,
            bottom: marginBottom,
            left: marginLeft
          },
          textStyle: font,
          value: text
        };

        return new TextComponent(name, visible, parameters);
      }
    }
  }
}

export class ParentComponent extends Component {
  children: Component[];

  static isParentComponent(component: Component): component is ParentComponent {
    return "children" in <ParentComponent>component;
  }
}

export class ViewComponent extends ParentComponent {
  parameters: ViewParameters;

  constructor(
    name: string,
    visible: boolean,
    parameters: ViewParameters,
    children: Component[]
  ) {
    super();

    this.name = name;
    this.visible = visible;
    this.parameters = parameters;
    this.children = children;
  }

  // TODO: How to handle dynamic overrides
  toElement(parent?: ParentComponent): Element {
    const {
      verticalSize,
      horizontalSize,
      direction,
      verticalAlignment,
      horizontalAlignment,
      margin: {
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft
      },
      padding: {
        top: paddingTop,
        right: paddingRight,
        bottom: paddingBottom,
        left: paddingLeft
      },
      backgroundColor
    } = this.parameters;

    const styleAttributes: { name: string; value: any }[] = [];
    const jsxAttributes: { name: string; value: any }[] = [];

    function addAttribute(
      name: string,
      value: any,
      defaultValue: any,
      isStyle: boolean
    ) {
      if (value === defaultValue) return;

      (isStyle ? styleAttributes : jsxAttributes).push({ name, value });
    }

    const parentDirection = parent
      ? (<ViewComponent>parent).parameters.direction
      : "Column";

    switch (parentDirection) {
      case "Row":
        switch (verticalSize) {
          case "Fill": {
            addAttribute("alignSelf", "stretch", "flex-start", true);
            break;
          }
          case "FitContent":
            break;
          default: {
            addAttribute("height", verticalSize, 0, true);
          }
        }
        switch (horizontalSize) {
          case "Fill": {
            addAttribute("flex", 1, 0, true);
            break;
          }
          case "FitContent":
            break;
          default: {
            addAttribute("width", horizontalSize, 0, true);
          }
        }

        break;
      case "Column":
        switch (verticalSize) {
          case "Fill": {
            addAttribute("flex", 1, 0, true);
            break;
          }
          case "FitContent":
            break;
          default: {
            addAttribute("height", verticalSize, 0, true);
          }
        }
        switch (horizontalSize) {
          case "Fill": {
            addAttribute("alignSelf", "stretch", "flex-start", true);
            break;
          }
          case "FitContent":
            break;
          default: {
            addAttribute("width", horizontalSize, 0, true);
          }
        }

        break;
    }

    addAttribute("paddingTop", paddingTop, 0, true);
    addAttribute("paddingRight", paddingRight, 0, true);
    addAttribute("paddingBottom", paddingBottom, 0, true);
    addAttribute("paddingLeft", paddingLeft, 0, true);
    addAttribute("marginTop", marginTop, 0, true);
    addAttribute("marginRight", marginRight, 0, true);
    addAttribute("marginBottom", marginBottom, 0, true);
    addAttribute("marginLeft", marginLeft, 0, true);
    addAttribute("backgroundColor", backgroundColor, null, true);

    return {
      tag: "View",
      jsxAttributes,
      styleAttributes
    };
  }
}

export class TextComponent extends Component {
  parameters: TextParameters;

  constructor(name: string, visible: boolean, parameters: TextParameters) {
    super();

    this.name = name;
    this.visible = visible;
    this.parameters = parameters;
  }

  // TODO: How to handle dynamic overrides
  toElement(parent?: ParentComponent): Element {
    const {
      verticalSize,
      horizontalSize,
      margin: {
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft
      },
      textStyle,
      value
    } = this.parameters;

    const styleAttributes: { name: string; value: any }[] = [];
    const jsxAttributes: { name: string; value: any }[] = [];

    function addAttribute(
      name: string,
      value: any,
      defaultValue: any,
      isStyle: boolean
    ) {
      if (value === defaultValue) return;

      (isStyle ? styleAttributes : jsxAttributes).push({ name, value });
    }

    addAttribute("marginTop", marginTop, 0, true);
    addAttribute("marginRight", marginRight, 0, true);
    addAttribute("marginBottom", marginBottom, 0, true);
    addAttribute("marginLeft", marginLeft, 0, true);
    // addAttribute("font", textStyle, null, true);

    return {
      tag: "Text",
      jsxAttributes,
      styleAttributes,
      content: value
    };
  }
}
