import {
  teacherScoreAPI,
  teacherCorrectScoreAPI,
  headTeacherScoreAPI,
  headTeacherCorrectScoreAPI,
  schoolDeptListAPI,
  headMasterScoreAPI,
  headMasterCorrectScoreAPI,
} from '../request/inquire.js';

export const headTeacherScore = async (classDingId, startDate, endDate, tableData) => {
  const res = await headTeacherScoreAPI(classDingId, startDate, endDate);

  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });

  tableData.value = res.data;
};

export const headTeacherCorrectScore = async (classDingId, startDate, endDate, tableData, headTeacherData) => {
  const res = await headTeacherCorrectScoreAPI(classDingId, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.courseId === item.courseId)[0]?._count / item._count || 0;
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
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

export const teacherScore = async (teacherDingId, courseDingId, startDate, endDate, tableData) => {
  const res = await teacherScoreAPI(teacherDingId, courseDingId, startDate, endDate);
  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });

  tableData.value = res.data;
};

export const teacherCorrectScore = async (teacherDingId, courseDingId, startDate, endDate, tableData, teacherData) => {
  const res = await teacherCorrectScoreAPI(teacherDingId, courseDingId, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count / item._count || 0;
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count || 0;
  });

  let course = [];
  let count = [];
  let correctCount = [];

  tableData.value.forEach(item => {
    course.push(item.className);
  });
  course = Array.from(new Set(course));

  count = course.map(countItem => {
    return tableData.value.filter(item => countItem === item.className).reduce((total, cur) => total + cur._count, 0);
  });

  correctCount = course.map(countItem => {
    return tableData.value.filter(item => countItem === item.className).reduce((total, cur) => total + cur.correctCount, 0);
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

export const headMasterScore = async (gradeDingId, courseDingId, startDate, endDate, tableData) => {
  const res = await headMasterScoreAPI(gradeDingId, courseDingId, startDate, endDate);
  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });

  tableData.value = res.data;
};

export const headMasterCorrectScore = async (gradeDingId, courseDingId, startDate, endDate, tableData, teacherData) => {
  const res = await headMasterCorrectScoreAPI(gradeDingId, courseDingId, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count / item._count || 0;
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count || 0;
  });

  let course = [];
  let count = [];
  let correctCount = [];

  tableData.value.forEach(item => {
    course.push(item.className);
  });
  course = Array.from(new Set(course));

  count = course.map(countItem => {
    return tableData.value.filter(item => countItem === item.className).reduce((total, cur) => total + cur._count, 0);
  });

  correctCount = course.map(countItem => {
    return tableData.value.filter(item => countItem === item.className).reduce((total, cur) => total + cur.correctCount, 0);
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

const gradeId = (gradeAllData, period = '') => {
  for (const k of gradeAllData) {
    if (k.deptType === 'period') {
      period = k.text;
    }

    if (k.deptType === 'grade') {
      return {
        text: period + k.text,
        deptId: k.value,
      };
    }

    if (k.children?.length) {
      return gradeId(k.children, period);
    }
  }
};

export const gradeAll = async (gradeAllData, gradeAllDefaultId, classText) => {
  const res = await schoolList(undefined, []);
  gradeAllData.value = res;

  const resGrade = gradeId(res);
  gradeAllDefaultId.value = resGrade.deptId;
  classText.value = resGrade.text;
};

export const getGradeAllDeptType = (gradeAllData, deptId) => {
  for (const item of gradeAllData) {
    if (item.value === deptId) {
      return item.deptType;
    }

    if (item.children) {
      const ret = getGradeAllDeptType(item.children, deptId);
      if (ret !== undefined) return ret;
    }
  }
};
