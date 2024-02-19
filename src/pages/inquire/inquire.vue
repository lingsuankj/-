<template>
  <view class="body">
    <image class="bannerImg" src="../../static/images/e550b088ea89cdd2854d9b45878f7c0.png" mode="aspectFill">
    </image>
    <view class="dateSelector">
      <uni-datetime-picker v-model="dateRange" type="daterange" :clear-icon="false" @change="dateRangeChange" />
    </view>
    <view class="classAllSelector" v-if="memberStore.userInfo.isHeadMaster">
      <uni-data-picker placeholder="请选择班级" :clear-icon="false" :localdata="classAllData" v-model="classAllId"
        @change="classAllChange">
      </uni-data-picker>
    </view>
    <view class="classSelector" v-if="memberStore.userInfo.isHeadTeacher && !memberStore.userInfo.isHeadMaster">
      <picker mode="selector" @change="classChange" :range="classRange" range-key="className">
        <view class="classContent">
          <view class="classText">{{ classText }}</view>
          <view class="classIcon"></view>
        </view>
      </picker>
    </view>
    <view class="courseSelector" v-if="memberStore.userInfo.isHeadMaster">
      <picker mode="selector" @change="courseChange" :range="courseList" range-key="name">
        <view class="courseContent">
          <view class="courseText">{{ course }}</view>
          <view class="courseIcon"></view>
        </view>
      </picker>
    </view>
    <!-- 图表-班主任 -->
    <view class="teacherBoss" v-if="memberStore?.userInfo?.isHeadTeacher && !memberStore?.userInfo?.isHeadMaster">
      <qiun-data-charts type="column" :opts="optsAll" :ontouch='true' :chartData="headTeacherData"
        @getIndex="clickHeadTeacher" />
    </view>
    <!-- 图表-任课老师 -->
    <view class="teacherOrdinary" v-else>
      <view class="title">{{ course }}</view>
      <qiun-data-charts type="column" :opts="optsAll" :ontouch='true' :chartData="teacherData"
        @getIndex="clickTeacher" />
    </view>

    <!-- 表格 -->
    <view class="tableBox" v-show="tableFlag">
      <view class="title">
        {{ classText }}&nbsp;{{ course }}
        <view class="btnOff" @tap="tableFlag = !tableFlag">x</view>
      </view>
      <!-- 表头 -->
      <view class="th">
        <view class="td">姓名</view>
        <view class="td">答题数量</view>
        <view class="td">平均分数</view>
        <view class="td">正确率</view>
      </view>
      <scroll-view scroll-y=true class="table">
        <view class="tr" v-for="(item, index) in tableDataShow" :key='index'>
          <view class="td">{{ item.studentName }}</view>
          <view class="td">{{ item._count }}</view>
          <view class="td">{{ item._avg.score }}</view>
          <view class="td">{{ item.accuracy }}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
  import { onLoad, onReady } from '@dcloudio/uni-app';
  import { ref } from 'vue';

  // #ifndef H5
  import { useMemberStore } from '../../stores/modules/member.js';
  // #endif

  // #ifdef H5
  import { useMemberStore } from '../../stores/modules/memberH5.js';
  // #endif

  import { teacherScore,
    teacherCorrectScore,
    headTeacherScore,
    headTeacherCorrectScore,
    classAll,
    headMasterScore,
    headMasterCorrectScore,
    teacherClassDetail } from '../../utils/http/inquire';

  const memberStore = useMemberStore();

  let classId = ref(memberStore.userInfo.teacherInfoList[0] ? memberStore.userInfo.teacherInfoList[0].classId : '');

  // getChartData argument
  let headMasterCourseId = ref(memberStore.userInfo.allCourse[0]?.deptid);
  let headMasterGrade = ref(''); // '小学一年级2024级'

  let headTeacherGrade = ref(memberStore.userInfo.teacherInfoList[0]?.gradeName); // '小学一年级2024级'
  let headTeacherClass = ref(memberStore.userInfo.teacherInfoList[0]?.className); // '1班' (一年级一班 => 1班)
  if (headTeacherClass.value?.includes('级')) {
    headTeacherClass.value = headTeacherClass.value.slice(headTeacherClass.value.indexOf('级') + 1);
  } else if (headTeacherClass.value?.includes('班')) {
    headTeacherClass.value = headTeacherClass.value.slice(headTeacherClass.value.indexOf('班') + 1);
  }

  let teacherCourseId = ref(memberStore.userInfo.teacherSubjectList[0]?.deptid);

  // 日期
  const currentDate = new Date();
  const startDay = 1;
  currentDate.setDate(startDay);
  const startDate = currentDate.toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];
  const dateRange = ref([startDate, endDate]);
  const sendDateRange = ref([startDate + 'T00:00:00Z', endDate + 'T23:59:59Z']);

  const dateRangeChange = async (e) => {
    sendDateRange.value = [e[0] + 'T00:00:00Z', e[1] + 'T23:59:59Z'];

    await getChartData();
  };

  // 选择班级
  let classAllId = ref();

  const classAllData = ref([]);

  // 校长 - 选择班级
  const classAllChange = async (e) => {
    // if (e.detail.value.length === 3) {
    //   console.log(e.detail.value[1].text + e.detail.value[2].text);
    // }

    classId.value = e.detail.value[e.detail.value.length - 1].value;
    classText.value = '';
    e.detail.value.forEach(item => {
      classText.value = classText.value + item.text + ' ';
    })

    headMasterGrade.value = e.detail.value[1].text + e.detail.value[2].text;
    await getChartData();
  }

  const classRange = ref(memberStore.userInfo.teacherInfoList);
  let classText = ref(classRange.value[0] ? classRange.value[0].className : '');
  
  // 老师 - 选择班级
  const classChange = async (e) => {
    classText.value = memberStore.userInfo.teacherInfoList[e.detail.value].className;
    classId.value = memberStore.userInfo.teacherInfoList[e.detail.value].classId;

    headTeacherGrade.value = memberStore.userInfo.teacherInfoList[e.detail.value].gradeName;
    headTeacherClass.value = memberStore.userInfo.teacherInfoList[e.detail.value].className;
    if (headTeacherClass.value.includes('级')) {
      headTeacherClass.value = headTeacherClass.value.slice(headTeacherClass.value.indexOf('级') + 1);
    } else {
      headTeacherClass.value = headTeacherClass.value.slice(headTeacherClass.value.indexOf('班') + 1);
    }

    await getChartData();
  };

  const courseList = ref(memberStore.userInfo.allCourse);
  let course = ref(courseList?.value[0].name);

  // 选择科目
  const courseChange = async (e) => {
    headMasterCourseId.value = courseList.value[e.detail.value].deptid;

    course.value = courseList.value[e.detail.value].name;
    await getChartData();
  };

  // 表格
  const tableData = ref([]);
  const tableDataShow = ref([]);
  let tableFlag = ref(false);

  // 点击班主任 图表
  const clickHeadTeacher = (e) => {
    if (e.currentIndex.index !== -1) {
      tableFlag.value = true;
      course.value = e.opts.categories[e.currentIndex.index];
  
      tableDataShow.value = tableData.value.filter(item => item.courseName === e.opts.categories[e.currentIndex.index]);
    }
  };

  const clickTeacher = (e) => {
    if (e.currentIndex.index !== -1) {
      tableFlag.value = true;
      classText.value = e.opts.categories[e.currentIndex.index];
      tableDataShow.value = tableData.value.filter(item => e.opts.categories[e.currentIndex.index].includes(item.class));
      // // classId.value = memberStore.userInfo.teacherInfoList[e.currentIndex.index].classId;
    }
  };

  const headTeacherData = ref({});
  const teacherData = ref({});
  const optsAll = {
    color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
    padding: [15, 15, 0, 15],
    enableScroll: true,
    legend: {},
    xAxis: {
      disableGrid: true,
      scrollShow: true,
      itemCount: 4,
    },
    yAxis: {
      gridType: 'dash',
      dashLength: 2,
    },
    extra: {
      column: {
        type: 'stack',
        width: 30,
        activeBgColor: '#000000',
        activeBgOpacity: 0.08,
        labelPosition: 'center'
      }
    },
  };

  const getChartData = async () => {
    if (memberStore.userInfo.isHeadMaster) {
      await headMasterScore(headMasterCourseId.value, headMasterGrade.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
      await headMasterCorrectScore(headMasterCourseId.value, headMasterGrade.value, sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData);
    } else if (memberStore.userInfo.isHeadTeacher) {
      await headTeacherScore(headTeacherGrade.value, headTeacherClass.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
      await headTeacherCorrectScore(headTeacherGrade.value, headTeacherClass.value, sendDateRange.value[0], sendDateRange.value[1], tableData, headTeacherData);
    } else {
      await teacherScore(teacherCourseId.value, '44581120626478', sendDateRange.value[0], sendDateRange.value[1], tableData);
      await teacherCorrectScore(teacherCourseId.value, '44581120626478', sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData);
      // 完成 ⬇
      // await teacherScore(teacherCourseId.value, memberStore.userInfo.userid, sendDateRange.value[0], sendDateRange.value[1], tableData);
      // await teacherCorrectScore(teacherCourseId.value, memberStore.userInfo.userid, sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData);
    }
  }

  onLoad(async () => {
    // 校长/年级主任 - 选择年级
    await classAll(classAllData, classAllId, headMasterGrade);
    await teacherClassDetail(headTeacherGrade);
    await getChartData();
  })
</script>

<style lang="scss">
  .body {
    font-size: 28rpx;

    .bannerImg {
      display: block;
      margin: 0 auto 30rpx;
      width: 730rpx;
      height: 350rpx;
      border-radius: 15rpx;
    }

    .dateSelector {
      margin: 0 auto 20rpx;
      width: 680rpx;

      // 解决日期选择器大小不适配 H5 端的问题
      /* #ifdef H5 */
      .uni-calendar:nth-of-type(2) {
        display: none !important;
      }

      /* #endif */
      .uni-icons {
        margin-left: 20rpx;
      }
    }

    .classAllSelector {
      margin: 0 auto 20rpx;
      width: 680rpx;

      /* #ifdef MP-ALIPAY */
      .selected-area {
        flex: none;
      }

      /* #endif */
      // 年级/班级 边距

      .input-value .selected-item {
        margin-left: 0;
        margin-right: 0;
      }

      // 文字
      .input-value {
        padding-left: 20rpx;
        padding-right: 0;
      }

      .arrow-area {
        margin-right: 20rpx;
        width: 10px;
      }
    }

    .classSelector {
      margin: 0 auto 20rpx;
      padding-left: 20rpx;
      width: 680rpx;
      height: 35px;
      border: 1rpx solid #e5e5e5;
      border-radius: 5px;
      line-height: 35px;
      box-sizing: border-box;
      font-size: 14px;

      .classContent {
        display: flex;
        justify-content: space-between;

        .classIcon {
          margin: auto 20rpx;
          transform: rotate(-45deg);
          width: 7px;
          height: 7px;
          border-left: 1px solid #999;
          border-bottom: 1px solid #999;
        }
      }
    }

    .courseSelector {
      margin: 0 auto 20rpx;
      padding-left: 20rpx;
      width: 680rpx;
      height: 35px;
      border: 1rpx solid #e5e5e5;
      border-radius: 5px;
      line-height: 35px;
      box-sizing: border-box;
      font-size: 14px;

      .courseContent {
        display: flex;
        justify-content: space-between;

        .courseIcon {
          margin: auto 20rpx;
          transform: rotate(-45deg);
          width: 7px;
          height: 7px;
          border-left: 1px solid #999;
          border-bottom: 1px solid #999;
        }
      }
    }

    // 图表 - 班主任及以上可见
    .teacherBoss {
      margin: 40rpx auto;
      width: 680rpx;
      // height: 500rpx;
    }

    // 图表 - 任课老师可见
    .teacherOrdinary {
      margin: 40rpx auto;
      width: 680rpx;

      .title {
        text-align: center;
      }
    }

    // 弹框 - 表格
    .tableBox {
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      // width: 680rpx;
      // height: 800rpx;
      width: 90%;
      height: 80%;
      background-color: #e0e0e0;
      border-radius: 15rpx;
      box-shadow: 20rpx 20rpx 60rpx #bebebe,
        -20rpx -20rpx 60rpx #ffffff;
      background-image: linear-gradient(to right bottom, #ebebeb, #ffffff);
      transition: all .5s;

      .title {
        position: relative;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 36rpx;
        font-weight: 800;

        .btnOff {
          position: absolute;
          top: 0rpx;
          right: 30rpx;
          font-size: 36rpx;
        }
      }

      .th {
        margin: 0 auto;
        width: 90%;
        display: flex;
        justify-content: left;
        text-align: center;
        background-color: #e4ebeb;

        .td {
          width: 25%;
          border: 1rpx solid #ccc;
          padding: 10rpx;
        }
      }

      .table {
        // position: relative;
        display: flex;
        flex-direction: column;
        width: 90%;
        height: calc(100% - 80rpx - 56rpx - 5%);
        margin: 0 auto;

        .tr {
          display: flex;
          justify-content: left;
          text-align: center;
        }

        .td {
          width: 25%;
          border: 1rpx solid #ccc;
          padding: 10rpx;
        }
      }
    }
  }
</style>