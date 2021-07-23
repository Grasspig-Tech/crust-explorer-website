import request from '@/utils/request'

export function getNominatorsListApi({ address, page, pageSize }) {
    return request({
        url: `/nominators/${address}?current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}