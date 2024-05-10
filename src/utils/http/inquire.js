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

export const headTeacherCorrectScore = async (classDingId, startDate, endDate, tableData, headTeacherData, optsAll) => {
  const res = await headTeacherCorrectScoreAPI(classDingId, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.courseId === item.courseId)[0]?._count / item._count || 0;
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.courseId === item.courseId)[0]?._count || 0;
    item.incorrectCount = item._count - item.correctCount - item.absentCount;
  });

  let course = [];
  let count = [];
  let correctCount = [];
  let correctRate = [];

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

  correctRate = count.map((countItem, index) => {
    return Math.round((correctCount[index] / countItem) * 100);
  });

  if (!count.length) {
    uni.showToast({
      icon: 'none',
      title: '暂无数据',
    });
  }

  if (course.length > 1) {
    course.push('综合');

    const countSum = count.reduce((acc, cur) => acc + cur, 0);
    count.push(countSum);

    const correctCountSum = correctCount.reduce((acc, cur) => acc + cur, 0);
    correctCount.push(correctCountSum);

    if (correctRate.length === 0) {
      correctRate.push(0);
    } else {
      const correctRateSum = Math.round(correctRate.reduce((acc, cur) => acc + cur, 0) / correctRate.length);
      correctRate.push(correctRateSum);
    }
  }

  if (count.length > 0) {
    optsAll.yAxis.data[0].max = Math.round(Math.max(...count) * 2);
  }

  headTeacherData.value = {
    categories: course.length !== 0 ? course : [ '' ],
    series: [{
      name: '提问数量',
      data: count,
      type: 'column',
      color: '#FAC858',
      textSize: 10,
    }, {
      name: '正确数量',
      data: correctCount,
      type: 'column',
      color: '#91CB74',
      textSize: 10,
    }, {
      name: '正确率',
      type: 'line',
      color: '#FAC858',
      index: 1,
      data: correctRate,
      format: 'mixLine',
      addPoint: true,
      textSize: 10,
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

export const teacherCorrectScore = async (teacherDingId, courseDingId, startDate, endDate, tableData, teacherData, optsAll) => {
  const res = await teacherCorrectScoreAPI(teacherDingId, courseDingId, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count / item._count || 0;
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count || 0;
    item.incorrectCount = item._count - item.correctCount - item.absentCount;
  });

  let course = [];
  let count = [];
  let correctCount = [];
  let correctRate = [];

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

  correctRate = count.map((countItem, index) => {
    return Math.round((correctCount[index] / countItem) * 100);
  });

  if (!count.length) {
    uni.showToast({
      icon: 'none',
      title: '暂无数据',
    });
  }

  if (course.length > 1) {
    course.push('综合');

    const countSum = count.reduce((acc, cur) => acc + cur, 0);
    count.push(countSum);

    const correctCountSum = correctCount.reduce((acc, cur) => acc + cur, 0);
    correctCount.push(correctCountSum);

    if (correctRate.length === 0) {
      correctRate.push(0);
    } else {
      const correctRateSum = Math.round(correctRate.reduce((acc, cur) => acc + cur, 0) / correctRate.length);
      correctRate.push(correctRateSum);
    }
  }

  if (count.length > 0) {
    optsAll.yAxis.data[0].max = Math.round(Math.max(...count) * 2);
  }

  teacherData.value = {
    categories: course.length !== 0 ? course : [ '' ],
    series: [{
      name: '提问数量',
      data: count,
      type: 'column',
      color: '#FAC858',
      textSize: 10,
    }, {
      name: '正确数量',
      data: correctCount,
      type: 'column',
      color: '#91CB74',
      textSize: 10,
    }, {
      name: '正确率',
      type: 'line',
      color: '#FAC858',
      index: 1,
      data: correctRate,
      format: 'mixLine',
      addPoint: true,
      textSize: 10,
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

export const headMasterCorrectScore = async (gradeDingId, courseDingId, startDate, endDate, tableData, teacherData, optsAll) => {
  const res = await headMasterCorrectScoreAPI(gradeDingId, courseDingId, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count / item._count || 0;
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count || 0;
    item.incorrectCount = item._count - item.correctCount - item.absentCount;
  });

  let course = [];
  let count = [];
  let correctCount = [];
  let correctRate = [];

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

  correctRate = count.map((countItem, index) => {
    return Math.round((correctCount[index] / countItem) * 100);
  });

  if (!count.length) {
    uni.showToast({
      icon: 'none',
      title: '暂无数据',
    });
  }

  if (course.length > 1) {
    course.push('综合');

    const countSum = count.reduce((acc, cur) => acc + cur, 0);
    count.push(countSum);

    const correctCountSum = correctCount.reduce((acc, cur) => acc + cur, 0);
    correctCount.push(correctCountSum);

    if (correctRate.length === 0) {
      correctRate.push(0);
    } else {
      const correctRateSum = Math.round(correctRate.reduce((acc, cur) => acc + cur, 0) / correctRate.length);
      correctRate.push(correctRateSum);
    }
  }

  if (count.length > 0) {
    optsAll.yAxis.data[0].max = Math.round(Math.max(...count) * 2);
  }

  teacherData.value = {
    categories: course.length !== 0 ? course : [ '' ],
    series: [{
      name: '提问数量',
      data: count,
      type: 'column',
      color: '#FAC858',
      textSize: 10,
    }, {
      name: '正确数量',
      data: correctCount,
      type: 'column',
      color: '#91CB74',
      textSize: 10,
    }, {
      name: '正确率',
      type: 'line',
      color: '#FAC858',
      index: 1,
      data: correctRate,
      format: 'mixLine',
      addPoint: true,
      textSize: 10,
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
