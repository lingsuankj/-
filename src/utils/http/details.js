/* eslint-disable no-undef */
import { statisticsAPI, accuracyAPI } from '../request/details.js';
import { useMemberStore } from '../../stores/modules/member.js';

const memberStore = useMemberStore();

export const getStatisticsData = async (sendDateRange, statisticsData, statisticsTotal, totalData, stuIndex) => {
  return new Promise(async resolve => {
    const res = await statisticsAPI(memberStore.userInfo.studentInfoList[stuIndex.value].userId, sendDateRange[0], sendDateRange[1]);
    console.log('饼状图');
    console.log(res.data);
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
    console.log('totalData.value:::::::::');
    console.log(totalData.value);

    if (!totalData.value.length) {
      uni.showToast({
        icon: 'none',
        title: '暂无数据',
      });
    }

    console.log('statisticsData.value-----------');
    console.log(statisticsData.value);
    statisticsData.value = {
      series: [{
        data: newData,
      }],
    };
    console.log('statisticsData.value=============:');
    console.log(statisticsData.value);
    console.log('饼状图：完成');
    resolve();
  });
};

export const getAccuracyData = async (sendDateRange, accuracyData, totalData, stuIndex) => {
  return new Promise(async resolve => {
    const res = await accuracyAPI(memberStore.userInfo.studentInfoList[stuIndex.value].userId, sendDateRange[0], sendDateRange[1]);
    totalData.value.forEach(item => {
      item.correct = res.data.filter(items => items.courseName === item.name)[0]?._count || 0;
    });

    const newCategories = [];
    const newSeries = [];
    totalData.value.forEach(item => {
      newCategories.push(item.name);
      newSeries.push(Math.round(item.correct / item.value * 100));
    });

    accuracyData.value = {
      categories: newCategories,
      series: [{
        name: '正确率',
        data: newSeries,
      }],
    };
    resolve();
  });
};
