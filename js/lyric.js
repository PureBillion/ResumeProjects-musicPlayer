(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        construct: Lyric,
        musicList:[],
        init: function (path) {
            this.path = path;
        },
        loadLrc:function () {
            let $this = this;
            $.ajax({
                url: $this.path,
                dataType:"text",
                success:function (data) {
                    // console.log(data);
                    $this.parseLyric(data);
                },
                error: function (e) {
                    console.log(e);
                },

            });
        },
        parseLyric:function (data) {
            let array = data.split("\n");
            // console.log(array);
            //正则表达式匹配时间
            let timeReg = /\[\d*:\d*\.\d*\]/
            //遍历取出每一行歌词
            $.each(array,function (index,ele) {

                let res = timeReg.exec(ele);
                // console.log(res);

                let timeStr = res[1];//00:00.92
                let res2 = timeStr.split(":");

                let min = parseInt(res2[0])*60;
                let sec = parseFloat(res2[1]);
                let time = Number(min + sec);
                console.log(time)
            })
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window)
