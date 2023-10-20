import {
	request
} from './request.js';

// 语文组 / 数学组...

// 获取：年级-班级
export function classAPI() {
	return request({
		method: 'GET',
		url: `/api/inquire/class`
	})
}

// 班主任-数据
export function authorityHighAPI(cla, startDate, endDate) {
	return request({
		method: 'POST',
		url: `/api/inquire/authorityHigh`,
		data: {
			cla,
			startDate,
			endDate
		}
	})
}

// 任课老师-数据
export function authorityLowAPI(cla, startDate, endDate) {
	return request({
		method: 'POST',
		url: `/api/inquire/authorityLow`,
		data: {
			cla,
			startDate,
			endDate
		}
	})
}

// 班级总数据详情
export function classDetailAPI(cla, subject, startDate, endDate) {
	return request({
		method: 'POST',
		url: `/api/inquire/classDetail`,
		data: {
			cla,
			subject,
			startDate,
			endDate
		}
	})
}