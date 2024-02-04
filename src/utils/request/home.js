import { request } from '../request.js';

export function popularClassAPI(startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-class',
    data: {
      startDate,
      endDate,
    },
  });
}

export function popularStudentAPI(startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-student',
    data: {
      startDate,
      endDate,
    },
  });
}
