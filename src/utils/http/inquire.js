import {
  teacherScoreAPI,
  teacherCorrectScoreAPI,
  headTeacherScoreAPI,
  headTeacherCorrectScoreAPI,
  headMasterScoreAPI,
  headMasterCorrectScoreAPI,
} from '../request/inquire.js';

const getFontSize = num => {
  if (num < 1000) {
    return 10;
  }

  return 8;
};

// Get the head master total roll call data
export const headMasterScore = async (gradeDingId, courseDingId, startDate, endDate, tableData) => {
  const res = await headMasterScoreAPI(gradeDingId, courseDingId, startDate, endDate);
  /*
  res.data: [
    {
      absentCount: 5,
      accuracy: '37%',
      classId: 7,
      className: '一年级1班',
      correctCount: 6,
      incorrectCount: 5,
      studentId: 133,
      studentName: '杨东升',
      _avg: { score: '0.6875' },
      // Total number of roll calls
      _count: 16,
    },
    ...
  ]
  */

  // Keep one decimal place
  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });

  tableData.value = res.data;
};

// Get the head master correct roll call data
export const headMasterCorrectScore = async (gradeDingId, courseDingId, startDate, endDate, tableData, teacherData, optsAll) => {
  const res = await headMasterCorrectScoreAPI(gradeDingId, courseDingId, startDate, endDate);
  /*
  [
    {
      classId: 7,
      className: '一年级1班',
      studentId: 133,
      studentName: '杨东升',
      // Number of correct roll calls
      _count: 6,
    },
    ...
  ]
  */

  // tableData: is the return value of the headMasterScore function
  tableData.value.forEach(item => {
    // Total roll call / correct roll call to get the accuracy rate
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count / item._count || 0;
    // Formatting accuracy: 0.5666 => '56%'
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count || 0;
    // Incorrect quantity = Total quantity - Correct quantity - Absent quantity
    item.incorrectCount = item._count - item.correctCount - item.absentCount;
  });

  // x-axis data, here is the class name list
  let xAxisData = [];
  // y-axis, total roll call count list
  let count = [];
  // y-axis, list of correct roll calls
  let correctCount = [];
  // y-axis, list of correctness of names and numbers
  let correctRate = [];

  // get class name list
  tableData.value.forEach(item => {
    xAxisData.push(item.className);
  });

  // Remove duplicate data
  xAxisData = Array.from(new Set(xAxisData));

  // get total roll call count list
  count = xAxisData.map(countItem => {
    return tableData.value.filter(item => countItem === item.className).reduce((total, cur) => total + cur._count, 0);
  });

  // get list of correct roll calls
  correctCount = xAxisData.map(countItem => {
    return tableData.value.filter(item => countItem === item.className).reduce((total, cur) => total + cur.correctCount, 0);
  });

  // Get the correctness of the name and number
  correctRate = count.map((countItem, index) => {
    return Math.round((correctCount[index] / countItem) * 100);
  });

  if (!count.length) {
    uni.showToast({
      icon: 'none',
      title: '暂无数据',
    });
  }

  // Perform statistics on the data
  if (xAxisData.length > 1) {
    xAxisData.push('综合');

    // The total number of correct roll calls
    const countSum = count.reduce((acc, cur) => acc + cur, 0);
    count.push(countSum);

    // The sum of the correct roll calls
    const correctCountSum = correctCount.reduce((acc, cur) => acc + cur, 0);
    correctCount.push(correctCountSum);

    if (correctRate.length === 0) {
      correctRate.push(0);
    } else {
      // Average accuracy of all
      const correctRateSum = Math.round(correctRate.reduce((acc, cur) => acc + cur, 0) / correctRate.length);
      correctRate.push(correctRateSum);
    }
  }

  // Set the height of the y-axis to: 2 times the maximum value of the named quantity
  if (count.length > 0) {
    optsAll.yAxis.data[0].max = Math.round(Math.max(...count) * 2);
  }

  // Set the font size according to the number of roll calls to avoid overlapping numbers
  const coutSize = getFontSize(Math.max(...count, ...correctCount));

  // Update chart data
  teacherData.value = {
    categories: xAxisData.length !== 0 ? xAxisData : [ '' ],
    series: [{
      name: '提问数量',
      data: count,
      type: 'column',
      color: '#FAC858',
      textSize: coutSize,
    }, {
      name: '正确数量',
      data: correctCount,
      type: 'column',
      color: '#91CB74',
      textSize: coutSize,
    }, {
      name: '正确率',
      type: 'line',
      color: '#FAC858',
      index: 1,
      data: correctRate,
      format: 'mixLine',
      addPoint: true,
      textSize: coutSize,
    }],
  };
};

// 

// Get the head teacher total roll call data
export const headTeacherScore = async (classDingId, startDate, endDate, tableData) => {
  const res = await headTeacherScoreAPI(classDingId, startDate, endDate);
  /*
  res.data: [
    {
      absentCount: 0,
      accuracy: '75%',
      correctCount: 12,
      courseId: 1,
      courseName: '语文',
      incorrectCount: 4,
      studentId: 22,
      studentName: '程思远',
      _avg: { score: 1 },
      _count: 16,
    },
    ...
  ]
  */

  // Keep one decimal place
  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });

  tableData.value = res.data;
};

