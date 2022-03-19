abstract class BaseSchema {
  public constructor(private _id: string) {}

  public get id(): string {
    return this._id;
  }
}

export default BaseSchema;
