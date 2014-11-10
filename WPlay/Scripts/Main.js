var Player;
window.addEventListener("load", function () {
    Player = new WPlayWalkman({
        buttonPlay: document.getElementById("play_pause"),
        volume: document.getElementById("volume_value"),
        trackName: document.getElementById("name_track"),
        mute: document.getElementById("mute"),
        vkSearch: document.getElementById("search"),
        timer: document.getElementById("timer")
    }, {
        onChangeNameTrack: function (mount, trak) {
            console.log(mount + " " + trak);
        },
        onChangeVolume: function (volume) {
            if (volume == 0) {
                document.getElementById("mute").classList.add("mute_true");
            } else {
                document.getElementById("mute").classList.remove("mute_true");
            }
        },
        onPlay: function () {
            document.getElementById("play_pause").classList.add("pause");
        },
        onStop: function () {
            document.getElementById("play_pause").classList.remove("pause");
        }
    });

    document.getElementById("quality").addEventListener("click", function (event) {
        var self = event.srcElement;
        if (self.classList.contains("quality_256") === true) {
            Player.changeQuality(128);
        } else {
            Player.changeQuality(256);
        }

        self.classList.toggle("quality_256");
    });

    document.getElementById("changeSkin").addEventListener("click", function () {
        var link = document.getElementById("style-skin");
        link.href = '/Content/css/blue-skin.css';
    });

    document.getElementById("stream_radiant").addEventListener("click", function () {
        Player.changeStream("radiant");
        document.getElementById("line_radiant").classList.add("line_r");
        document.getElementById("line_dire").classList.remove("line_d");
    }, false);

    document.getElementById("stream_dire").addEventListener("click", function () {
        Player.changeStream("dire");
        document.getElementById("line_radiant").classList.remove("line_r");
        document.getElementById("line_dire").classList.add("line_d");
    }, false);
    //document.getElementById("style-skin").href = 'Content/css/blue-skin.css'
}, false);
//# sourceMappingURL=Main.js.map
