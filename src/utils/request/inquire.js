import { request } from '../request.js';

export function headTeacherScoreAPI(classDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-classId',
    data: {
      classDingId,
      startDate,
      endDate,
    },
  });
}

export function headTeacherCorrectScoreAPI(classDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-classId',
    data: {
      classDingId,
      startDate,
      endDate,
    },
  });
}

export function teacherScoreAPI(teacherDingId, courseDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-teacherId-courseId',
    data: {
      teacherDingId,
      courseDingId,
      startDate,
      endDate,
    },
  });
}

export function teacherCorrectScoreAPI(teacherDingId, courseDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-teacherId-courseId',
    data: {
      teacherDingId,
      courseDingId,
      startDate,
      endDate,
    },
  });
}

export function headMasterScoreAPI(gradeDingId, courseDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-gradeId-courseId',
    data: {
      gradeDingId,
      courseDingId,
      startDate,
      endDate,
    },
  });
}

export function headMasterCorrectScoreAPI(gradeDingId, courseDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-gradeId-courseId',
    data: {
      gradeDingId,
      courseDingId,
      startDate,
      endDate,
    },
  });
}
