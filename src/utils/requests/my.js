import {
	request
} from '../request.js'
// import {
// 	request
// } from '../request-mock.js'

import {
	useMemberStore
} from '../../stores/modules/member.js'

const memberStore = useMemberStore()

// mock
// 获取个人信息 authCode:免登授权码
export function loginAPI(authCode) {
	return request({
		method: 'GET',
		url: `/api/my/login?authCode=${authCode}`
	})
}

// 获取 token
export function tokenAPI() {
	return request({
		method: 'POST',
		url: 'https://api.dingtalk.com/v1.0/oauth2/accessToken',
		header: {
			'Content-Type': 'application/json'
		},
		data: {
			// 灵算
			// appKey: 'dingbmu0nzrqywv9bgg4',
			// appSecret: '6WOUUQ33hLbMEFWad1QjpBIIx0X6fABKL4OlwhAR4UK8GQjnPwKoQ194aay-gc7f'
			// 保定学院
			appKey: 'dingiijqzm3wjsueb2cf',
			appSecret: '9IC-qLHQQfYi97WI4wVXF8U8XkZ4jtNyDqCgnph3U_X8sWi0lgXhbQgiYyH4Hzo6'
			// 保定学院测试
			// appKey: 'dingyhnrtullmzlgss2j',
			// appSecret: 'Fu_1fJL8b0ygJYFBN-9ZE97JwNK5TApJEKO8sMJPh9RlsQQjTlX-ufA-r5Ux9yGo'
		}
	})
}

// 获取用户 userid
export function userIdAPI() {
	return request({
		method: 'POST',
		url: `https://oapi.dingtalk.com/topapi/v2/user/getuserinfo?access_token=${memberStore.token.accessToken}`,
		data: {
			code: memberStore.authCode
		}
	})
}

// 获取用户信息
export function userInfoAPI() {
	return request({
		method: 'POST',
		url: `https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${memberStore.token.accessToken}`,
		data: {
			userid: memberStore.userId
		}
	})
}

// 通讯录 - 获取部门详情
export function deptDetailAPI(deptId) {
	return request({
		method: 'POST',
		url: `https://oapi.dingtalk.com/topapi/v2/department/get?access_token=${memberStore.token.accessToken}`,
		data: {
			dept_id: deptId
		}
	})
}

// 家校通讯录 获取班级内学生详情列表
export function userRelationListAPI(class_id) {
	return request({
		method: 'POST',
		url: `https://oapi.dingtalk.com/topapi/edu/user/relation/list?access_token=${memberStore.token.accessToken}`,
		data: {
			page_no: 1,
			page_size: 30,
			class_id
		}
	})
}

// 家校通讯录 - 获取人员详情
export function schoolUserInfoAPI(class_id, userid, role = 'student') {
	return request({
		method: 'POST',
		url: `https://oapi.dingtalk.com/topapi/edu/user/get?access_token=${memberStore.token.accessToken}`,
		data: {
			class_id,
			userid,
			role: 'student'
		}
	})
}

// 家校通讯录 - 获取部门详情
export function schoolDeptDetailAPI(deptId) {
	return request({
		method: 'POST',
		url: `https://oapi.dingtalk.com/topapi/edu/dept/get?access_token=${memberStore.token.accessToken}`,
		data: {
			dept_id: deptId
		}
	})
}