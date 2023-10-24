import {
	request
} from '../request.js';

// 本次统计 - 饼状图
export function statisticsAPI(userId, startDate, endDate) {
	return request({
		method: 'POST',
		url: `/api/details/statistics`,
		data: {
			userId,
			startDate,
			endDate
		}
	})
}

// 正确率 - 折线图
export function accuracyAPI(userId, startDate, endDate) {
	return request({
		method: 'POST',
		url: `/api/details/accuracy`,
		data: {
			userId,
			startDate,
			endDate
		}
	})
}