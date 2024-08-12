import { request } from '../request.js';

// The head teacher total roll call data
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

// Data on the number of correct roll calls taken by the head teacher
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

// The teacher total roll call data
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

// Data on the number of correct roll calls by teachers
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

// The head master total roll call data
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

// Data on the number of correct roll calls by head master
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
