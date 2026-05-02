import { ValidationError } from "express-validator";

export default class BadRequest400 extends Error {
  status: number;
  errors: string[];
  constructor(errors: ValidationError[]) {
    super("Internal Server Error");
    this.status = 400;
    this.errors = [];
    errors.forEach((err) => this.errors.push(err.msg));
  }
}
