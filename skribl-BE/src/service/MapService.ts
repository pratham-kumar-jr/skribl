import BaseSchema from "../model/_base";
import * as _ from "lodash";

// TODO: Move to Redis
class MapService {
  private static _instance: MapService | null;
  private map: { [key: string]: any } = {};
  private constructor() {}

  public static getInstance(): MapService {
    if (!MapService._instance) {
      MapService._instance = new MapService();
    }
    return MapService._instance;
  }

  public setEntity<T extends BaseSchema>(id: string, obj: T): void {
    this.map[id] = obj;
  }

  public getEntity<T extends BaseSchema>(id: string): T | undefined {
    return this.map[id] as T | undefined;
  }

  public remove(id: string) {
    this.map = _.omit(this.map, id);
  }

  public add<T = any>(id: string, data: T): void {
    this.map[id] = data;
  }

  public get<T = any>(id: string): T | undefined {
    return this.map[id] as T | undefined;
  }
}

export const mapService = MapService.getInstance();
