import request from '@/utils/request'

export function getTransferListApi({ address, page, pageSize }) {
    return request({
        url: `/transfer/page?address=${address || ''}&current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}

export function getTransferLineApi(key) {
    return request({
        url: `/transfer/trendLine/${key}`,
        method: 'get',
        data: {},
    })
}