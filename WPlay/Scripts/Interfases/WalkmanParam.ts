interface IWalkmanParam {
    buttonPlay: HTMLElement;
    volume: HTMLInputElement;
    trackName?: HTMLElement;
    mute: HTMLElement;
    vkSearch?: HTMLElement;
    timer?: HTMLElement;
}

interface IControls {
    buttonPlay: HTMLElement;
    volume: HTMLInputElement;
    trackName: HTMLElement;
    mute: HTMLElement;
    vkSearch: HTMLElement;
    timer: HTMLElement;
};

interface ICurrentState {
    mount: string;
    bitrate: number;
    nameTrack: string;
}

interface IMountList {
    mount: string;
    bitrate: number;
    url: string;
    mimeType: string;
}

interface ICurrentTrackName {
    nameTrack: string;
    mount?: string;
}

interface IMountSourceInfo {
    fullMount: string;
    streamUrl: string;
}
interface IMountSource {
    radiant: {
        64?: IMountSourceInfo;
        128?: IMountSourceInfo;
        256?: IMountSourceInfo;
    };
    dire: {
        64?: IMountSourceInfo;
        128?: IMountSourceInfo;
        256?: IMountSourceInfo;
    };
};
interface ICallBack {
    onPlay? (): void;
    onStop? (): void;
    onChangeVolume? (volume: number) : void;
    onChangeNameTrack? (mount: string, name: string): void;

};





