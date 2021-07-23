
import request from '@/utils/request'

export function getVerifierListApi({ role, page, pageSize }) {
    return request({
        url: `/validators/${role}?current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}

export function getVerifierDetailApi(address) {
    return request({
        url: `/validators/info/${address}`,
        method: 'get',
        data: {},
    })
}

// 账户详情
export function getAccountDetailApi(address) {
    return request({
        url: `/account/info/${address}`,
        method: 'get',
        data: {},
    })
}
