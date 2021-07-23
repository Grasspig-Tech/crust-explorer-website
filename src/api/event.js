import request from '@/utils/request'

export function getBlockEventApi({ blockNum, page, pageSize }) {
    return request({
        url: `/events/page/${blockNum}?current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}
