
const env = process.env.MODE || process.env.NODE_ENV
// 开发环境
export function development() {
    return env === 'development';
}

// 生产环境
export function production() {
    return env === 'production' ;
}