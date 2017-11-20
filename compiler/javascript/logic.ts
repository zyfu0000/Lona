import * as _ from "lodash";

import {
  LogicNode,
  ParameterType,
  LogicParameter,
  LogicIdentifierParameter,
  getLogicParameterName
} from "./file";
import { identifier } from "babel-types";

interface LogicFunctionParameter {
  label?: string;
  access: "read" | "write";
  type: ParameterType;
}

interface LogicFunction {
  name: string;
  hasBody: boolean;
  parameters: {
    [key: string]: LogicFunctionParameter;
  };
  toCode(node: LogicNode): string;
}

const LogicAssignFunction: LogicFunction = {
  name: "assign",
  hasBody: false,
  parameters: {
    lhs: {
      label: null,
      access: "read",
      type: "a'"
    },
    rhs: {
      label: "to",
      access: "write",
      type: "a'"
    }
  },
  toCode(node: LogicNode): string {
    const { function: { arguments: { lhs, rhs } } } = node;

    return `${getLogicParameterName(rhs)} = ${getLogicParameterName(lhs)};`;
  }
};

interface LogicInvocation {
  func: LogicFunction;
  node: LogicNode;
}

const registeredLogicFunctions: LogicFunction[] = [LogicAssignFunction];

export class Logic {
  invocations: LogicInvocation[];

  constructor(nodes: LogicNode[]) {
    this.invocations = nodes.map(node => {
      return {
        func: this.logicFunction(node),
        node
      };
    });
  }

  logicFunction(node: LogicNode): LogicFunction | null {
    const { function: { name, arguments: args } } = node;

    const flattenKeys = obj =>
      Object.keys(obj)
        .sort()
        .join(",");

    return registeredLogicFunctions.find(decl => {
      // TODO: Let's just store the simple name, and consider arguments to be
      // part of the full signature
      const [functionName = null] = name.match(/\w+/) || [];

      if (!functionName) return;

      return (
        functionName == decl.name &&
        flattenKeys(args) == flattenKeys(decl.parameters)
      );
    });
  }

  parametersAccessed(invocations: LogicInvocation[]) {
    const parametersForInvocation = (invocation: LogicInvocation) => {
      const {
        func: { parameters } = { parameters: {} },
        node: { function: { arguments: args } }
      } = invocation;

      const identifiers = Object.keys(parameters)
        .filter(key => args[key].type == "identifier")
        .map(key => args[key]) as LogicIdentifierParameter[];

      return identifiers
        .filter(identifier => {
          return identifier.value.path[0] === "parameters";
        })
        .map(identifier => identifier.value.path[1]);
    };

    const parameters = invocations.map(invocation =>
      parametersForInvocation(invocation)
    );

    return _.union(_.flatten(parameters));
  }

  mutationsForBlock(invocations: LogicInvocation[]) {
    const mutationsForInvocation = (invocation: LogicInvocation) => {
      const {
        func: { parameters },
        node: { function: { arguments: args } }
      } = invocation;

      const identifiers = Object.keys(parameters)
        .filter(key => parameters[key].access == "write")
        .filter(key => args[key].type == "identifier")
        .map(key => args[key]) as LogicIdentifierParameter[];

      return identifiers.map(identifier => identifier.value.path.join("."));
    };

    const mutations = invocations.map(invocation =>
      mutationsForInvocation(invocation)
    );

    return _.union(_.flatten(mutations));
  }

  toCode() {
    return this.invocations.map(invocation => {
      const { func, node } = invocation;

      if (!func) return "undefined";

      return func.toCode(node);
    });
  }

  print() {
    // console.log("nodes");

    // this.invocations
    //   .map(invocation => invocation.node)
    //   .forEach(node => this.printNode(node));

    console.log(this.mutationsForBlock(this.invocations));
    console.log(this.toCode());
  }

  printNode(node: LogicNode, depth: number = 0) {
    const indentUnit = "  ";
    const indent = indentUnit.repeat(depth);
    const { function: { name, arguments: args }, nodes } = node;

    const decl = this.logicFunction(node);
    const hasBody = decl && decl.hasBody;

    console.log(indent + (decl ? "" : "[N/A] ") + name + (hasBody ? "{" : ""));

    Object.keys(args).forEach(key => {
      const arg = args[key];

      switch (arg.type) {
        case "identifier":
          console.log(
            indent + indentUnit + key + " = " + arg.value.path.join(".")
          );
          break;
        case "value":
          console.log(indent + indentUnit + key + " = " + arg.value.data);
          break;
      }
    });

    nodes.forEach(child => this.printNode(child, depth + 1));
  }
}
