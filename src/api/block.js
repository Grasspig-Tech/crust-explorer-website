import request from '@/utils/request'

export function getBlockListApi({ page, pageSize }) {
    return request({
        url: `/blocks/page?current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}

export function getBlockDetailByNumApi(blockNum) {
    return request({
        url: `/blocks/${blockNum}`,
        method: 'get',
        data: {},
    })
}