export default class NotFound404 extends Error {
  private status: number;
  constructor() {
    super("Resource not found");
    this.status = 404;
  }
}
