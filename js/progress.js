(function (window) {
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        construct: Progress,

        init: function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove:false,
        progressClick:function (callBack) {
            let $this = this;   //此时此刻的this是progress
            //监听背景的点击
            this.$progressBar.click(function (callBack) {
                //获取背景距离默认窗口的位置
                 let normalLeft = $(this).offset().left;
                console.log(normalLeft);
                //获取点击的位置距离窗口位置
                let eventLeft = event.pageX;
                console.log(eventLeft);
                //设置前景的宽度
                $this.$progressLine.css("width",eventLeft - normalLeft);
                $this.$progressDot.css("left",eventLeft - normalLeft);
                //计算进度条的比例
                let value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            })

        },
        progressMove:function (callBack) {
            let $this = this;
            //1.监听鼠标的按下事件
            this.$progressBar.mousedown(function () {
                $this.isMove = true;
                //获取背景距离默认窗口的位置
                let normalLeft = $(this).offset().left;
                let barWidth = $this.$progressBar.width();
                //2.监听鼠标的移动事件
                $(document).mousemove(function () {
                    //获取点击的位置距离窗口位置
                    let eventLeft = event.pageX;
                    let offset = normalLeft - eventLeft;
                    if (offset >= 0 && offset <= barWidth){
                        //设置前景的宽度
                        $this.$progressLine.css("width",eventLeft - normalLeft);
                        $this.$progressDot.css("left",eventLeft - normalLeft);
                    }

                    //计算进度条的比例
                    let value = (eventLeft - normalLeft) / $(this).width();
                    callBack(value);
                })
            })

            //3.监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
            })

        },
        setProgress:function (value) {
            // if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$progressLine.css({
                width: value + "%"
            });
            this.$progressDot.css({
                left: value + "%"
            });
        }

    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)
