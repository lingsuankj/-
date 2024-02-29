import { request } from '../request.js';

export function statisticsAPI(studentDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-stuentId',
    data: {
      studentDingId,
      startDate,
      endDate,
    },
  });
}

export function accuracyAPI(studentDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-stuentId',
    data: {
      studentDingId,
      startDate,
      endDate,
    },
  });
}
