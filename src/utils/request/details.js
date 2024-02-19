import { request } from '../request.js';

// 本次统计 - 饼状图
export function statisticsAPI(studentDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-course-stuId',
    data: {
      studentDingId, // 1
      startDate,
      endDate,
    },
  });
}

// 正确率 - 折线图
export function accuracyAPI(studentDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-course-stuId',
    data: {
      studentDingId,
      startDate,
      endDate,
    },
  });
}
