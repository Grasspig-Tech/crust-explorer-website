import request from '@/utils/request'

// 质押额度
export function getPledgesQuotaListApi({ page, pageSize }) {
    return request({
        url: `/pledges/quota?current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}

// 有效质押
export function getPledgesActiveListApi({ page, pageSize }) {
    return request({
        url: `/pledges/active?current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}