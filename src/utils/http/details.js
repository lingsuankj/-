import { statisticsAPI, accuracyAPI } from '../request/details.js';

import { useMemberStore } from
// #ifndef H5
  '../../stores/modules/member.js';
// #endif

// #ifdef H5
'../../stores/modules/memberH5.js';
// #endif

const memberStore = useMemberStore();

export const getStatisticsData = async (sendDateRange, statisticsData, statisticsTotal, totalData, stuIndex) => {
  return new Promise(async resolve => {
    const res = await statisticsAPI(memberStore.userInfo.studentInfoList[stuIndex.value].userId, sendDateRange[0], sendDateRange[1]);

    statisticsTotal.value = res.data.reduce((total, cur) => {
      return total + cur._count;
    }, 0);

    const newData = [];
    for (const k of res.data) {
      newData.push({
        name: k.courseName,
        value: k._count,
        labelText: `${k.courseName}:${k._count}`,
      });
    }
    totalData.value = newData;

    if (!totalData.value.length) {
      uni.showToast({
        icon: 'none',
        title: '暂无数据',
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
      correctRate.push(Math.round(item.correct / item.value * 100));
    });

    if (correctCount.length > 0) {
      accuracyOpts.yAxis.data[0].max = Math.round(Math.max(...correctCount) * 2);
    }

    accuracyData.value = {
      categories: course.length === 0 ? [ '' ] : course,
      series: [{
        name: '正确数量',
        data: correctCount,
        type: 'column',
        color: '#91CB74',
        textSize: 10,
      }, {
        name: '正确率',
        data: correctRate,
        type: 'line',
        color: '#FAC858',
        textSize: 10,
        format: 'mixLine',
        addPoint: true,
        index: 1,
      }],
    };
    resolve();
  });
};

