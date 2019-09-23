$(function () {
    //0：自定义滚动条
    $(".content_list").mCustomScrollbar();

    let $audio = $("audio");
    let player = new Player($audio);
    let progress;
    let voiceProgress;



    //定义一个方法，创建一条音乐
    function createMusicItem(index,music) {
        let $item =$(" <li class=\"list_music\">\n" +
            "<div class=\"list_check\"><i></i></div>\n" +
            "<div class=\"list_number\">"+(index+1)+"</div>\n" +
            "<div class=\"list_name\">"+music.name+"\n" +
            "<div class=\"list_menu\">\n" +
            "<a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "<a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "<a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "<a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "</div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">"+music.singer+"</div>\n" +
            "<div class=\"list_time\">\n" +
            "<span>"+music.time+"</span>\n" +
            "<a href=\"javascript:;\" title=\"删除\" class=\"list_menu_del\"></a>\n" +
            "</div>\n" +
            "</li>");
        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }
// *********************************************************************************
    //1：加载歌曲列表

    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType:"json",
            success:function (data) {
                player.musicList = data;
                //3.1遍历获取到的数据，创建每一条音乐
                let $musiclist = $(".content_list ul");
                $.each(data,function (index,ele) {
                    let $item = createMusicItem(index,ele);
                    $musiclist.append($item);
                    initMusicInfo(data[0]);
                    initMusicLyric(data[0]);
                })
            },
            error: function (e) {
                console.log(e);
            },

        });
    }

// *********************************************************************************
    //2.初始化歌曲信息
    function initMusicInfo(music) {
        //获取对应的元素
        let $musicImage = $(".song_info_pic img");
        let $musicName = $(".song_info_name a");
        let $musicSinger = $(".song_info_singer a");
        let $musicAblum = $(".song_info_ablum a");

        let $musicProgressName = $(".music_progress_name");
        let $musicProgressTime = $(".music_progress_time");
        let $musicBg = $(".mask_bg");

        //给获取到的元素赋值
        $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);

        $musicProgressName.text(music.name + "/" + music.singer);
        $musicProgressTime.text("00:00/" + music.time);
        $musicBg.css("background","url('" + music.cover + "')");

    }

    //3.初始化歌词信息
    function initMusicLyric(music) {
        let lyric = new Lyric(music.link_lrc);
        lyric.loadLrc();
    }
    //3初始化进度条
    initProgress();
    function initProgress() {
        let $progressBar = $(".music_progress_bar");
        let $progressLine = $(".music_progress_line");
        let $progressDot = $(".music_progress_dot");
        progress = Progress($progressBar,$progressLine,$progressDot);

        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });


        let $voiceBar = $(".music_voice_bar");
        let $voiceLine = $(".music_voice_line");
        let $voiceDot = $(".music_voice_dot");
        voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);

        voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }

    //4.初始化事件监听
    initEvents();
    function initEvents(){
        //1.监听歌曲的移入移出事件
        $(".content_list").delegate(".list_music","mouseenter",function () {
            //显示子菜单
            $(this).find(".list_menu ").css("display","block")
            $(this).find(".list_time a").css("display","block")
            //隐藏时长
            $(this).find(".list_time span").fadeOut(100);
        })
        $(".content_list").delegate(".list_music","mouseleave",function () {
            //隐藏子菜单
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            //显示时长
            $(this).find(".list_time span").fadeIn(100);
        })
        // 2:监听复选框的点击
        $(".content_list").delegate(".list_check","click",function () {
            $(this).toggleClass("list_checked");
        });

        //3.添加子菜单播放按钮的监听
        let $musicPlay=$(".music_play");

        $(".content_list").delegate(".list_menu_play","click",function () {
            let $item = $(this).parents(".list_music");
            console.log($item.get(0).index);
            console.log($item.get(0).music);
            //3.1切换播放图标
            $(this).toggleClass("list_menu_play2");
            //3.2复原其它的播放图标
            $(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //3.3同步底部播放按钮
            if($(this).attr("class").indexOf("list_menu_play2")!=-1){
                //当前子菜单按钮是播放状态
                $musicPlay.addClass("music_play2");
                //让文字高亮
                $(this).parents(".list_music").find("div").css("color","#fff")
                $(this).parents(".list_music").siblings().find("div").css("color","rgba(255,255,255,0.5)");

            }else{
                //当前子菜单按钮不是播放状态
                $musicPlay.removeClass("music_play2");
                //让文字不高亮
                $(this).parents(".list_music").find("div").css("color","rgba(255,255,255,0.5)");
            }
            //3.4切换序号的状态
            $(this).parents(".list_music").find(".list_number").toggleClass("list_number2")
            //3.2复原其它的序号的状态
            $(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number2");

            //3.5播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music);

            //3.6切换歌曲信息
            initMusicInfo($item.get(0).music)
        })

        //4.监听底部控制区域播放按钮的点击
        $musicPlay.click(function () {
            //判断有没有播放过音乐
            if(player.currentIndex == -1){
                //没有播放过音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else{
                //已经播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        })
        //5.监听底部控制区域上一首按钮的点击
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        })
        //6.监听底部控制区域下一首按钮的点击
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        })

        //7：监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del","click",function () {
            //找到被点击的音乐
            let $item = $(this).parents(".list_music");

            //判断当前删除的是否是正在播放的
            if($item.get(0).index  == player.currentIndex){
                $(".music_next").trigger("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);

            //重新排序
            $(".list_music").each(function (index,ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index+1);
            })
        })
        //8:监听播放进度
        player.musicTimeUpdate(function (currentTime,duration,timeStr) {
            //同步时间
            $(".music_progress_time").text(timeStr);
            //同步进度条
            // $(".music_progress_time").text(timeStr);
            //计算播放比例
            let value = currentTime / duration*100;
            progress.setProgress(value);
        })

        //9:监听声音按钮的点击
        $(".music_voice_icon").click(function () {
            //1:图标的切换
            $(this).toggleClass("music_voice_icon2");
            //2：声音切换
            if($(this).attr("class").indexOf("music_voice_icon2") != -1){
                //变为没有声音
                player.musicVoiceSeekTo(0);
            }else{
                //变为有声音
                player.musicVoiceSeekTo(1);
            }
        })

    }



})
