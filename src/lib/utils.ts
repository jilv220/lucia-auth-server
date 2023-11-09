import { response } from 'express';
import { UNKNOWN_ERR } from '../constant/error.ts';

function buildErrorResponse(
  res: typeof response,
  status: number,
  e: string | string[]
) {
  return res.status(status).json(e);
}

export function buildClientErrorResponse(
  res: typeof response,
  e: string | string[]
) {
  return buildErrorResponse(res, 400, e);
}

export function buildUnknownErrorResponse(res: typeof response) {
  return res.status(500).json(UNKNOWN_ERR);
}
