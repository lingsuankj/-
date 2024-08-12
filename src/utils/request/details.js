import { request } from '../request.js';

// Get the data for the donut chart
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

// Get the data of the bar chart
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

// Get the current enterprise qps number
export function qpsMaxAPI() {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/limiterMix-by-appKey',
    data: {},
  });
}
