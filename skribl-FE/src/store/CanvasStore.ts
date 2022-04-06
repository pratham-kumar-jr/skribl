import { action, computed, makeObservable, observable } from "mobx";

class CanvasStore {
  private static _instance: CanvasStore | null;

  @observable
  private _canvas: HTMLCanvasElement | null = null;

  @observable
  private _height: number;

  @observable
  private _width: number;

  @observable
  private _cursor: string;

  @action
  public setCanvas(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
  }

  @action
  public setHeight(height: number) {
    this._height = height;
  }

  @action
  public setWidth(width: number) {
    this._width = width;
  }

  @action
  public setCursor(cursor: string) {
    this._cursor = cursor;
  }

  @computed
  public get Height(): number {
    return this._height;
  }

  @computed
  public get Width(): number {
    return this._width;
  }

  @computed
  public get Cursor(): string {
    return this._cursor;
  }

  @computed
  public get Canvas(): HTMLCanvasElement | null {
    return this._canvas;
  }

  private constructor() {
    this._height = 500;
    this._width = 500;
    this._cursor = "default";
    makeObservable(this);
  }

  public static getInstance(): CanvasStore {
    if (!CanvasStore._instance) {
      CanvasStore._instance = new CanvasStore();
    }
    return CanvasStore._instance;
  }
}

export const canvasStore = CanvasStore.getInstance();
