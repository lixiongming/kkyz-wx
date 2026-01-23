import moment from 'moment';

// 格式化日期
export function dateformat(date, format) {
    return moment(date).format(format);
}