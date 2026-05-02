export default class NotFound404 extends Error {
  status: number;
  constructor() {
    super("Resource not found");
    this.status = 404;
  }
}
