import { IBag, IVoxaEvent } from "./VoxaEvent";
export declare class Model {
    [key: string]: any;
    static deserialize(data: IBag, voxaEvent: IVoxaEvent): Promise<Model> | Model;
    state?: string;
    constructor(data?: any);
    serialize(): Promise<any>;
}
export interface IModel {
    new (data?: any): Model;
    deserialize(data: IBag, event: IVoxaEvent): Model | Promise<Model>;
    serialize(): Promise<any>;
}
