// @ts-nocheck
/** @jsx React.createElement */

import React from "react";

import ReactDOMServer from "react-dom/server";

import { StaticRouter as ReactStaticRouter } from "react-router/index";

// declare global {
//   namespace ReactDOMServer {
//     export const renderToReadableStream: (
//       element: React.ReactElement
//     ) => ReadableStream<Uint8Array>;
//   }
// }

export default async function renderServer() {
  const nodeStream = await ReactDOMServer.renderToReadableStream(
    <p>hello</p>
  );
  return null;
}
// import { getQuickJS } from "quickjs-emscripten"

// export async function main() {
//   const QuickJS = await getQuickJS()
//   const vm = QuickJS.newContext()

//   const world = vm.newString("world")
//   vm.setProp(vm.global, "NAME", world)
//   world.dispose()

//   const result = vm.evalCode(`"Hello " + NAME + "!"`)
//   if (result.error) {
//     console.log("Execution failed:", vm.dump(result.error))
//     result.error.dispose()
//   } else {
//     console.log("Success:", vm.dump(result.value))
//     result.value.dispose()
//   }

//   vm.dispose()
// }
