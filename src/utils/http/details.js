import { statisticsAPI, accuracyAPI, qpsMaxAPI } from '../request/details.js';

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
    // Get the data for the donut chart
    const res = await statisticsAPI(memberStore.userInfo.studentInfoList[stuIndex.value].userId, sendDateRange[0], sendDateRange[1]);
    /*
    res: [
      {
        // Total number of roll calls
        "_count": 65,
        "courseId": 1,
        "courseName": "语文"
      },
      {
        "_count": 83,
        "courseId": 2,
        "courseName": "数学"
      }
    ]
    */
    // Calculate the total number of questions for all subjects
    const sum = res.data.reduce((total, cur) => {
      return total + cur._count;
    }, 0);

    // Update the text in the middle of the donut chart
    statisticsOpts.subtitle.name = `合计: ${sum}次`;

    const newData = [];
    for (const k of res.data) {
      newData.push({
        // Course Name
        name: k.courseName,
        // Number of roll calls
        value: k._count,
        // Tagged content
        labelText: `${k.courseName}:${k._count}次`,
      });
    }

    // Update the total quantity in the middle of the chart
    totalData.value = [ ...newData ];

    // When there is no data, prompt
    if (newData.length === 0) {
      uni.showToast({
        icon: 'none',
        title: '暂无数据',
      });

      // Give an empty data and keep the chart existing
      newData.push({
        name: '',
        value: 0,
        labelShow: false,
      });
    }

    // Update the data of the donut chart
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
    /*
    res: [
      {
        // Total number of correct roll calls
        "_count": 11,
        "courseId": 1,
        "courseName": "语文"
      },
      {
        "_count": 27,
        "courseId": 2,
        "courseName": "数学"
      }
    ]
    */

    totalData.value.forEach(item => {
      item.correct = res.data.filter(items => items.courseName === item.name)[0]?._count || 0;
    });

    // x-axis data: list of named quantities
    const course = [];
    // Y-axis data: list of correct roll calls
    const correctCount = [];
    // Y-axis data: accuracy list
    const correctRate = [];

    totalData.value.forEach(item => {
      course.push(item.name);
      correctCount.push(item.correct);
      // Correct quantity / Total quantity
      correctRate.push(Math.round(item.correct / item.value * 100) || 0);
    });

    // statistics
    if (course.length > 1) {
      course.push('综合');

      // The sum of the correct amount
      const correctCountSum = correctCount.reduce((acc, cur) => acc + cur, 0);
      correctCount.push(correctCountSum);

      if (correctRate.length === 0) {
        correctRate.push(0);
      } else {
        // Average accuracy
        const correctRateSum = Math.round(correctRate.reduce((acc, cur) => acc + cur, 0) / correctRate.length);
        correctRate.push(correctRateSum);
      }
    }

    if (correctCount.length > 0) {
      // Set the maximum value of the Y axis
      // When the correct number is 0, the y-axis must be greater than 0, otherwise the data will show the highest
      accuracyOpts.yAxis.data[0].max = Math.round(Math.max(...correctCount) * 2) || 1;
    }

    // Set the font size according to the length of the word
    const coutSize = getFontSize(Math.max(...correctCount));

    // Update chart data
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

// Get the current enterprise's qps limit
export const getQpsMax = async () => {
  const res = await qpsMaxAPI();
  memberStore.qpsMax = res.data - 2;
};
