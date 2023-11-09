/* eslint-disable @typescript-eslint/no-explicit-any */

// infer the arguments type from certain function, ts magic
export type ArgumentsType<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : never;
