import "./component.js";

import * as fse from "fs-extra";
import * as program from "commander";
import * as prettier from "prettier";

import { Logic } from "./logic";
import { parse } from "./file";
import { resolve } from "url";
import { log } from "util";
import { createContext } from "./context";
import { Component } from "./component.js";
import { ComponentWriter } from "./componentWriter";
import { basename } from "path";

const glob = require("glob");
const path = require("path-extra");

let positionalArgs = [];

program
  .version("0.1.0")
  .arguments("<workspace> <output-dir>")
  .option("--primitives", 'Import React components from "react-primitives"')
  .option(
    "--copy-components",
    "Copy .component files to destination directory as .json files"
  )
  .option(
    "--filter [optional]",
    "Filter the component files to convert by regex",
    value => new RegExp(value)
  )
  .action((...args) => {
    positionalArgs = args;
  })
  .parse(process.argv);

const [workspaceDirectory, outputDirectory] = positionalArgs;

if (!workspaceDirectory) {
  console.log("Missing workspace directory!");
  program.help();
}

if (!outputDirectory) {
  console.log("Missing output directory!");
  program.help();
}

console.log("workspace", workspaceDirectory);
console.log("output", outputDirectory);

async function main() {
  await fse.mkdirp(outputDirectory);

  // const colors = await buildColors();
  // const fonts = await buildFonts(colors);

  // fse.writeFile(
  //   path.join(outputDirectory, "colors.json"),
  //   JSON.stringify(colors, null, 2)
  // );
  // fse.writeFile(path.join(outputDirectory, "fonts.js"), fonts);

  const fromDirectory = path.resolve(workspaceDirectory);
  const toDirectory = path.resolve(outputDirectory);

  glob(path.join(fromDirectory, "**", "*.component"), (error, files) => {
    files
      .filter(file => !program.filter || program.filter.exec(file))
      .forEach(async file => {
        const fromRelativePath = path.relative(fromDirectory, file);
        const toRelativePath = `${path.removeExt(fromRelativePath)}.js`;
        const outputPath = path.join(toDirectory, toRelativePath);

        console.log(
          path.join(workspaceDirectory, fromRelativePath),
          "=>",
          path.join(outputDirectory, toRelativePath)
        );

        const workspace = path.relative(
          path.dirname(outputPath),
          outputDirectory
        );

        const componentFile = parse(fse.readFileSync(file).toString());
        // console.log("result", componentFile);

        const rootComponent = Component.create(componentFile.rootLayer);
        const logic = new Logic(componentFile.logic);

        // console.log(rootComponent);

        // logic.print();

        const output = new ComponentWriter(
          path.removeExt(path.basename(file)),
          componentFile.parameters,
          rootComponent,
          logic
        ).generateReactComponentClass();

        console.log(prettier.format(output));

        // const context = createContext(componentFile.rootLayer);

        // console.log(context);

        // fse.readFile

        // const code = convert(file, {
        //   primitives: program.primitives,
        //   colors,
        //   paths: {
        //     workspace,
        //     colors: path.join(workspace, "colors.json"),
        //     fonts: path.join(workspace, "fonts.js")
        //   }
        // });

        // if (program.copyComponents) {
        //   const componentRelativePath = `${path.removeExt(
        //     fromRelativePath
        //   )}.component.json`;
        //   const componentOutputPath = path.join(
        //     toDirectory,
        //     componentRelativePath
        //   );
        //   const component = await fse.readFile(file);
        //   fse.writeFile(componentOutputPath, component);
        // }

        // await fse.mkdirp(path.dirname(outputPath));
        // fse.writeFile(outputPath, code);
      });
  });
}

main();
