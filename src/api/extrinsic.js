import request from '@/utils/request'

export function getBlockExtrinsicApi({ blockNum, page, pageSize }) {
    return request({
        url: `/extrinsic/page/${blockNum}?current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}

export function getExtrinsicListApi({ address, page, pageSize }) {
    return request({
        url: `/extrinsic/page?address=${address || ''}&current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}

export function getExtrinsicLineApi(key) {
    return request({
        url: `/extrinsic/trendLine/${key}`,
        method: 'get',
        data: {},
    })
}

export function getExtrinsicDetailApi(params) {
    var url = ''
    if (params.eventIndex) url += `eventIndex=${params.eventIndex}&`
    if (params.extrinsicIndex) url += `extrinsicIndex=${params.extrinsicIndex}&`
    if (params.extrinsicHash) url += `extrinsicHash=${params.extrinsicHash}&`
    url = url.substring(0, url.length - 1);
    return request({
        url: `/extrinsic/info?${url}`,
        method: 'get',
        data: {},
    })
}
