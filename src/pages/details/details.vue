<template>
  <view class="body">
    <view class="dateSelector">
      <uni-datetime-picker v-model="dateRange" type="daterange" :clear-icon="false" @change="dateChange" />
    </view>
    <view class="stuSelector" v-if="memberStore.userInfo.studentInfoList">
      <picker mode="selector" :value=stuIndex @change="stuChange" :range="memberStore.userInfo.studentInfoList" range-key="name">
        <view class="stuContent">
          <view class="stuText">{{ memberStore.userInfo.studentInfoList[stuIndex]?.name }}</view>
          <view class="stuIcon"></view>
        </view>
      </picker>
    </view>

    <view class="chartsBox">
      <view class="title">
        <text class="titleLeft">本次统计</text>
      </view>
      <view class="charts">
        <Loading :chartData="statisticsData" />
        <qiun-data-charts type="ring" :opts="statisticsOpts" :chartData="statisticsData" :loadingType="0" />
      </view>
    </view>

    <view class="chartsBox">
      <view class="title">
        <text class="titleLeft">正确率 %</text>
      </view>
      <view class="charts">
        <Loading :chartData="accuracyData" />
        <qiun-data-charts type="mix" :opts="accuracyOpts" :chartData="accuracyData" :ontouch="true" :loadingType="0" background="#F8F8F8" />
      </view>
    </view>
  </view>
</template>

<script setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { ref } from 'vue';

  import { 
    getStatisticsData,
    getAccuracyData,
    getQpsMax,
   } from '../../utils/http/details.js';

  import {
    getDeptName,
    getDeptParentId,
    getUserRelationList,
    getStuInfo,
  } from '../../utils/http/detailDing';

  import {
    getAuthCode,
    getToken,
    getUserId,
    getUserInfo,
  } from '../../utils/http/config';

  import { useMemberStore } from '../../stores/modules/member.js';

  import Loading from '../../components/loading/index.vue';

  // #ifdef H5
  import * as dd from 'dingtalk-jsapi';
  // #endif

  const memberStore = useMemberStore();

  // The default time range is: 1st of this month to today
  const currentDate = new Date();
  const startDay = 1;
  // currentDate: '2024-08-01T06:22:57.621Z'
  currentDate.setDate(startDay);
  // '2024-08-01'
  const startDate = currentDate.toISOString().split('T')[0];
  // '2024-08-09'
  const endDate = new Date().toISOString().split('T')[0];
  const dateRange = ref([startDate, endDate]);
  let sendDateRange = [startDate + 'T00:00:00Z', endDate + 'T23:59:59Z'];

  // Called after selecting a date
  const dateChange = async (e) => {
    // Formatting date ranges
    sendDateRange = [e[0] + 'T00:00:00Z', e[1] + 'T23:59:59Z'];
    // Get chart data
    await getStatisticsData(sendDateRange, statisticsData, totalData, stuIndex, statisticsOpts);
    await getAccuracyData(sendDateRange, accuracyData, totalData, stuIndex, accuracyOpts);
  };

  // The currently selected student id
  let stuIndex = ref(0);

  // Called after switching students
  const stuChange = async (e) => {
    // Update the currently selected student id
    stuIndex.value = e.detail.value;

    // Get chart data
    await getStatisticsData(sendDateRange, statisticsData, totalData, stuIndex, statisticsOpts);
    await getAccuracyData(sendDateRange, accuracyData, totalData, stuIndex, accuracyOpts);
  };

  // This statistical chart data
  const statisticsData = ref({});
  // Correct chart data
  const accuracyData = ref({});

  const statisticsOpts = {
    color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#EA7CCC'],
    padding: [5, 0, 10, 0],
    enableScroll: false,
    title: {
      name: '',
      fontSize: 12,
      color: '#666666',
    },
    subtitle: {
      name: '',
      fontSize: 14,
      color: '#7cb5ec',
    },
    extra: {
      ring: {
        ringWidth: 25,
        labelWidth: 15,
        centerColor: '#F8F8F8',
      },
    },
    legend: {
      show: false,
    }
  }
  const accuracyOpts = {
    padding: [0, 15, 0, 15],
    enableScroll: true,
    legend: {
      fontSize: 10,
    },
    xAxis: {
      disableGrid: true,
      scrollShow: true,
      scrollShow: true,
      // The number of bar charts on the current page
      itemCount: 6,
      fontSize: 10,
    },
    yAxis: {
      gridType: 'dash',
      dashLength: 2,
      data: [
        {
          position: "left",
          title: "",
          min: 0,
          max: 100,
          tofix: 1,
          fontSize: 10,
          format: 'mixColumnyAxis',
        },
        {
          position: "left",
          title: "正确率",
          disabled: true,
          min: -100,
          max: 100,
        },
      ]
    },
    extra: {
      mix: {
        column: {
          type: "group",
          width: 18,
          meterBorder: 0,
          activeBgOpacity: 0.08,
          meterFillColor: '#C3E7FE',
          activeBgColor: '#000000',
          labelPosition: 'outside',
        },
        line: {
        }
      }
    },
  }

  let totalData = ref([]);

  // #ifdef H5
  onShow(() => {
    uni.setNavigationBarTitle({
      title: '',
    });
    dd.setNavigationTitle({
      title: '个人详情',
    });
  });
  // #endif

  onLoad(async () => {
    memberStore.Limiting = false;

    // Store old data and use it when the request triggers current limiting
    memberStore.oldUserInfo = JSON.parse(JSON.stringify(memberStore.userInfo));

    // Hide the tabbar at the bottom of the page
    uni.hideTabBar();
    await getQpsMax();
    await getAuthCode();
    await getToken();

    try {
      await getUserId();
      await getUserInfo();

      await getDeptName();
      await getDeptParentId();
    } catch(e) {
      if (memberStore.Limiting) memberStore.userInfo = memberStore.oldUserInfo;
    }

    // Determine whether you are a guardian/student
    const hasStuInfo = memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent;
    // If not, jump to the teacher page
    if (!hasStuInfo) {
      uni.switchTab({
        url: '/pages/inquire/inquire',
      });
    } else {
      // Display the tabbar at the bottom of the page
      uni.showTabBar();

      // If the guardian
      if (memberStore.userInfo.isGuardian) {
        try {
          // Get your child's Id
          await getUserRelationList();
          // Get your child's name
          await getStuInfo();
        } catch(e) {
          if (memberStore.Limiting) memberStore.userInfo = memberStore.oldUserInfo;
        }
      }

      // Get the total number of student roll calls
      await getStatisticsData(sendDateRange, statisticsData, totalData, stuIndex, statisticsOpts);
      // Get the total number of correct roll calls of students
      await getAccuracyData(sendDateRange, accuracyData, totalData, stuIndex, accuracyOpts);
    }
  });
