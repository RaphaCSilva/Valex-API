import { Response, Request, NextFunction } from "express";

const possibleErrors = {
    bad_request: 400,
    unauthorized: 401,
    not_found: 404,
    conflict: 409,
}

export default function errorHandlerMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
  console.log(error);
  const type: string = error.type;
  let statusCode = possibleErrors[type];
  if(!statusCode) {
    statusCode = 500;
  }
  return res.sendStatus(statusCode);
}