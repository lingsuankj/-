<template>
  <view class="body">
    <image class="bannerImg" src="../../static/images/e550b088ea89cdd2854d9b45878f7c0.png" mode="aspectFill">
    </image>

    <view class="dateSelector">
      <uni-datetime-picker v-model="dateRange" type="daterange" :clear-icon="false" @change="dateRangeChange" />
    </view>

    <!-- isHeadMaster / isGradeDirector -->
    <view class="classAllSelector" v-if="memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector">
      <uni-data-picker placeholder="请选择班级" :clear-icon="false" :localdata="gradeAllData" v-model="gradeAllDefaultId"
        @change="classAllChange">
      </uni-data-picker>
    </view>

    <!-- isHeadTeacher / isGuardian / isStudent -->
    <view class="classSelector" v-if="(memberStore.userInfo.isHeadTeacher || ((memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent) && !memberStore.userInfo.isTeacher)) && !memberStore.userInfo.isHeadMaster && !memberStore.userInfo.isGradeDirector">
      <picker mode="selector" @change="classChange" :range="classRange" range-key="className">
        <view class="classContent">
          <view class="classText">{{ classText }}</view>
          <view class="classIcon"></view>
        </view>
      </picker>
    </view>

    <!-- isHeadMaster / isGradeDirector -->
    <view class="courseSelector" v-if="memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector">
      <picker mode="selector" @change="courseChange" :range="courseList" range-key="name">
        <view class="courseContent">
          <view class="courseText">{{ course }}</view>
          <view class="courseIcon"></view>
        </view>
      </picker>
    </view>

    <!-- isTeacher / isHeadMaster / isGradeDirector -->
    <view class="teacher" v-if="memberStore.userInfo.isTeacher && !memberStore.userInfo.isHeadTeacher || memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector">
      <view class="title">{{ course }}</view>
      <qiun-data-charts type="column" :opts="optsAll" :ontouch='true' :chartData="teacherData"
        @getIndex="clickTeacher" />
    </view>

    <!-- isHeadTeacher / isGuardian -->
    <view class="headTeacher" v-else-if="(memberStore.userInfo.isHeadTeacher || memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent) && !memberStore.userInfo.isHeadMaster && !memberStore.userInfo.isGradeDirector">
      <qiun-data-charts type="column" :opts="optsAll" :ontouch='true' :chartData="headTeacherData"
        @getIndex="clickHeadTeacher" />
    </view>

    <view class="tableBox" v-show="tableFlag">
      <view class="title">
        {{ classText }}&nbsp;{{ course }}
        <view class="btnOff" @tap="tableFlag = !tableFlag">x</view>
      </view>
      <view class="th">
        <view class="td" style="width: 20%;">姓名</view>
        <view class="td" style="width: 20%;">点到次数</view>
        <view class="td" style="width: 15%;">正确</view>
        <view class="td" style="width: 15%;">错误</view>
        <view class="td" style="width: 15%;">缺勤</view>
        <view class="td" style="width: 15%;">正确率</view>
      </view>
      <scroll-view scroll-y=true class="tableBody">
        <view class="tr" v-for="(item, index) in tableDataShow" :key='index'>
          <view class="td" style="width: 20%;">{{ item.studentName }}</view>
          <view class="td" style="width: 20%;">{{ item._count }}</view>
          <view class="td" style="width: 15%;">{{ item.correctCount }}</view>
          <view class="td" style="width: 15%;">{{ item.incorrectCount }}</view>
          <view class="td" style="width: 15%;">{{ item.absentCount }}</view>
          <view class="td" style="width: 15%;">{{ item.accuracy }}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';

  import { ref } from 'vue';

  import { useMemberStore } from
  // #ifndef H5
    '../../stores/modules/member.js';
  // #endif

  // #ifdef H5
  '../../stores/modules/memberH5.js';
  // #endif

  import {
    getDeptName,
    getTeacherCourse,
    getDeptParentId,
    getSchoolDeptDetail,
  } from '../../utils/http/inquireDing';

  import {
    teacherScore,
    teacherCorrectScore,
    headTeacherScore,
    headTeacherCorrectScore,
    gradeAll,
    headMasterScore,
    headMasterCorrectScore,
    getGradeAllDeptType,
  } from '../../utils/http/inquire';

  import {
    getAuthCode,
    getToken,
    getUserId,
    getUserInfo,
  } from '../../utils/http/config';
  
  import * as dd from 'dingtalk-jsapi';

  const memberStore = useMemberStore();

  // getChartData argument
  let headMasterGradeId = ref('');
  let headMasterCourseId = ref();
  // headTeacherClassId + guardianClassId
  let headTeacherClassId = ref('');
  let teacherCourseId = ref(memberStore.userInfo.teacherSubjectList[0]?.deptid);

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

  let gradeAllDefaultId = ref();
  const gradeAllData = ref([]);

  // headMaster: choose grade
  const classAllChange = async (e) => {
    const deptType = getGradeAllDeptType(gradeAllData.value, e.detail.value[e.detail.value.length - 1].value);
    if (deptType === 'grade') {
      classText.value = '';
      e.detail.value.forEach(item => {
        classText.value = classText.value + item.text + ' ';
      })

      headMasterGradeId.value = e.detail.value[2].value;

      await getChartData();
    }
  }

  const classRange = ref([]);
  let classText = ref('');
  
  // teacher: choose class
  const classChange = async (e) => {
    classText.value = classRange.value[e.detail.value].className;

    headTeacherClassId.value = classRange.value[e.detail.value].classId;

    await getChartData();
  };

  // headMaster: choose course
  let courseList = ref([]);
  let course = ref('');

  const courseChange = async (e) => {
    headMasterCourseId.value = courseList.value[e.detail.value].deptid;

    course.value = courseList.value[e.detail.value].name;
    await getChartData();
  };

  const tableData = ref([]);
  const tableDataShow = ref([]);
  let tableFlag = ref(false);

  const clickHeadTeacher = (e) => {
    if (e.currentIndex.index !== -1) {
      if (memberStore.userInfo.isHeadTeacher) {
        tableFlag.value = true;
        course.value = e.opts.categories[e.currentIndex.index];
    
        tableDataShow.value = tableData.value.filter(item => item.courseName === e.opts.categories[e.currentIndex.index]);
      }
    }
  };

  const clickTeacher = (e) => {
    if (e.currentIndex.index !== -1) {
      tableFlag.value = true;
      classText.value = e.opts.categories[e.currentIndex.index];
      tableDataShow.value = tableData.value.filter(item => e.opts.categories[e.currentIndex.index] === item.className);
    }
  };

  const headTeacherData = ref({});
  const teacherData = ref({});
  const optsAll = {
    color: ["#C3E7FE", "#4080FF"],
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
      data: [
        {
          tofix: 1,
        }
      ]
    },
    extra: {
      column: {
        type: "meter",
        width: 30,
        activeBgColor: "#000000",
        activeBgOpacity: 0.08,
        meterBorder: 0,
        meterFillColor: "#C3E7FE",
        labelPosition: "outside"
      }
    }
  };

  const getChartData = async () => {
    if (memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector) {
      await headMasterScore(headMasterGradeId.value, headMasterCourseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
      await headMasterCorrectScore(headMasterGradeId.value, headMasterCourseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData);
    } else if ((memberStore.userInfo.isHeadTeacher || ((memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent) && !memberStore.userInfo.isTeacher)) && !memberStore.userInfo.isHeadMaster && !memberStore.userInfo.isGradeDirector) {
      await headTeacherScore(headTeacherClassId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
      await headTeacherCorrectScore(headTeacherClassId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, headTeacherData);
    } else {
      await teacherScore(memberStore.userInfo.userid, teacherCourseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
      await teacherCorrectScore(memberStore.userInfo.userid, teacherCourseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData);
    }
    // if (memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector) {
    //   await headMasterScore(headMasterGradeId.value, headMasterCourseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
    //   await headMasterCorrectScore(headMasterGradeId.value, headMasterCourseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData);
    // } else if (memberStore.userInfo.isHeadTeacher || memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent) {
    //   await headTeacherScore(headTeacherClassId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
    //   await headTeacherCorrectScore(headTeacherClassId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, headTeacherData);
    // } else {
    //   await teacherScore(memberStore.userInfo.userid, teacherCourseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
    //   await teacherCorrectScore(memberStore.userInfo.userid, teacherCourseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData);
    // }
  }

  const getChartDataArgument = () => {
    if (memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector) {
      headMasterGradeId.value = gradeAllDefaultId.value;
      headMasterCourseId.value = memberStore.userInfo.allCourse[0]?.deptid;
    } else if (memberStore.userInfo.isHeadTeacher || memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent) {
      headTeacherClassId.value = classRange.value[0] ? classRange.value[0].classId : '';
    } else {
      teacherCourseId.value = memberStore.userInfo.teacherSubjectList[0]?.deptid;
    }
  };

  // h5
  uni.setNavigationBarTitle({
    title: '',
  });

  // h5
  onShow(() => {
    dd.setNavigationTitle({
      title: '智慧课堂互动信息',
    });
  });

  onLoad(async () => {
    await getAuthCode();
    await getToken();
    await getUserId();
    await getUserInfo();
    await getDeptName();
    await getTeacherCourse();

    courseList.value = memberStore.userInfo.allCourse;
    course.value = memberStore.userInfo.teacherSubjectList[0] ? memberStore.userInfo.teacherSubjectList[0].name : '';

    await getDeptParentId();
    await getSchoolDeptDetail();

    if (memberStore.userInfo.isHeadTeacher && memberStore.userInfo.isGuardian) {
      classRange.value = [...memberStore.userInfo.teacherInfoList, ...memberStore.userInfo.studentInfoList];
    } else if (memberStore.userInfo.isHeadTeacher) {
      classRange.value = memberStore.userInfo.teacherInfoList;
    } else if (memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent) {
      classRange.value = memberStore.userInfo.studentInfoList;
    }

    classRange.value = classRange.value.reduce((acc, cur) => {
      if (!acc.some(item => item.classId === cur.classId)) {
        acc.push(cur);
      }
      return acc;
    }, []);

    classText.value = classRange.value[0] ? classRange.value[0].className : '';

    if (memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector) {
      await gradeAll(gradeAllData, gradeAllDefaultId, classText);
    }

    getChartDataArgument();
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

    .headTeacher {
      margin: 40rpx auto;
      width: 680rpx;
    }

    .teacher {
      margin: 40rpx auto;
      width: 680rpx;

      .title {
        text-align: center;
      }
    }

    .tableBox {
      font-size: 10px;
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
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
        font-size: 30rpx;
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
          // width: 33%;
          border: 1rpx solid #ccc;
          padding: 10rpx;
        }
      }

      .tableBody {
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
          // width: 33%;
          border: 1rpx solid #ccc;
          padding: 10rpx;
        }
      }
    }
  }
</style>