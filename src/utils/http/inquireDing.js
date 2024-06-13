import {
  schoolDeptDetailAPI,
  deptListAPI,
  schoolDeptListAPI,
} from '../request/config.js';

import { useMemberStore } from '../../stores/modules/member.js';

const memberStore = useMemberStore();

// Get a list of all courses、Get the courses taught by teachers
export const getCourse = async () => {
  if (memberStore.Limiting) return;

  return new Promise(async resolve => {
    let res = await deptListAPI();
    let next = res.data.result.filter(item => item.name === '全体教师')[0].dept_id;
    res = await deptListAPI(next);
    next = res.data.result.filter(item => item.name === '各学科教师')[0].dept_id;
    res = await deptListAPI(next);

    // List of all courses
    const courseList = res.data.result.map(item => {
      return {
        name: item.name,
        deptid: item.dept_id,
      };
    });

    memberStore.userInfo.allCourse = courseList;

    memberStore.userInfo.teacherSubjectList = [];

    // When the department name contains the course name, the teacher teaches this course
    courseList.forEach(item => {
      if (memberStore.userInfo.deptNameList.includes(item.name)) {
        memberStore.userInfo.teacherSubjectList.push(item);
      }
    });

    resolve();
  });
};

// Get the name of the class the teacher teaches
export const getClassName = async () => {
  if (memberStore.Limiting) return;

  const list = memberStore.userInfo.teacherInfoList.map(item => {
    return schoolDeptDetailAPI(item.classId).then(res => {
      item.className = res.data.result.detail.nick ? res.data.result.detail.nick : res.data.result.detail.name;
      // item.classDetail = res.data.result.detail;
    });
  });

  await Promise.all(list);

  memberStore.userInfo.teacherInfoList.sort((a, b) => a.classId - b.classId);
};

const schoolList = async (deptId, newArr) => {
  const res = await schoolDeptListAPI(deptId);

  for (const k of res.data.result.details) {
    const content = {
      text: k.name,
      deptType: k.dept_type,
      value: k.dept_id,
    };

    newArr.push(content);
  }

  for (const item of newArr) {
    if (item.deptType !== 'grade') {
      item.children = [];
      await schoolList(item.value, item.children);
    } else {
      return;
    }
  }

  return newArr;
};

export const gradeAll = async () => {
  if (memberStore.Limiting) return;

  memberStore.userInfo.schoolTreeList = await schoolList(undefined, []);
};
