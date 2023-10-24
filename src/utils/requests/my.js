import {
	request
} from '../request.js'


// 获取个人信息 authCode:免登授权码
export function loginAPI(authCode) {
	return request({
		method: 'GET',
		url: `/api/my/login?authCode=${authCode}`
	})
}