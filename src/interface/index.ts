import { ENodeType } from "../lib/enum";

export interface INode {
    key: string;
    type: ENodeType;
    node: any;
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