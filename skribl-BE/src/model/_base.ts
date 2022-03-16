abstract class BaseSchema {
  public id: string;

  public constructor(nameSpace: String, id: number) {
    this.id = `${nameSpace}-${id}`;
  }
}

export default BaseSchema;
