import { request } from '../request.js';

// 本次统计 - 饼状图
export function statisticsAPI(userId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-course-stuId',
    data: {
      studentId: 3,
      startDate,
      endDate,
    },
  });
}

// 正确率 - 折线图
export function accuracyAPI(userId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-course-stuId',
    data: {
      studentId: 3,
      startDate,
      endDate,
    },
  });
}