</script>

<style lang="scss">
  .body {
    min-height: 100vh;
    padding-top: 40rpx;
    background-color: #FFFFFF;

    .dateSelector {
      position: relative;
      margin: 0 auto 20rpx;
      width: 680rpx;

      .uni-calendar:nth-of-type(2) {
        display: none;
      }

      .uni-icons {
        margin-left: 20rpx;
      }
    }

    .stuSelector {
      margin: 0 auto 20rpx;
      padding-left: 20rpx;
      width: 680rpx;
      height: 35px;
      border: 1rpx solid #e5e5e5;
      border-radius: 5px;
      line-height: 35px;
      box-sizing: border-box;
      font-size: 14px;

      .stuContent {
        display: flex;
        justify-content: space-between;

        .stuIcon {
          margin: auto 20rpx;
          transform: rotate(-45deg);
          width: 7px;
          height: 7px;
          border-left: 1px solid #999;
          border-bottom: 1px solid #999;
        }
      }
    }

    .chartsBox {
      margin: 40rpx auto;
      padding: 0;
      width: 680rpx;
      height: 500rpx;
      background-color: #F8F8F8;
      border-radius: 30rpx;
      box-sizing: border-box;

      .title {
        padding: 20rpx 60rpx 0;
        display: flex;
        justify-content: space-between;

        .titleLeft {
          position: relative;
          margin-bottom: 16rpx;
          font-size: 28rpx;
          font-weight: 700;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 70%;
            background-color: #4095E5;
            position: absolute;
            left: -16rpx;
            top: 5rpx;
          }
        }

        .titleRight {
          font-size: 36rpx;
          color: #5F97BF;
        }
      }

      .charts {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 85%;
      }
    }
  }
</style>