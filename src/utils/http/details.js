import { statisticsAPI, accuracyAPI } from '../request/details.js';

import { useMemberStore } from '../../stores/modules/member.js';

const memberStore = useMemberStore();

const getFontSize = num => {
  if (num < 1000) {
    return 10;
  }

  return 8;
};

export const getStatisticsData = async (sendDateRange, statisticsData, totalData, stuIndex, statisticsOpts) => {
  return new Promise(async resolve => {
    const res = await statisticsAPI(memberStore.userInfo.studentInfoList[stuIndex.value].userId, sendDateRange[0], sendDateRange[1]);

    const sum = res.data.reduce((total, cur) => {
      return total + cur._count;
    }, 0);

    statisticsOpts.subtitle.name = `合计: ${sum}次`;

    const newData = [];
    for (const k of res.data) {
      newData.push({
        name: k.courseName,
        value: k._count,
        labelText: `${k.courseName}:${k._count}次`,
      });
    }
    totalData.value = [ ...newData ];

    if (newData.length === 0) {
      uni.showToast({
        icon: 'none',
        title: '暂无数据',
      });

      newData.push({
        name: '',
        value: 0,
        labelShow: false,
      });
    }

    statisticsData.value = {
      series: [{
        data: newData,
      }],
    };
    resolve();
  });
};

export const getAccuracyData = async (sendDateRange, accuracyData, totalData, stuIndex, accuracyOpts) => {
  return new Promise(async resolve => {
    const res = await accuracyAPI(memberStore.userInfo.studentInfoList[stuIndex.value].userId, sendDateRange[0], sendDateRange[1]);

    totalData.value.forEach(item => {
      item.correct = res.data.filter(items => items.courseName === item.name)[0]?._count || 0;
    });

    const course = [];
    const correctCount = [];
    const correctRate = [];

    totalData.value.forEach(item => {
      course.push(item.name);
      correctCount.push(item.correct);
      correctRate.push(Math.round(item.correct / item.value * 100) || 0);
    });

    if (course.length > 1) {
      course.push('综合');

      const correctCountSum = correctCount.reduce((acc, cur) => acc + cur, 0);
      correctCount.push(correctCountSum);

      if (correctRate.length === 0) {
        correctRate.push(0);
      } else {
        const correctRateSum = Math.round(correctRate.reduce((acc, cur) => acc + cur, 0) / correctRate.length);
        correctRate.push(correctRateSum);
      }
    }

    if (correctCount.length > 0) {
      // Set the maximum value of the Y axis
      // When the correct number is 0, the y-axis must be greater than 0, otherwise the data will show the highest
      accuracyOpts.yAxis.data[0].max = Math.round(Math.max(...correctCount) * 2) || 1;
    }

    const coutSize = getFontSize(Math.max(...correctCount));

    accuracyData.value = {
      categories: course.length === 0 ? [ '' ] : course,
      series: [{
        name: '正确数量',
        data: correctCount,
        type: 'column',
        color: '#91CB74',
        textSize: coutSize,
      }, {
        name: '正确率',
        data: correctRate,
        type: 'line',
        color: '#FAC858',
        textSize: coutSize,
        format: 'mixLine',
        addPoint: true,
        index: 1,
      }],
    };
    resolve();
  });
};

