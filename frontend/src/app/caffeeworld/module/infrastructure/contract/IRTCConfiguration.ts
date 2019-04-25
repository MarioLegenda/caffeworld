export interface IIceServerConfigurtion {
    urls: string[];
}

export interface IRTCConfiguration {
    iceServers?: IIceServerConfigurtion[];
}
