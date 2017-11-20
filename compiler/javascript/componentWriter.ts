import { ComponentFile, ParameterDefinition, ParameterType } from "./file";
import { Component, Element, ParentComponent } from "./component";
import { Logic } from "./logic";

const indentUnit = "  ";

function indent(code = "", count = 0) {
  return code
    .split("\n")
    .map(line => indentUnit.repeat(count) + line)
    .join("\n");
}

export class ComponentWriter {
  name: string;
  parameters: ParameterDefinition[];
  rootComponent: Component;
  logic: Logic;

  constructor(
    name: string,
    parameters: ParameterDefinition[],
    rootComponent: Component,
    logic: Logic
  ) {
    this.name = name;
    this.parameters = parameters;
    this.rootComponent = rootComponent;
    this.logic = logic;
  }

  generateReactType(type: ParameterType) {
    if (typeof type === "string") {
      switch (type) {
        case "Undefined":
          return "undefined";
        case "Boolean":
          return "bool";
        case "Number":
          return "number";
        case "String":
        case "Color":
        case "URL":
          return "string";
      }
    }
  }

  generatePropTypes(parameters: ParameterDefinition[]): string {
    const types = parameters
      .map(parameter => {
        const { name, type, defaultValue } = parameter;
        const optional = defaultValue in parameter;

        const optionalCode = optional ? "" : ".isRequired";
        const typeCode = this.generateReactType(type);

        return `${name}: PropTypes.${typeCode}${optionalCode}`;
      })
      .join(",\n");

    return `static propTypes = {\n${indent(types, 1)}\n}`;
  }

  generateDefaultProps(parameters = []) {
    const defaultProps = parameters
      .filter(parameter => "defaultValue" in parameter)
      .map(parameter => {
        const { name, type, defaultValue } = parameter;

        return `${name}: ${JSON.stringify(defaultValue)}`;
      })
      .join(",\n");

    if (!defaultProps) return "";

    return `static defaultProps = {\n${indent(defaultProps, 1)}\n}`;
  }

  generateComponentJSX(component: Component) {
    function generateJSX(element: Element) {
      const props = element.jsxAttributes
        .map(({ name, value }) => {
          return `${name}={${JSON.stringify(value)}}`;
        })
        .join(" ");

      const style =
        element.styleAttributes.length > 0
          ? "style={{" +
            element.styleAttributes
              .map(({ name, value }) => {
                return `${name}: ${JSON.stringify(value)}`;
              })
              .join(",\n") +
            "}}"
          : "";

      return {
        openingTag: `<${element.tag} ${props} ${style}>`,
        closingTag: `</${element.tag}>`
      };
    }

    const jsx = generateJSX(component.toElement());
    const childrenJSX = ParentComponent.isParentComponent(component)
      ? component.children.map(this.generateComponentJSX).join("\n")
      : "";

    return jsx.openingTag + childrenJSX + jsx.closingTag;
  }

  generateImports(): string {
    return `
      import React from 'react'
      import PropTypes from 'prop-types'
      import { View, Text, Image, StyleSheet } from 'react-native'
    `;
  }

  generateReactComponentClass(): string {
    return `class ${this.name} extends React.Component {
      ${this.generatePropTypes(this.parameters)}
      ${this.generateDefaultProps(this.parameters)}

      render() {
        return (
          ${this.generateComponentJSX(this.rootComponent)}
        )
      }
    }`;
  }
}
