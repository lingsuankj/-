import {
  deptDetailAPI,
  schoolDeptDetailAPI,
  deptListAPI,
} from '../request/config.js';

import { useMemberStore } from
// #ifndef H5
  '../../stores/modules/member.js';
// #endif

// #ifdef H5
'../../stores/modules/memberH5.js';
// #endif

const memberStore = useMemberStore();

export const getDeptName = async () => {
  memberStore.userInfo.isStudent = false;
  memberStore.userInfo.isGuardian = false;
  memberStore.userInfo.isTeacher = false;
  memberStore.userInfo.isHeadTeacher = false;
  memberStore.userInfo.isHeadMaster = false;
  memberStore.userInfo.deptIdGuardianList = [];
  memberStore.userInfo.deptIdTeacherList = [];
  const deptNameList = [];

  const promiseAll = memberStore.userInfo.deptIdList.map(item => {
    return deptDetailAPI(item).then(res => {
      deptNameList.push(res.data.result.name);

      if (res.data.result.name === '家长') {
        memberStore.userInfo.isGuardian = true;
        memberStore.userInfo.deptIdGuardianList.push(item);
      }

      if (res.data.result.name === '学生') {
        memberStore.userInfo.isStudent = true;
        memberStore.userInfo.studentInfoList.push({
          name: memberStore.userInfo.name,
          userId: memberStore.userInfo.userid,
          calssStudentId: item,
        });
      }

      if (res.data.result.name === '老师') {
        memberStore.userInfo.isTeacher = true;
        memberStore.userInfo.deptIdTeacherList.push(item);
      }

      if (res.data.result.name.includes('班主任')) {
        memberStore.userInfo.isHeadTeacher = true;
      }

      if (res.data.result.name.includes('校长')) {
        memberStore.userInfo.isHeadMaster = true;
      }
    });
  });

  await Promise.all(promiseAll);
  memberStore.userInfo.deptNameList = deptNameList;
};

export const getTeacherCourse = async () => {
  return new Promise(async resolve => {
    let res = await deptListAPI();
    let next = res.data.result.filter(item => item.name === '全体教师')[0].dept_id;
    res = await deptListAPI(next);
    next = res.data.result.filter(item => item.name === '各学科教师')[0].dept_id;
    res = await deptListAPI(next);
    const subjectList = res.data.result.map(item => {
      return {
        name: item.name,
        deptid: item.dept_id,
      };
    });

    memberStore.userInfo.allCourse = subjectList;

    memberStore.userInfo.teacherSubjectList = [];

    subjectList.forEach(item => {
      if (memberStore.userInfo.deptNameList.includes(item.name)) {
        memberStore.userInfo.teacherSubjectList.push(item);
      }
    });

    resolve();
  });
};

export const getDeptParentId = async () => {
  memberStore.userInfo.deptIdGuardianParentList = [];
  const promiseAllGuardian = memberStore.userInfo.deptIdGuardianList.map(item => {
    return deptDetailAPI(item).then(res => {
      memberStore.userInfo.deptIdGuardianParentList.push(res.data.result.parent_id);
    });
  });

  memberStore.userInfo.teacherInfoList = [];
  const promiseAllTeacher = memberStore.userInfo.deptIdTeacherList.map(item => {
    return deptDetailAPI(item).then(res => {
      memberStore.userInfo.teacherInfoList.push({
        classId: res.data.result.parent_id,
      });
    });
  });

  await Promise.all(promiseAllGuardian.concat(promiseAllTeacher));
};

export const getSchoolDeptDetail = async () => {
  const list = memberStore.userInfo.teacherInfoList.map(item => {
    return schoolDeptDetailAPI(item.classId).then(res => {
      item.className = res.data.result.detail.name;
      item.classDetail = res.data.result.detail;
    });
  });
  await Promise.all(list);

  memberStore.userInfo.teacherInfoList.sort((a, b) => a.classId - b.classId);
};
