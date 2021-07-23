import request from '@/utils/request'

export function getRewardListApi({ address, page, pageSize }) {
    return request({
        url: `/rewardSlashes/page?address=${address}&current=${page}&size=${pageSize}`,
        method: 'get',
        data: {},
    })
}