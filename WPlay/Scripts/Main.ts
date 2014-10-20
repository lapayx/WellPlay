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




class Walkman {
    

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

    private timer: Timer;

    constructor(param: IWalkmanParam) {
        for (var key in param) {
            if (key === undefined) {
                continue;

            }
            this.controls[key] = param[key]
        }
        /*this.controls.buttonPlay = param.buttonPlay;
        this.controls.volume = param.volume;
        this.controls.trackName = param.trackName;
        this.controls.mute = param.mute;
        this.controls.vkSearch = param.vkSearch;
        this.controls.timer = param.timer;
*/

        this.timer = new Timer();
        this.audio.volume = 0.5;
        this.audio.loop = true;
        this.initi();

    }

    private initi() {
        this._initMount();
        this._initEvents();
    }

    private _initMount() {
        var self = this;
        $.ajax({
            url: "http://hiteka.net/api/GetAllMount",
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
            url: "http://hiteka.net/api/GetCurrentTrack/?mount=" + self.mountSourse[self.curentState.mount][self.curentState.bitrate].fullMount,
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

        this.curentState.nameTrack = data.nameTrack;
        this.controls.trackName.innerText = data.nameTrack;
        if (this.controls.vkSearch != undefined ) {
            var serch = "https://vk.com/search?c[q]=" + data.nameTrack + "&c[section]=audio"
            this.controls.vkSearch.onclick = () => { window.open(encodeURI(serch), '_blank'); };
        }


    }

    public changeVolume() {
        console.log(this.controls.volume.value);
        var volume = parseInt(this.controls.volume.value)/100;
        this.audio.volume = volume;

        if (volume == 0) {
            this.controls.mute.classList.add("mute_true");
        } else {
            this.controls.mute.classList.remove("mute_true");
        }
        ///this.controls.
    }

    public playStop() {



        if (this.audio.paused) {
            if (this.curentState.mount == null) {
                this.curentState.mount = "radiant";
            }
            this.audio.src = this.mountSourse[this.curentState.mount][this.curentState.bitrate].streamUrl; // .currenMount;/// this.infoAboutStreams[this.currentStream.name][this.currentStream.quality].listenUrl;
            this.audio.play();
            //this._helpAddClassForControl(this.play, "pause");
            //document.getElementById("buffered").style.display = "block";
            //log("play");
            this.controls.buttonPlay.classList.add("pause");
            this.timer.start();
        }
        else {
            this.audio.pause();
            this.audio.src = "";
            // this._helpAddClassForControl(this.play, "play");
            // this.currentTimePlay = new Date(2000, 1, 1, 00, 00, 00, 00);
            // document.getElementById("buffered").style.display = "none";
            // log("pause");
            this.controls.buttonPlay.classList.remove("pause");
            this.timer.stop();

        }

        this.controls.trackName.innerText = "";
        if (this.controls.vkSearch != undefined) {
            this.controls.vkSearch.onclick = null;
        }
        this.___updateCurrentTreakName();
        
        //this.controls.buttonPlay.classList.remove("pause");
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

var Player: Walkman;
window.addEventListener("load", () => {
    //console.log(template.x);
    //  var t: Main;
    // t = new Main();
    Player = new Walkman({
        buttonPlay: document.getElementById("play_pause"),
        volume: <HTMLInputElement>document.getElementById("volume_value"),
        trackName: document.getElementById("name_track"),
        mute: document.getElementById("mute"),
        vkSearch: document.getElementById("search"),
        timer: document.getElementById("timer")

    });

    document.getElementById("quality").addEventListener("click", (event) => {
        var self = <HTMLElement>event.srcElement;
        if (self.classList.contains("quality_256") === true) {
            Player.changeQuality(128);
        } else {
            Player.changeQuality(256);
        }
        
        self.classList.toggle("quality_256");

    })

    document.getElementById("changeSkin").addEventListener("click", () => {
        var link = <HTMLLinkElement>document.getElementById("style-skin");
        link.href = '/Content/css/blue-skin.css'

    })

    document.getElementById("stream_radiant").addEventListener("click", () => {
        Player.changeStream("radiant");
        document.getElementById("line_radiant").classList.add("line_r");
        document.getElementById("line_dire").classList.remove("line_d");
    }, false);

    document.getElementById("stream_dire").addEventListener("click", () => {
        Player.changeStream("dire");
        document.getElementById("line_radiant").classList.remove("line_r");
        document.getElementById("line_dire").classList.add("line_d");
    }, false);


    //document.getElementById("style-skin").href = 'Content/css/blue-skin.css'



}, false);