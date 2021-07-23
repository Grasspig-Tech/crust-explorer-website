import request from '@/utils/request'

export function getEraListApi({ address, page, pageSize }) {
    return request({
        url: `/eraStat/list?validator=${address}&current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}