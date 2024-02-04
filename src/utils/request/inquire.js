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
export function teacherScoreAPI(courseId, teacherId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-class-course',
    data: {
      courseId,
      teacherId,
      startDate,
      endDate,
    },
  });
}

// teacherCorrect
export function teacherCorrectScoreAPI(courseId, teacherId, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-class-course',
    data: {
      courseId,
      teacherId,
      startDate,
      endDate,
    },
  });
}

// headMaster
export function headMasterScoreAPI(courseId, grade, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/count-by-grade-course',
    data: {
      courseId,
      grade,
      startDate,
      endDate,
    },
  });
}

// headMasterCorrect
export function headMasterCorrectScoreAPI(courseId, grade, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/ling/api/v1/rollCall/correct-count-by-grade-course',
    data: {
      courseId,
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
