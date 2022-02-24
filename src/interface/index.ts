import { ENodeType } from "../lib/enum";
import NodeBase from "../lib/model/nodeBase.js";
import Page from '../lib/model/page.js';

type Nullable<T> = {
    [P in keyof T]?: T[P];
};

type AttachNode = {
    toMounted?: (instance: Page) => string;
    toCreated?: (instance: Page) => string;
}

export interface INode<T extends NodeBase = NodeBase> {
    key: string;
    type: ENodeType;
    node: T & AttachNode;
}

export interface IAppInfo {
    appId: string;
    appContent: any;
    appName: string;
}

export interface IPageJson {
    id: string;
    smartData: any;
    commonPage: {
        id: string;
        label: string;
        type: string;
    };
    type: string;
}