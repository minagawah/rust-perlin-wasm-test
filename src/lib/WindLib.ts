import { WebAssemblyInstance, WebAssemblyResult, WindLib } from '../types';

const FILE_PATH_WASM = 'assets/wasm/wind.gc.wasm';

let instance: WindLib;

/**
 * @public
 * @returns {Promise}
 */
export default async function factory (): Promise<WindLib> {
  if (!instance) {
    try {
      let imports = {
        env: {
          showMessage,
          alert,
        },
      };
      instance = await getWindLib({ file: FILE_PATH_WASM, imports });
    } catch (err) {
      console.error(err);
    }
  }
  return instance;
}

/**
 * JS function exported to WASM for use.
 * @public
 */
export function showMessage (message: string): void {
  const el: any = document.querySelector('#message');
  if (el) {
    el.innerHTML = message;
  }
}

/**
 * Provides "WindLib" (out of fetched WASM content).
 * @private
 * @returns {Promise}
 */
async function getWindLib (args: any = {}): Promise<WindLib> {
  const wasmModule: WebAssemblyResult = await getWasm(args);
  // @todo
  // TS2693: 'WindLib' only refers to a type, but is being used as a value here.
  // ---------------------------------------------------------
  // instance: WindLib = wasmModule.instance.exports;
  // ---------------------------------------------------------
  instance = wasmModule.instance.exports;
  // In case you have no access to the server, and set
  // a mime type for WASM which is "application/wasm",
  // here is a workaround:
  // ---------------------------------------------------------------
  // instance = new (WebAssembly as any).Instance(module, imports);
  // ---------------------------------------------------------------
  return instance;
}

/**
 * Fetch the WASM, and extract "WebAssemblyResult".
 * @private
 * @returns {Promise}
 */
async function getWasm (args: any = {}): Promise<WebAssemblyResult> {
  const file: string = args.file;
  let imports: any = args.imports || {};

  const wasmModule: WebAssemblyResult = await (WebAssembly as any)
    .instantiateStreaming(fetch(file), imports);

  // In case you have no access to the server, and set
  // a mime type for WASM which is "application/wasm",
  // here is a workaround:
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // let wasmModule: WebAssemblyResult;
  // const data: any = await fetch(file);
  // if (data) {
  //   const buf: ArrayBuffer = await data.arrayBuffer();
  //   if (typeof buf.byteLength !== 'undefined' && buf.byteLength) {
  //     wasmModule = <WebAssemblyResult> (WebAssembly as any).compile(buf);
  //     imports = imports || {};
  //     imports.env = imports.env || {};
  //     imports.env.memoryBase = imports.env.memoryBase || 0;
  //     imports.env.tableBase = imports.env.tableBase || 0;
  //     if (!imports.env.memory) {
  //       imports.env.memory = new (WebAssembly as any).Memory({ initial: 256 });
  //     }
  //     if (!imports.env.table) {
  //       imports.env.table = new (WebAssembly as any).Table({ initial: 0, element: 'anyfunc' });
  //     }
  //   }
  // }
  
  return wasmModule;
}
