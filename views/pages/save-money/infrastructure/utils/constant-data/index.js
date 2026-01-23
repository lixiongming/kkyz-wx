// 常量数据可直接存储CONSTANTS中
const CONSTANTS = {
    // 性别数据
    genders:[
        { id: 1, text: '男', value: 1 },
        { id: 2, text: '女', value: 2 },
        { id: 3, text: '保密', value: 3 },
    ],
    // 外链跳转方式
    outer_chains: [
        { id: 1, text: 'H5-webview', value: 1 },
        { id: 2, text: 'H5-browser', value: 2 },
        { id: 3, text: 'Applet', value: 3 },
        { id: 4, text: '微信小程序', value: 4 },
    ],
    // 私聊发送消息类型
    private_chat_message_types: [
        { id: 1, text: '文本', value: 1 },
        { id: 2, text: '图片', value: 2 },
        { id: 3, text: '表情', value: 3 },
    ],
}

// 外链跳转方式
const OUTER_CHAIN = []



// 区别数据
export default CONSTANTS