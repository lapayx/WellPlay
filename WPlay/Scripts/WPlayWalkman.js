/// <reference path="_references.ts" />
var Timer = (function () {
    function Timer() {
        this.second = 0;
        this.handler = null;
    }
    Timer.prototype.start = function () {
        var self = this;
        this.second = 0;
        this.handler = setInterval(function () {
            self._upTime();
        }, 1000);
    };

    Timer.prototype.stop = function () {
        clearInterval(this.handler);
        this.handler = null;
    };

    Timer.prototype.reset = function () {
        this.stop();
        this.start();
    };

    Timer.prototype.getTime = function () {
        if (!this.handler) {
            return null;
        }

        var temp = this.second;
        var second = temp % 60;
        var minut = Math.floor(temp / 60 % 60);
        var hour = Math.floor(temp / 3600);
        return hour + ":" + (minut < 10 ? "0" : "") + minut + ":" + (second < 10 ? "0" : "") + second;
    };

    Timer.prototype._upTime = function () {
        this.second++;
    };
    return Timer;
})();

var WPlayWalkman = (function () {
    function WPlayWalkman(param) {
        ///TODO Допистаь
        this.callback = {};
        this.audio = new Audio();
        this.controls = {
            buttonPlay: null,
            volume: null,
            trackName: null,
            mute: null,
            vkSearch: null,
            timer: null
        };
        this.curentState = {
            mount: null,
            bitrate: 128,
            nameTrack: null
        };
        this.mountSourse = { radiant: {}, dire: {} };
        for (var key in param) {
            if (key === undefined) {
                continue;
            }
            this.controls[key] = param[key];
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
    WPlayWalkman.prototype.initi = function () {
        this.protocol = window.location.protocol;
        this._initMount();
        this._initEvents();
    };

    WPlayWalkman.prototype._initMount = function () {
        var self = this;
        $.ajax({
            url: self.protocol + "//hiteka.net/api/GetAllMount",
            success: function (data) {
                self._initMountSource(data);
            }
        });
    };
    WPlayWalkman.prototype._initMountSource = function (info) {
        var length = info.length;

        for (var i = 0; i < length; i++) {
            var obj = info[i];

            if (this.audio.canPlayType(obj.mimeType) === "") {
                continue;
            }
            var detalemount = obj.mount.slice(1).split("_");

            if (detalemount[1] === "nonstop") {
                continue;
            }

            if (this.mountSourse[detalemount[0]] == undefined) {
                this.mountSourse[detalemount[0]] = {};
            }

            if (this.mountSourse[detalemount[0]][obj.bitrate] == undefined) {
                this.mountSourse[detalemount[0]][obj.bitrate] = { fullMount: obj.mount, streamUrl: obj.url };
            }
        }
    };

    WPlayWalkman.prototype._initEvents = function () {
        var self = this;
        this.controls.volume.addEventListener("change", function (e) {
            self.changeVolume();
        }, false);
        this.controls.buttonPlay.addEventListener("click", function (e) {
            self.playStop();
        }, false);
        this.controls.mute.addEventListener("click", function (e) {
            self.mute();
        }, false);

        if (this.controls.timer != null) {
            setInterval(function () {
                self.controls.timer.innerText = self.timer.getTime();
            }, 1000);
        }

        setInterval(function () {
            self.___updateCurrentTreakName();
        }, 10000);
    };
    WPlayWalkman.prototype.___updateCurrentTreakName = function () {
        var self = this;
        if (self.audio.paused || self.curentState.mount == null)
            return;
        $.ajax({
            url: self.protocol + "//hiteka.net/api/GetCurrentTrack/?mount=" + self.mountSourse[self.curentState.mount][self.curentState.bitrate].fullMount,
            cache: false,
            success: function (data) {
                console.log(data);
                self._updateCurrentTreakName(data);
            }
        });
    };

    WPlayWalkman.prototype._updateCurrentTreakName = function (data) {
        if (data.mount !== undefined && data.mount !== this.curentState.mount)
            return;

        this.controls.trackName.innerText = data.nameTrack;

        if (this.controls.vkSearch) {
            var serch = "https://vk.com/search?c[q]=" + data.nameTrack + "&c[section]=audio";
            this.controls.vkSearch.onclick = function () {
                window.open(encodeURI(serch), '_blank');
            };
        }

        /* if ( this.curentState.nameTrack != data.nameTrack ) {
        if ( this.callback.changeNameTrack ) {
        this.callback.changeNameTrack(this.curentState.mount, this.curentState.nameTrack);
        }
        }*/
        this.curentState.nameTrack = data.nameTrack;
    };

    WPlayWalkman.prototype.changeVolume = function () {
        console.log(this.controls.volume.value);
        var volume = parseInt(this.controls.volume.value) / 100;
        this.audio.volume = volume;

        if (volume == 0) {
            this.controls.mute.classList.add("mute_true");
        } else {
            this.controls.mute.classList.remove("mute_true");
        }
    };

    WPlayWalkman.prototype.playStop = function () {
        if (this.audio.paused) {
            if (this.curentState.mount == null) {
                this.curentState.mount = "radiant";
            }
            this.audio.src = this.mountSourse[this.curentState.mount][this.curentState.bitrate].streamUrl;
            this.audio.play();

            this.controls.buttonPlay.classList.add("pause");
            this.timer.start();
        } else {
            this.audio.pause();
            this.audio.src = "";
            this.controls.buttonPlay.classList.remove("pause");
            this.timer.stop();
        }

        this.controls.trackName.innerText = "";
        if (this.controls.vkSearch != undefined) {
            this.controls.vkSearch.onclick = null;
        }
        this.___updateCurrentTreakName();
    };
    WPlayWalkman.prototype.mute = function () {
        if (this.audio.volume > 0) {
            this.controls.volume.value = "0";
        } else {
            this.controls.volume.value = "50";
        }
        this.changeVolume();
    };

    WPlayWalkman.prototype.changeQuality = function (newQuality) {
        this.curentState.bitrate = newQuality;
        if (this.curentState.mount !== null && !this.audio.paused) {
            this.audio.src = this.mountSourse[this.curentState.mount][this.curentState.bitrate].streamUrl;
            this.audio.play();
        }
    };

    WPlayWalkman.prototype.changeStream = function (newStream) {
        if (this.mountSourse[newStream] === undefined || this.curentState.mount === newStream)
            return;
        this.curentState.mount = newStream;
        if (this.curentState.mount !== null && !this.audio.paused) {
            this.audio.src = this.mountSourse[this.curentState.mount][this.curentState.bitrate].streamUrl;
            this.audio.play();
            this.timer.reset();
        }
        this.___updateCurrentTreakName();
    };
    return WPlayWalkman;
})();
//# sourceMappingURL=WPlayWalkman.js.map
