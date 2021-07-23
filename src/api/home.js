import request from '@/utils/request'

export function getHomeSidApi(timestamp, md5) {
    return request({
        url: '/runtime/metadata',
        method: 'get',
        data: {},
        headers: { "timestamp": timestamp, "sign": md5 },
    })
}

export function homeDataApi() {
    return request({
        url: '/network/overview',
        method: 'get',
        data: {},
    })
}

export function searchApi(queryParam) {
    return request({
        url: `/composite/info?queryParam=${queryParam}`,
        method: 'post',
        data: {}
    })
}