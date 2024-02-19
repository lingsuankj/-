/* eslint-disable no-undef */
import { teacherScoreAPI,
  teacherCorrectScoreAPI,
  headTeacherScoreAPI,
  headTeacherCorrectScoreAPI,
  schoolDeptListAPI,
  headMasterScoreAPI,
  headMasterCorrectScoreAPI,
  schoolDeptDetailAPI } from '../request/inquire.js';

// #ifndef H5
import { useMemberStore } from '../../stores/modules/member.js';
// #endif

// #ifdef H5
import { useMemberStore } from '../../stores/modules/memberH5.js';
// #endif

const memberStore = useMemberStore();

/**
 * 班主任获取数据
 * @param {Number} gradeNum gradeNum
 * @param {Number} classNum classNum
 * @param {Number} startDate startDate
 * @param {Number} endDate endDate
 * @param {*} tableData tableData
 * @example
 * headTeacherScore('小学一年级2024级', '1班', '2024-01-18T00:00:00Z', '2024-01-30T23:59:59Z', tableData);
 */
export const headTeacherScore = async (gradeNum, classNum, startDate, endDate, tableData) => {
  const res = await headTeacherScoreAPI(gradeNum, classNum, startDate, endDate);

  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });

  tableData.value = res.data;
};

// 班主任 - 正确 grade: '一年级'  class: '一班'
export const headTeacherCorrectScore = async (gradeNum, classNum, startDate, endDate, tableData, headTeacherData) => {
  const res = await headTeacherCorrectScoreAPI(gradeNum, classNum, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.courseId === item.courseId)[0]?._count / item._count || 0;
    item.accuracy = (item.accuracy * 100 | 0) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.courseId === item.courseId)[0]?._count || 0;
  });

  let course = [];
  let count = [];
  let correctCount = [];
  tableData.value.forEach(item => {
    course.push(item.courseName);
  });

  course = Array.from(new Set(course));

  count = course.map(countItem => {
    return tableData.value.filter(item => item.courseName === countItem).reduce((total, cur) => total + cur._count, 0);
  });

  correctCount = course.map(countItem => {
    return tableData.value.filter(item => item.courseName === countItem).reduce((total, cur) => total + cur.correctCount, 0);
  });

  if (!count.length) {
    uni.showToast({
      icon: 'none',
      title: '暂无数据',
    });
  }

  headTeacherData.value = {
    categories: course,
    series: [{
      name: '提问数量',
      data: count,
    }, {
      name: '正确数量',
      data: correctCount,
    }],
  };
};

/**
 * 任课老师获取数据
 * @param {Number} courseId courseId
 * @param {Number} teacherId teacherId
 * @param {String} startDate startDate
 * @param {String} endDate endDate
 * @param {*} tableData tableData
 * @example
 * teacherScore(1, 1, '2024-01-18T00:00:00Z', '2024-01-30T23:59:59Z', tableData);
 */
export const teacherScore = async (courseId, teacherId, startDate, endDate, tableData) => {
  const res = await teacherScoreAPI(courseId, teacherId, startDate, endDate);

  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });
  tableData.value = res.data;
};

// 任课老师 - 正确
export const teacherCorrectScore = async (courseId, teacherId, startDate, endDate, tableData, teacherData) => {
  const res = await teacherCorrectScoreAPI(courseId, teacherId, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.grade === item.grade && e.class === item.class)[0]?._count / item._count || 0;
    item.accuracy = (item.accuracy * 100 | 0) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.grade === item.grade && e.class === item.class)[0]?._count || 0;
  });

  let course = [];
  let count = [];
  let correctCount = [];
  tableData.value.forEach(item => {
    course.push(item.grade + item.class);
  });
  course = Array.from(new Set(course));

  count = course.map(countItem => {
    return tableData.value.filter(item => countItem.includes(item.grade) && countItem.includes(item.class)).reduce((total, cur) => total + cur._count, 0);
  });

  correctCount = course.map(countItem => {
    return tableData.value.filter(item => countItem.includes(item.grade) && countItem.includes(item.class)).reduce((total, cur) => total + cur.correctCount, 0);
  });

  if (!count.length) {
    uni.showToast({
      icon: 'none',
      title: '暂无数据',
    });
  }

  teacherData.value = {
    categories: course,
    series: [{
      name: '提问数量',
      data: count,
    }, {
      name: '正确数量',
      data: correctCount,
    }],
  };
};

/**
 * 校长数据
 * @param {Number} courseId courseId
 * @param {String} grade grade
 * @param {String} startDate startDate
 * @param {String} endDate endDate
 * @param {*} tableData tableData
 * @example
 * headMasterScore(1, '小学一年级2024级', '2024-01-18T00:00:00Z', '2024-01-30T23:59:59Z', tableData)
 */
export const headMasterScore = async (courseId, grade, startDate, endDate, tableData) => {
  const res = await headMasterScoreAPI(courseId, grade, startDate, endDate);

  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });

  tableData.value = res.data;
};

// 校长 - 正确
export const headMasterCorrectScore = async (courseId, grade, startDate, endDate, tableData, teacherData) => {
  const res = await headMasterCorrectScoreAPI(courseId, grade, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.grade === item.grade && e.class === item.class)[0]?._count / item._count || 0;
    item.accuracy = (item.accuracy * 100 | 0) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.grade === item.grade && e.class === item.class)[0]?._count || 0;
  });

  let course = [];
  let count = [];
  let correctCount = [];
  tableData.value.forEach(item => {
    course.push(item.class);
  });
  course = Array.from(new Set(course));

  count = course.map(countItem => {
    return tableData.value.filter(item => countItem.includes(item.class)).reduce((total, cur) => total + cur._count, 0);
  });

  correctCount = course.map(countItem => {
    return tableData.value.filter(item => countItem.includes(item.class)).reduce((total, cur) => total + cur.correctCount, 0);
  });

  if (!count.length) {
    uni.showToast({
      icon: 'none',
      title: '暂无数据',
    });
  }

  teacherData.value = {
    categories: course,
    series: [{
      name: '提问数量',
      data: count,
    }, {
      name: '正确数量',
      data: correctCount,
    }],
  };
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

const gradeId = (classAllData, period = '') => {
  for (const k of classAllData) {
    if (k.deptType === 'period') {
      period = k.text;
    }
    if (k.deptType === 'grade') {
      return {
        text: period + k.text,
        deptId: k.value
      }
    }
    if (k.children?.length) {
      return gradeId(k.children, period);
    }
  }
};

// 校长/年级主任 - 选择年级
export const classAll = async (classAllData, classAllId, headMasterGrade) => {
  const res = await schoolList(undefined, []);
  classAllData.value = res;

  const resGrade = gradeId(res); // {text: '幼儿园中班', deptId: 856155465}
  classAllId.value = resGrade.deptId;
  headMasterGrade.value = resGrade.text;
};

export const teacherClassDetail = async (headTeacherGrade) => {
  for (const item of memberStore.userInfo.teacherInfoList) {
    const resPeriod = await schoolDeptDetailAPI(JSON.parse(item.classDetail.chain)[1]);
    const period = resPeriod.data.result.detail.name;
  
    const resGrade = await schoolDeptDetailAPI(JSON.parse(item.classDetail.chain)[2]);
    const grade = resGrade.data.result.detail.name;
  
    item.gradeName = period + grade;
  }

  headTeacherGrade.value = memberStore.userInfo.teacherInfoList[0]?.gradeName;
};
