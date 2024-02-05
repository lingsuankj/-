<template>
  <view class="body">
    <view class="dateSelector">
      <uni-datetime-picker v-model="dateRange" type="daterange" :clear-icon="false" @change="dateChange" />
    </view>
    <view class="stuSelector">
      <picker mode="selector" @change="stuChange" :range="memberStore.userInfo.studentInfoList" range-key="name">
        <view class="stuContent">
          <view class="stuText">{{ memberStore.userInfo.studentInfoList[stuIndex].name }}</view>
          <view class="stuIcon"></view>
        </view>
      </picker>
    </view>

    <!-- 本次统计-饼状图 -->
    <view class="chartsBox" v-if="statisticsData?.series">
      <view class="title">
        <text class="titleLeft">本次统计</text>
        <text class="titleRight">{{ statisticsTotal }}次</text>
      </view>
      <view class="charts">
        <qiun-data-charts type="pie" :opts="statisticsOpts" :chartData="statisticsData" />
      </view>
    </view>

    <!-- 正确率-折线图 -->
    <view class="chartsBox">
      <view class="title">
        <text class="titleLeft">正确率 %</text>
      </view>
      <view class="charts">
        <qiun-data-charts type="area" :opts="accuracyOpts" :chartData="accuracyData" />
      </view>
    </view>
  </view>
</template>

<script setup>
  import { onLoad, onReady } from '@dcloudio/uni-app';
  import { ref } from 'vue';

  import { getStatisticsData, getAccuracyData } from '../../utils/http/details.js';
  import { useMemberStore } from '../../stores/modules/member.js';

  const memberStore = useMemberStore();

  const currentDate = new Date();
  const startDay = 1;
  currentDate.setDate(startDay);
  const startDate = currentDate.toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];
  const dateRange = ref([startDate, endDate]);
  let sendDateRange = [startDate + 'T00:00:00Z', endDate + 'T23:59:59Z'];

  const dateChange = async (e) => {
    sendDateRange = [e[0] + 'T00:00:00Z', e[1] + 'T23:59:59Z'];
    await getStatisticsData(sendDateRange, statisticsData, statisticsTotal, totalData, stuIndex);
    await getAccuracyData(sendDateRange, accuracyData, totalData, stuIndex);
  };

  let stuIndex = ref(0);
  const stuChange = async (e) => {
    stuIndex.value = e.detail.value;
    uni.setNavigationBarTitle({
      title: memberStore.userInfo.studentInfoList[stuIndex.value].name + '的主页',
    });
    await getStatisticsData(sendDateRange, statisticsData, statisticsTotal, totalData, stuIndex);
    await getAccuracyData(sendDateRange, accuracyData, totalData, stuIndex);
  };

  let statisticsTotal = ref('');
  const statisticsData = ref({});
  // const statisticsData = ref({
  //     series: [{
  //       data: [{name: 's',value: 1}],
  //     }],
  //   });
  const accuracyData = ref({});

  const statisticsOpts = {
    color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#EA7CCC"],
    padding: [5, 5, 5, 5],
    enableScroll: false,
    title: {
      name: "",
      fontSize: 15,
      color: "#666666",
    },
    subtitle: {
      name: "",
      fontSize: 25,
      color: "#7cb5ec",
    },
    extra: {
      ring: {
        ringWidth: 30,
        activeOpacity: 0.5,
        activeRadius: 10,
        offsetAngle: 0,
        labelWidth: 15,
        border: true,
        borderWidth: 2,
        borderColor: "#FFFFFF",
        centerColor: "#F8F8F8",
      },
    },
    legend: {
      show: false,
    }
  }
  const accuracyOpts = {
    color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#EA7CCC"],
    padding: [15, 15, 0, 15],
    enableScroll: false,
    legend: {
      show: false,
    },
    xAxis: {
      disableGrid: true,
    },
    yAxis: {
      gridType: "dash",
      dashLength: 2,
      data: [
        {
          min: 0,
          max: 100,
          unit: '%',
        }
      ]
    },
    extra: {
      area: {
        type: "straight",
        opacity: 0.2,
        addLine: true,
        width: 2,
        gradient: false,
        activeType: "hollow",
      },
    },
  }

  let totalData = ref([]);

  onLoad(async () => {
    uni.setNavigationBarTitle({
      title: memberStore.userInfo.studentInfoList[stuIndex.value].name + '的主页',
    });

    await getStatisticsData(sendDateRange, statisticsData, statisticsTotal, totalData, stuIndex);
    await getAccuracyData(sendDateRange, accuracyData, totalData, stuIndex);
  });
</script>

<style lang="scss">
  .body {
    min-height: 100vh;
    padding-top: 40rpx;
    background-color: #fff;

    .dateSelector {
      position: relative;
      margin: 0 auto 20rpx;
      width: 680rpx;

      // 解决日期选择器大小不适配 H5 端的问题
      /* #ifdef H5 */
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
      padding: 20rpx 60rpx 60rpx;
      width: 680rpx;
      height: 500rpx;
      background-color: #F8F8F8;
      border-radius: 30rpx;
      box-sizing: border-box;

      .title {
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
        width: 100%;
        height: 100%;
      }
    }
  }
</style>