// Get the head teacher correct roll call data
export const headTeacherCorrectScore = async (classDingId, startDate, endDate, tableData, teacherData, optsAll) => {
  const res = await headTeacherCorrectScoreAPI(classDingId, startDate, endDate);
  
  /*
  res.data: [
    {
      courseId: 1,
      courseName: '语文',
      studentId: 22,
      studentName: '程思远',
      _count: 5,
    },
    ...
  ]
  */

  // tableData: is the return value of the headTeacherScore function
  tableData.value.forEach(item => {
    // Total roll call / correct roll call to get the accuracy rate
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.courseId === item.courseId)[0]?._count / item._count || 0;
    // Formatting accuracy: 0.5666 => '56%'
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.courseId === item.courseId)[0]?._count || 0;
    // // Incorrect quantity = Total quantity - Correct quantity - Absent quantity
    item.incorrectCount = item._count - item.correctCount - item.absentCount;
  });

  // The x-axis data is the course list.
  let xAxisData = [];
  // y-axis, total roll call count list
  let count = [];
  // y-axis, list of correct roll calls
  let correctCount = [];
  // y-axis, list of correctness of names and numbers
  let correctRate = [];

  // get course name list
  tableData.value.forEach(item => {
    xAxisData.push(item.courseName);
  });

  // Remove duplicate data
  xAxisData = Array.from(new Set(xAxisData));

  // get total roll call count list
  count = xAxisData.map(countItem => {
    return tableData.value.filter(item => item.courseName === countItem).reduce((total, cur) => total + cur._count, 0);
  });

  // get list of correct roll calls
  correctCount = xAxisData.map(countItem => {
    return tableData.value.filter(item => item.courseName === countItem).reduce((total, cur) => total + cur.correctCount, 0);
  });

  // Get the correctness of the name and number
  correctRate = count.map((countItem, index) => {
    return Math.round((correctCount[index] / countItem) * 100);
  });

  if (!count.length) {
    uni.showToast({
      icon: 'none',
      title: '暂无数据',
    });
  }

  // Perform statistics on the data
  if (xAxisData.length > 1) {
    xAxisData.push('综合');

    // The total number of correct roll calls
    const countSum = count.reduce((acc, cur) => acc + cur, 0);
    count.push(countSum);

    // The sum of the correct roll calls
    const correctCountSum = correctCount.reduce((acc, cur) => acc + cur, 0);
    correctCount.push(correctCountSum);

    if (correctRate.length === 0) {
      correctRate.push(0);
    } else {
      // Average accuracy of all
      const correctRateSum = Math.round(correctRate.reduce((acc, cur) => acc + cur, 0) / correctRate.length);
      correctRate.push(correctRateSum);
    }
  }

  // Set the height of the y-axis to: 2 times the maximum value of the named quantity
  if (count.length > 0) {
    optsAll.yAxis.data[0].max = Math.round(Math.max(...count) * 2);
  }

  // Set the font size according to the number of roll calls to avoid overlapping numbers
  const coutSize = getFontSize(Math.max(...count, ...correctCount));

  // Update chart data
  teacherData.value = {
    categories: xAxisData.length !== 0 ? xAxisData : [ '' ],
    series: [{
      name: '提问数量',
      data: count,
      type: 'column',
      color: '#FAC858',
      textSize: coutSize,
    }, {
      name: '正确数量',
      data: correctCount,
      type: 'column',
      color: '#91CB74',
      textSize: coutSize,
    }, {
      name: '正确率',
      type: 'line',
      color: '#FAC858',
      index: 1,
      data: correctRate,
      format: 'mixLine',
      addPoint: true,
      textSize: coutSize,
    }],
  };
};

// Get the teacher total roll call data
// The data format is the same as the headMasterScore function, except that the parameters passed in are different.
export const teacherScore = async (teacherDingId, courseDingId, startDate, endDate, tableData) => {
  const res = await teacherScoreAPI(teacherDingId, courseDingId, startDate, endDate);

  res.data.forEach(item => {
    if (!Number.isInteger(item._avg.score)) {
      item._avg.score = item._avg.score.toFixed(1);
    }
  });

  tableData.value = res.data;
};

// Get the teacher correct roll call data
// The data format is the same as the headMasterCorrectScore function, except that the parameters passed in are different.
export const teacherCorrectScore = async (teacherDingId, courseDingId, startDate, endDate, tableData, teacherData, optsAll) => {
  const res = await teacherCorrectScoreAPI(teacherDingId, courseDingId, startDate, endDate);

  tableData.value.forEach(item => {
    item.accuracy = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count / item._count || 0;
    item.accuracy = Math.floor(item.accuracy * 100) + '%';
    item.correctCount = res.data.filter(e => e.studentId === item.studentId && e.classId === item.classId)[0]?._count || 0;
    item.incorrectCount = item._count - item.correctCount - item.absentCount;
  });

  // x-axis data, here is the class name list
  let xAxisData = [];
  let count = [];
  let correctCount = [];
  let correctRate = [];

  tableData.value.forEach(item => {
    xAxisData.push(item.className);
  });
  xAxisData = Array.from(new Set(xAxisData));

  count = xAxisData.map(countItem => {
    return tableData.value.filter(item => countItem === item.className).reduce((total, cur) => total + cur._count, 0);
  });

  correctCount = xAxisData.map(countItem => {
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

  if (xAxisData.length > 1) {
    xAxisData.push('综合');

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

  const coutSize = getFontSize(Math.max(...count, ...correctCount));

  teacherData.value = {
    categories: xAxisData.length !== 0 ? xAxisData : [ '' ],
    series: [{
      name: '提问数量',
      data: count,
      type: 'column',
      color: '#FAC858',
      textSize: coutSize,
    }, {
      name: '正确数量',
      data: correctCount,
      type: 'column',
      color: '#91CB74',
      textSize: coutSize,
    }, {
      name: '正确率',
      type: 'line',
      color: '#FAC858',
      index: 1,
      data: correctRate,
      format: 'mixLine',
      addPoint: true,
      textSize: coutSize,
    }],
  };
};

export const gradeId = (gradeAllData, period = '') => {
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
