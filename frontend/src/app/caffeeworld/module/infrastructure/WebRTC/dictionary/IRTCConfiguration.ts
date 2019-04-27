export interface IIceServerConfiguration {
    urls: string[] | string;
}

export interface IRTCConfiguration {
    iceServers?: IIceServerConfiguration[];
}
