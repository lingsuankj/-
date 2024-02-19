import { request } from '../request.js';
import { useMemberStore } from '../../stores/modules/member.js';

const memberStore = useMemberStore();

// headTeacher
export function headTeacherScoreAPI(gradeNum, classNum, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-course-class',
    data: {
      grade: gradeNum,
      class: classNum,
      startDate,
      endDate,
    },
  });
}

// headTeacherCorrect
export function headTeacherCorrectScoreAPI(gradeNum, classNum, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-course-class',
    data: {
      grade: gradeNum,
      class: classNum,
      startDate,
      endDate,
    },
  });
}

// teacher
export function teacherScoreAPI(courseDingId, teacherDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-class-course',
    data: {
      courseDingId,
      teacherDingId,
      startDate,
      endDate,
    },
  });
}

// teacherCorrect
export function teacherCorrectScoreAPI(courseDingId, teacherDingId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-class-course',
    data: {
      courseDingId,
      teacherDingId,
      startDate,
      endDate,
    },
  });
}

// headMaster
export function headMasterScoreAPI(courseDingId, grade, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-grade-course',
    data: {
      courseDingId,
      grade,
      startDate,
      endDate,
    },
  });
}

// headMasterCorrect
export function headMasterCorrectScoreAPI(courseDingId, grade, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-grade-course',
    data: {
      courseDingId,
      grade,
      startDate,
      endDate,
    },
  });
}

// 家校通讯录 - 获取部门列表
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

// 家校通讯录 - 获取部门详情
export function schoolDeptDetailAPI(deptId) {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/dept/get?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}
