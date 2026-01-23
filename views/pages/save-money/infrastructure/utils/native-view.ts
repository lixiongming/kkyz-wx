// plus是html5+方法，如需使用其他方法可通过链接：https://www.html5plus.org/doc/zh_cn/nativeobj.html

/**
 * app端通过原生plus方法生成view块(例如：弹窗提示等)
 * 
 */
export class NativeView {
    constructor({ options, duration }) {
        let res_params;
        if (options instanceof Function) {
            res_params = options();
        } else {
            res_params = options;
        }
        // 创建view
        this.view = new plus.nativeObj.View('myView', res_params);
        // 监听view块显示状态
        this.is_show = false;
        // 显示时长
        this.duration = duration || null;
        // 显隐时长定时器
        this.timeHandler = null;
    }
    // 显示
    show(data, type = 'coins-popup') {
        if (!this.is_show) {
            // 设置内容
            this.setContent(data, type);
            // 设置显示时长
            this.setDuration(data.duration);
            // 触发显示事件
            this.view.show();
            // 修改状态
            this.updateStatus(true);
        }
        
    }
    // 隐藏
    hide() {
        if (this.is_show) {
            // 触发隐藏事件
            this.view.hide();
            // 修改状态
            this.updateStatus(false);
        }
    }
    // 修改显隐状态方法
    updateStatus(status) {
        this.is_show = status;
    }
    // 设置弹窗时长
    setDuration(duration) {
        if (duration || this.duration) {
            this.duration = duration || this.duration;
            // 设定定时器，隐藏view块
            this.timeHandler = setTimeout(() => {
                this.hide();
            }, this.duration);
        }
    }
    // 绘制圆角背景
    drawRect(styles, position, id = 'rect1') {
        this.view.drawRect(styles, position, id);
    }
    // 绘制图片
    drawBitmap(src, sprite = {}, position = {}, id = 'img1') {
        this.view.drawBitmap(src, sprite, position, id);
    }
    // 绘制文本
    drawText(text, position = {}, styles = {}, id = 'text1') {
        // 绘制文本
        this.view.drawText(text, position, styles, id);
    }
    // 设置原生view块里面的内容
    setContent(data, type) {
        switch(type) {
            case 'coins-popup':
                this.goldTaskReward(data);
                break;
            default:
                break;
        }
    }
    // 金币任务奖励
    goldTaskReward(data) {
        const { text1, icon = '/static/images/home/gold-coin-logo-middle.png', text2 } = data;
        // 绘制圆角背景
        this.drawRect({
            color: 'rgba(0,0,0,0.8)', // 背景颜色
            radius: '25px' // 圆角半径
            }, {
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
        });
        
        // 绘制图片
        this.drawBitmap(icon, {}, {
            top: '24px', // 图片顶部位置
            left: (220 - 40) / 2 + 'px', // 图片左边位置
            width: '40px', // 图片宽度
            height: '40px' // 图片高度
        });
        
        // 绘制文本
        this.drawText(text1, {
            top: '72px', // 文本顶部位置
            left: '10px', // 文本左边位置
            width: '200px', // 文本宽度
            height: '30px' // 文本高度
            }, {
            color: '#ffffff', // 文本颜色
            size: '16px', // 文案大小
            weight: 'bold', // 加粗
            align: 'center', // 文本对齐方式
        });

        this.drawText(text2, {
            top: '110px', // 文本顶部位置
            left: '10px', // 文本左边位置
            width: '200px', // 文本宽度
            height: 'wrap_content' // 文本高度
            }, {
            color: 'rgba(255,255,255,0.8)', // 文本颜色
            size: '12px', // 文案大小
            align: 'center', // 文本对齐方式
            whiteSpace: 'normal'
        }, 'text2');
    }
}

// 创建金币弹窗奖励实例方法
export const coinsPopupnativeView = () => {
    return new NativeView({
        // view块位置配置
        options: () => {
            let windowHeight = uni.getSystemInfoSync().windowHeight;
            let windowWidth = uni.getSystemInfoSync().windowWidth;
            return {
                top: (windowHeight - 150) / 2 + 'px', // 设置View的顶部位置
                left: (windowWidth - 220) / 2 + 'px', // 设置View的左边位置
                width: '220px', // 设置View的宽度
                height: '150px', // 设置View的高度
                position: 'absolute', // 绝对定位
            }
        },
        // 显示时长配置
        duration: 2000,
    });
}

// 设置全局api
export function setNativeView() {
    // #ifdef APP-PLUS
    uni.$nativeView = coinsPopupnativeView();
    // #endif
    // #ifdef H5
    // 防止h5报错
    uni.$nativeView = {
        show() {},
        hide() {},
    }
    // #endif
}