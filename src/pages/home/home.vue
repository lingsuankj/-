<template>
  <view class="body">
    <image class="bannerImg" src="../../static/images/cf5eb8adff344fcc0b17753d9f922e6.png" mode="aspectFill">
    </image>
    <view class="chartBox">
      <view class="chartTitle">学生答题互动频率</view>
      <view class="summarizeLine">
        <qiun-data-charts type="line" :opts="summarizeLineOpts" :chartData="summarizeLineData" />
      </view>
    </view>
    <view class="chartBox">
      <view class="chartTitle">学生答题次数</view>
      <view class="personageBox">
        <view class="personage">
          <view class="areaCharts">
            <qiun-data-charts type="area" :opts="personageAreaOpts" :chartData="personageAreaDataL" />
          </view>
          <text class="name">{{ stuInfo[0].name }}</text>
          <text class="num">{{ stuInfo[0].count }}</text>
        </view>
        <view class="personage">
          <view class="areaCharts">
            <qiun-data-charts type="area" :opts="personageAreaOpts" :chartData="personageAreaDataR" />
          </view>
          <text class="name">{{ stuInfo[1].name }}</text>
          <text class="num">{{ stuInfo[1].count }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { onLoad, onReady } from '@dcloudio/uni-app';
  import { ref } from 'vue';
  import { popularClass, popularStudent } from '../../utils/http/home';

  let summarizeLineData = ref({});
  let personageAreaDataL = ref({});
  let personageAreaDataR = ref({});
  const stuInfo = ref([{
    name: '',
    count: ''
  }, {
    name: '',
    count: ''
  }]);

  const summarizeLineOpts = {
    animation: true,
    legend: {
      show: false,
    }
  };

  const personageAreaOpts = {
    color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
    padding: [10, 15, 15, 15],
    dataLabel: false,
    dataPointShape: false,
    enableScroll: false,
    legend: {
      show: false,
    },
    xAxis: {
      disabled: true,
      axisLine: false,
    },
    yAxis: {
      disableGrid: true,
      disabled: true,
    },
    extra: {
      area: {
        type: "curve",
        opacity: 0.2,
        addLine: true,
        width: 2,
        gradient: true,
        activeType: "hollow",
      },
    },
  }

  onReady(async () => {
    await popularClass(summarizeLineData);
    await popularStudent(personageAreaDataL, personageAreaDataR, stuInfo);
  })
</script>

<style lang="scss">
  .body {
    min-height: 100vh;
    background-color: #F7F8FA;

    .bannerImg {
      display: block;
      margin: 0 auto -100rpx;
      width: 730rpx;
      height: 350rpx;
      border-radius: 15rpx;
    }

    .chartBox {
      margin: 0 auto 40rpx;
      width: 680rpx;
      position: relative;
      z-index: 9;

      // 图表-标题
      .chartTitle {
        margin-bottom: 20rpx;
        font-size: 28rpx;
        font-weight: 700;
      }

      // 图表-父盒子
      .summarizeLine {
        padding: 15rpx 0rpx;
        height: 400rpx;
        background-color: #fff;
        border-radius: 30rpx;
      }

      // 两个图表的父盒子
      .personageBox {
        display: flex;
        justify-content: space-between;
        height: 250rpx;

        .personage {
          position: relative;
          width: 47%;
          background-color: #fff;
          border-radius: 30rpx;

          .areaCharts {
            margin-top: 50rpx;
            height: 200rpx;
          }

          .name {
            position: absolute;
            top: 25rpx;
            left: 25rpx;
            font-size: 26rpx;
            font-weight: 600;
            color: #777;
          }

          .num {
            position: absolute;
            top: 70rpx;
            left: 25rpx;
            font-size: 28rpx;
            font-weight: 900;
            color: #555;

            &::before {
              position: absolute;
              right: -30rpx;
              content: '';
              display: block;
              width: 0rpx;
              height: 0rpx;
              border-top: 8rpx solid transparent;
              border-bottom: 8rpx solid #10AEFF;
              border-left: 8rpx solid transparent;
              border-right: 8rpx solid transparent;
            }
          }
        }
      }

    }
  }
</style>