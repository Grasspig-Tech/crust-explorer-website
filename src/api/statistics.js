import request from '@/utils/request'

export function getEffectivePledgeApi(code) {
    return request({
        url: `/maps/${code}`,
        method: 'get',
        data: {},
    })
}
