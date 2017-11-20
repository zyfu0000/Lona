// interface JSXElement {
//   tag: string;
//   attributes: { name: string; value: any }[];
//   children: JSXElement[];
// }

// function writeJSXElement(element: JSXElement): string {
//   const { tag, attributes, children } = element;

//   const childrenString = children.map(writeJSXElement).join('\n');

//   const props = attributes
//     .map(({ name, value }) => {
//       return `${name}={${JSON.stringify(value)}}`;
//     })
//     .join(" ");

//   const style =
//     element.styleAttributes.length > 0
//       ? "style={" +
//         element.styleAttributes
//           .map(({ name, value }) => {
//             return `${name}={${JSON.stringify(value)}}`;
//           })
//           .join(",\n") +
//         "}"
//       : "";

//     return {
//       openingTag: `<${element.tag} ${props} ${style}>`,
//       closingTag: `</${element.tag}>`,
//     };
//   }

// }
