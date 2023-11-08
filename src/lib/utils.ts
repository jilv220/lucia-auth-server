import { response } from "express";

export function buildClientErrorResponse(
  res: typeof response,
  e: string | string[]
) {
  return res.status(400).json(e);
}

// infer the arguments type from certain function, ts magic
export type ArgumentsType<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : never;
