import { request } from '../request.js';
import { useMemberStore } from
// #ifndef H5
  '../../stores/modules/member.js';
// #endif

// #ifdef H5
'../../stores/modules/memberH5.js';
// #endif

const memberStore = useMemberStore();

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

export function schoolDeptListAPI(super_id = undefined) {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/dept/list?access_token=${memberStore.token.accessToken}`,
    data: {
      page_size: 30,
      page_no: 1,
      super_id,
    },
  });
}

export function schoolDeptDetailAPI(deptId) {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/dept/get?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}
