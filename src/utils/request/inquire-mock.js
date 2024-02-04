// import { request } from '../request.js';
import { request } from '../request-mock.js';

// 语文组 / 数学组...

// 获取：年级-班级
export function classAPI() {
  return request({
    method: 'GET',
    url: '/api/inquire/class',
  });
}

// 获取科目列表
export function subjectAPI() {
  return request(({
    method: 'GET',
    url: '/api/inquire/subject',
  }));
}

// 班主任-数据
export function teacherBossAPI(cla, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/api/inquire/teacherBoss',
    data: {
      cla,
      startDate,
      endDate,
    },
  });
}

// 任课老师-数据
export function teacherOrdinaryAPI(classIdList, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/api/inquire/teacherOrdinary',
    data: {
      classIdList,
      startDate,
      endDate,
    },
  });
}

// 班级总数据详情 - 每个人的成绩
export function classDetailAPI(classId, subject, startDate, endDate) {
  return request({
    method: 'POST',
    url: '/api/inquire/classDetail',
    data: {
      classId,
      subject,
      startDate,
      endDate,
    },
  });
}
