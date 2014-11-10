/// <reference path="_references.ts" />

class Timer {
    private second: number;
    private handler; any;

    constructor() {
        this.second = 0;
        this.handler = null;
    }

    public start(): void{
        var self = this;
        this.second = 0;
        this.handler = setInterval(() => { self._upTime(); }, 1000);        
    }

    public stop() {
        clearInterval(this.handler);
        this.handler = null;
    }

    public reset() {
        this.stop();
        this.start();
    }

    public getTime():string {
        if (!this.handler) {
            return null;
        }

        var temp = this.second;
        var second = temp % 60;
        var minut = Math.floor(temp / 60 % 60);
        var hour = Math.floor(temp / 3600);
        return hour + ":" + (minut < 10 ? "0" : "") + minut + ":" + (second < 10 ? "0" : "") + second;
    }


    private _upTime() {
        this.second++;
    }
}




class WPlayWalkman {

    private callback:ICallBack = {};
    private audio = new Audio();
    private controls:IControls = {
        buttonPlay: null,
        volume: null,
        trackName: null,
        mute: null,
        vkSearch: null,
        timer:null

    };

    private curentState: ICurrentState = {
        mount: null,
        bitrate: 128,
        nameTrack: null
    };
    private mountSourse: IMountSource = { radiant: {}, dire: {} };
    private protocol: string;
    private timer: Timer;

    constructor(param: IWalkmanParam, callback? :ICallBack) {
        for (var key in param) {
            if (key == undefined) {
                continue;

            }
            this.controls[key] = param[key]
        };

        for (var key in callback) {
            if (key == undefined) {
                continue;
            }
            this.callback[key] = callback[key]
        }

        this.timer = new Timer();
        this.audio.volume = 0.5;
        this.audio.loop = true;
        this.initi();

    }

    private initi() {
        this.protocol = window.location.protocol;
        this._initMount();
        this._initEvents();
    }

    private _initMount() {
        var self = this;
        $.ajax({
            url: self.protocol + "//hiteka.net/api/GetAllMount",
            success: (data: IMountList[]) => {
                self._initMountSource(data);

            }
        })


    }
    private _initMountSource(info: IMountList[])
    {
        var length = info.length;

        for (var i = 0; i < length; i++) {
            var obj: IMountList = info[i];
            

            if (this.audio.canPlayType(obj.mimeType) === "") {
                continue;
            }
            var detalemount = obj.mount.slice(1).split("_");

            if (detalemount[1] === "nonstop") {
                continue;
            }

            if (this.mountSourse[detalemount[0]] == undefined){
                this.mountSourse[detalemount[0]] = {};
            }

            if (this.mountSourse[detalemount[0]][obj.bitrate] == undefined) {
                this.mountSourse[detalemount[0]][obj.bitrate] = { fullMount: obj.mount, streamUrl: obj.url };
            }

        }
    }

    private _initEvents() {
        var self = this;
        this.controls.volume.addEventListener("change", (e) => { self.changeVolume(); }, false);
        this.controls.buttonPlay.addEventListener("click", (e) => { self.playStop(); }, false);
        this.controls.mute.addEventListener("click", (e) => { self.mute(); }, false);

        if (this.controls.timer != null) {
            setInterval(() => {
                self.controls.timer.innerText = self.timer.getTime();
            }, 1000);
        }

        setInterval(() => {
            self.___updateCurrentTreakName();
        }, 10000);
    }
    private ___updateCurrentTreakName() {
        var self = this;
        if (self.audio.paused || self.curentState.mount == null)
                return;
        $.ajax({
            url: self.protocol + "//hiteka.net/api/GetCurrentTrack/?mount=" + self.mountSourse[self.curentState.mount][self.curentState.bitrate].fullMount,
            cache: false,
            success: (data: ICurrentTrackName) => {
                console.log(data);
                self._updateCurrentTreakName(data);

            }
        })
        }

    private _updateCurrentTreakName(data: ICurrentTrackName) {

        if (data.mount !== undefined && data.mount !== this.curentState.mount)
            return;

        this.controls.trackName.innerText = data.nameTrack;

        if (this.controls.vkSearch) {
            var serch = "https://vk.com/search?c[q]=" + data.nameTrack + "&c[section]=audio"
            this.controls.vkSearch.onclick = () => { window.open(encodeURI(serch), '_blank'); };
        }

        if ( this.curentState.nameTrack != data.nameTrack ) {
            if (this.callback.onChangeNameTrack ) {
                this.callback.onChangeNameTrack(this.curentState.mount, data.nameTrack);
            }
        }
        this.curentState.nameTrack = data.nameTrack;


    }

    public changeVolume() {
        console.log(this.controls.volume.value);
        var volume = parseInt(this.controls.volume.value)/100;
        this.audio.volume = volume;

        if (this.callback.onChangeVolume) {
            this.callback.onChangeVolume(volume);
        }
        
    }

    public playStop() {



        if (this.audio.paused) {
            if (this.curentState.mount == null) {
                this.curentState.mount = "radiant";
            }
            this.audio.src = this.mountSourse[this.curentState.mount][this.curentState.bitrate].streamUrl;
            this.audio.play();
            this.timer.start();

            if (this.callback.onPlay) {
                this.callback.onPlay();
            }
        }
        else {
            this.audio.pause();
            this.audio.src = "";
            this.timer.stop();

            if (this.callback.onStop) {
                this.callback.onStop();
            }

        }

        this.controls.trackName.innerText = "";
        if (this.controls.vkSearch != undefined) {
            this.controls.vkSearch.onclick = null;
        }
        this.___updateCurrentTreakName();
    }
    public mute() {

        if (this.audio.volume > 0) {
            this.controls.volume.value = "0";

        } else {
            this.controls.volume.value = "50";

        }
        this.changeVolume();



    }

    public changeQuality(newQuality: number)
    {
        this.curentState.bitrate = newQuality;
        if (this.curentState.mount !== null && !this.audio.paused) {
            this.audio.src = this.mountSourse[this.curentState.mount][this.curentState.bitrate].streamUrl;
            this.audio.play();
        }
    } 

    public changeStream(newStream: string) {
        if (this.mountSourse[newStream] === undefined || this.curentState.mount === newStream)
            return;
        this.curentState.mount = newStream;
        if (this.curentState.mount !== null && !this.audio.paused) {
            this.audio.src = this.mountSourse[this.curentState.mount][this.curentState.bitrate].streamUrl;
            this.audio.play();
            this.timer.reset();
        }
        this.___updateCurrentTreakName();
    }

}