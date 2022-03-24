import { action, computed, makeObservable, observable } from "mobx";

interface Message {
  by: string;
  message: string;
}

class ChatStore {
  private static _instance: ChatStore | null;

  @observable
  private _chats: Message[];

  @action
  public addChat(message: Message) {
    this._chats.push(message);
  }

  @computed
  public get chats(): Message[] {
    return this._chats;
  }

  private constructor() {
    this._chats = [];
    makeObservable(this);
  }

  public static getInstance(): ChatStore {
    if (!ChatStore._instance) {
      ChatStore._instance = new ChatStore();
    }
    return ChatStore._instance;
  }
}

export const chatStore = ChatStore.getInstance();
