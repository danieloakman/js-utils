// /**
//  * Declares and runs a main function if the entry point to the program is `module`. This is esstentially the same as
//  * python's `if __name__ == '__main__'` block.
//  * @param module The NodeModule where this main function is running from.
//  * @param mainFunction The main function to run.
//  */
// export function main(module: any, mainFunction: () => Promise<void>) {
//   if (require?.main !== module) return;
//   return mainFunction();
// }

// let main: (module: any, mainFunction: () => Promise<void>) => Promise<void>;
// if (process.env.BUILD_TARGET === 'node') {
//   main = async (module: any, mainFunction: () => Promise<void>) => {
//     if (require?.main !== module) return;
//     return mainFunction();
//   };
// }
// export const main = main;
export const a = '';
