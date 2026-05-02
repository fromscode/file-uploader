export default class InternalServer500 extends Error {
  private status: number;
  constructor() {
    super("Internal Server Error");
    this.status = 500;
  }
}
