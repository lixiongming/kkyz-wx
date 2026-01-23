#SVGA插件


##使用插件

属性	类型	默认值	说明
url	String	无	必填项，svga 文件的路径，支持本地 url 和网络 url
autoPlay	boolean	true	是否自动播放
loops	Number	1	设置动画的循环次数，0 表示无限循环
fillMode	enum	Forward	取值：Backward/Forward; Forward 表示动画结束后，将停留在最后一帧。Backward 表示动画结束后，将停留在第一帧。
clearsAfterStop	boolean	false	当动画播放完成后，是否清空画布
begin	String	start	选填项：start/end，用于指定动画帧数停留开始或结束

事件
@finishedAnimation

动画播放结束后执行

方法

play

开始播放

this.$refs.svga.play();

stop

结束播放

this.$refs.svga.stop();

playReverse 反向播放

this.$refs.svga.playReverse();

pause

暂停播放

this.$refs.svga.pause();

<w-svga
    ref="svga"
    style="width:100rpx;height:100rpx"
    :url="url"
    :autoPlay="true"
    :loops="loops"
    @finishedAnimation="finishedAnimation"
></w-svga>