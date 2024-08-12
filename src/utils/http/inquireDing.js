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
    // Get a list of departments

    let res = await deptListAPI();
    // res.data.result: [..., { name: '全体教师', dept_id: 100100, ... }, ...]
    let next = res.data.result.filter(item => item.name === '全体教师')[0].dept_id;

    res = await deptListAPI(next);
    // res.data.result: [{ name: '各学科教师', dept_id: 100102, ... }]
    next = res.data.result.filter(item => item.name === '各学科教师')[0].dept_id;

    res = await deptListAPI(next);
    // res.data.result: [{ name: '语文', dept_id: 100103, ... }, { name:'数学', dept_id: 100104, ... }, ...]

    // List of all courses
    // courseList: [{ name: '语文', deptid: 100103 }, { name: '数学', deptid: 100104 }, ...]
    const courseList = res.data.result.map(item => {
      return {
        name: item.name,
        deptid: item.dept_id,
      };
    });

    memberStore.userInfo.allCourse = courseList;

    memberStore.userInfo.teacherSubjectList = [];

    // Get the course id based on the course name
    // When the department name contains the course name, the teacher teaches this course
    courseList.forEach(item => {
      // memberStore.userInfo.deptNameList: ['物理']
      if (memberStore.userInfo.deptNameList.includes(item.name)) {
        // memberStore.userInfo.teacherSubjectList: [{ "name":"物理", "deptid":933446584 }]
        memberStore.userInfo.teacherSubjectList.push(item);
      }
    });

    resolve();
  });
};

// Get the name of the class the teacher teaches
export const getClassName = async () => {
  if (memberStore.Limiting) return;

  // before: memberStore.userInfo.teacherInfoList: [{ classId: 933745979, isTeacher: true }]
  // after: memberStore.userInfo.teacherInfoList: [{ classId: 933745979, className: '2021级4班', isTeacher: true }]
  const list = memberStore.userInfo.teacherInfoList.map(item => {
    return schoolDeptDetailAPI(item.classId).then(res => {
      // res.data.result.detail: [{ nick:'', name: '2021级4班', dept_type: 'class', dept_id: 933745979, ...}]
      item.className = res.data.result.detail.nick ? res.data.result.detail.nick : res.data.result.detail.name;
      // item.classDetail = res.data.result.detail;
    });
  });

  await Promise.all(list);

  // Sort by grade id from smallest to largest
  memberStore.userInfo.teacherInfoList.sort((a, b) => a.classId - b.classId);
};

const schoolList = async (deptId, newArr) => {
  const res = await schoolDeptListAPI(deptId);
  // res.data.result.details: [{ name: '联通测试 校区一', dept_type: 'campus', dept_id: 928327802 }]
  // res.data.result.details: [{ name: '小学', dept_type: 'period', dept_id: 928474473 }, { name: '初中', dept_type: 'period', dept_id: 928474474 }, ...]
  // res.data.result.details: [{ name: '一年级2024级', dept_type: 'grade', dept_id: 957226854 }, ...]

  for (const k of res.data.result.details) {
    const content = {
      text: k.name,
      deptType: k.dept_type,
      value: k.dept_id,
    };

    newArr.push(content);
  }

  // When the grade information is obtained, the recursion is terminated
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

// Get a list of all grades
export const gradeAll = async () => {
  if (memberStore.Limiting) return;

  memberStore.userInfo.schoolTreeList = await schoolList(undefined, []);

  /*
  memberStore.userInfo.schoolTreeList: [
    {
      text: '幼儿园',
      deptType: 'period',
      value: 928474472,
      children: [
        { text: '中班', deptType: 'grade', value: 928333846 },
        { text: '大班', deptType: 'grade', value: 928333847 },
        ...
      ],
    },
    {
      text: '小学',
      deptType: 'period',
      value: 928474473,
      children: [
        { text: '一年级2024级', deptType: 'grade', value: 957226854 },
        { text: '二年级2023级', deptType: 'grade', value: 928525483 },
        ...
      ],
    },
    {
      text: '初中',
      deptType: 'period',
      value: 928474474,
      children: [
        { text: '七年级2024级', deptType: 'grade', value: 957482030 },
        { text: '八年级2023级', deptType: 'grade', value: 928495541 },
        ...
      ],
    },
    {
      text: '高中',
      deptType: 'period',
      value: 928474475,
      children: [
        { text: '一年级2024级', deptType: 'grade', value: 957242731 },
        { text: '二年级2023级', deptType: 'grade', value: 928393746 },
        ...
      ],
    },
  ];
  */
};
