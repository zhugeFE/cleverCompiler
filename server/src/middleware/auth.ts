// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from "express"

export default function (req: Request, res: Response, next: NextFunction): void {
  console.warn('check auth')
  next()
}