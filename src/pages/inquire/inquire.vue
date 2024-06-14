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
      <picker mode="selector" :value="classIndex" @change="classChange" :range="classRange" range-key="className">
        <view class="classContent">
          <view class="classText">{{ classText }}</view>
          <view class="classIcon"></view>
        </view>
      </picker>
    </view>

    <!-- isHeadMaster / isGradeDirector / isTeacher-->
    <view class="courseSelector" v-if="memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector || memberStore.userInfo.isTeacher && !memberStore.userInfo.isHeadTeacher">
      <picker mode="selector" :value="courseIndex" @change="courseChange" :range="courseList" range-key="name">
        <view class="courseContent">
          <view class="courseText">{{ course }}</view>
          <view class="courseIcon"></view>
        </view>
      </picker>
    </view>

    <!-- isTeacher / isHeadMaster / isGradeDirector -->
    <view class="teacher" v-if="memberStore.userInfo.isTeacher && !memberStore.userInfo.isHeadTeacher || memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector">
      <Loading :chartData="teacherData" />
      <qiun-data-charts type="mix" :opts="optsAll" :ontouch='true' :chartData="teacherData"
        @getIndex="clickTeacher" :loadingType="0" background="#F8F8F8" />
    </view>

    <!-- isHeadTeacher / isGuardian -->
    <view class="headTeacher" v-else-if="(memberStore.userInfo.isHeadTeacher || memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent) && !memberStore.userInfo.isHeadMaster && !memberStore.userInfo.isGradeDirector">
      <Loading :chartData="headTeacherData" />
      <qiun-data-charts type="mix" :opts="optsAll" :ontouch='true' :chartData="headTeacherData"
        @getIndex="clickHeadTeacher" :loadingType="0" background="#F8F8F8" />
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

  import { useMemberStore } from '../../stores/modules/member.js';

  import {
    getCourse,
    getClassName,
    gradeAll,
  } from '../../utils/http/inquireDing';

  import {
    teacherScore,
    teacherCorrectScore,
    headTeacherScore,
    headTeacherCorrectScore,
    headMasterScore,
    headMasterCorrectScore,
    getGradeAllDeptType,
    gradeId,
  } from '../../utils/http/inquire';
  
  import Loading from '../../components/loading/index.vue';

  // #ifdef H5
  import * as dd from 'dingtalk-jsapi';
  // #endif

  const memberStore = useMemberStore();

  // getChartData argument
  let headMasterGradeId = ref('');
  // headTeacherClassId + guardianClassId
  let headTeacherClassId = ref('');

  let courseId = ref();

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
  let classIndex = ref(0);
  let showTable = ref(false);

  // teacher: choose class
  const classChange = async (e) => {
    classIndex.value = e.detail.value;
    classText.value = classRange.value[e.detail.value].className;
    showTable.value = classRange.value[e.detail.value].isTeacher;

    headTeacherClassId.value = classRange.value[e.detail.value].classId;

    await getChartData();
  };

  // headMaster: choose course
  let courseList = ref([]);
  let course = ref('');
  let courseIndex = ref(0);

  const courseChange = async (e) => {
    courseIndex.value = e.detail.value;
    courseId.value = courseList.value[e.detail.value].deptid;

    course.value = courseList.value[e.detail.value].name;
    await getChartData();
  };

  const tableData = ref([]);
  const tableDataShow = ref([]);
  let tableFlag = ref(false);

  const clickHeadTeacher = (e) => {
    if (e.currentIndex.index !== -1) {
      if (showTable.value === true) {
        if (e.currentIndex.index === (e.opts.categories.length - 1)) {
          tableDataShow.value = tableData.value.reduce((acc, cur) => {
            const index = acc.findIndex((el) => el.studentId === cur.studentId);
            if (index === -1) {
              acc.push(cur);
            } else {
              acc[index]._count += cur._count;
              acc[index].correctCount += cur.correctCount;
              acc[index].incorrectCount += cur.incorrectCount;
              acc[index].absentCount += cur.absentCount;
            }
            return acc;
          }, []);

          tableDataShow.value.forEach((el) => {
            el.accuracy = Math.round(el.correctCount / el._count * 100) + '%';
          });
        } else {
          tableDataShow.value = tableData.value.filter(item => item.courseName === e.opts.categories[e.currentIndex.index]);
        }

        if (e.opts.categories[e.currentIndex.index] !== '') {
          course.value = e.opts.categories[e.currentIndex.index];
        }

        // Sort by accuracy
        tableDataShow.value.sort((a, b) => (b.correctCount / b._count) - (a.correctCount / a._count));

        tableFlag.value = true;
      }
    }
  };

  const clickTeacher = (e) => {
    if (e.currentIndex.index !== -1) {
      if (e.currentIndex.index === (e.opts.categories.length - 1)) {
        tableDataShow.value = tableData.value;
      } else {
        tableDataShow.value = tableData.value.filter(item => e.opts.categories[e.currentIndex.index] === item.className);
      }

      classText.value = e.opts.categories[e.currentIndex.index];
      tableDataShow.value.sort((a, b) => (b.correctCount / b._count) - (a.correctCount / a._count));
      tableFlag.value = true;
    }
  };

  const headTeacherData = ref({});
  const teacherData = ref({});
  const optsAll = {
    padding: [15, 15, 0, 15],
    enableScroll: true,
    legend: {
      fontSize: 10,
    },
    xAxis: {
      disableGrid: true,
      scrollShow: true,
      itemCount: 3,
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
          type: "meter",
          width: 18,
          meterBorder: 0,
          activeBgOpacity: 0.08,
          meterFillColor: '#C3E7FE',
          activeBgColor: '#000000',
          labelPosition: 'outside',
        },
        line: {
        },
      }
    },
  };

  const getChartData = async () => {
    if (memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector) {
      await headMasterScore(headMasterGradeId.value, courseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
      await headMasterCorrectScore(headMasterGradeId.value, courseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData, optsAll);
    } else if ((memberStore.userInfo.isHeadTeacher || ((memberStore.userInfo.isGuardian || memberStore.userInfo.isStudent) && !memberStore.userInfo.isTeacher)) && !memberStore.userInfo.isHeadMaster && !memberStore.userInfo.isGradeDirector) {
      await headTeacherScore(headTeacherClassId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
      await headTeacherCorrectScore(headTeacherClassId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, headTeacherData, optsAll);
    } else {
      await teacherScore(memberStore.userInfo.userid, courseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData);
      await teacherCorrectScore(memberStore.userInfo.userid, courseId.value, sendDateRange.value[0], sendDateRange.value[1], tableData, teacherData, optsAll);
    }
  }

  // #ifdef H5
  onShow(() => {
    uni.setNavigationBarTitle({
      title: '',
    });
    dd.setNavigationTitle({
      title: '智慧课堂互动信息',
    });
  });
  // #endif

  onLoad(async () => {
    try {
      await getCourse();
      await getClassName();

      // When the role is the HeadMaster or GradeDirector, get a list of all classes
      if (memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector) {
        await gradeAll();
      }
    } catch(e) {
      if (memberStore.Limiting) memberStore.userInfo = memberStore.oldUserInfo;
    }

    if (memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector) {
      courseList.value = memberStore.userInfo.allCourse;
    } else if(memberStore.userInfo.isTeacher) {
      courseList.value = memberStore.userInfo.teacherSubjectList;
    }

    course.value = courseList.value[0] ? courseList.value[0].name : '';
    courseId.value = courseList.value[0] ? courseList.value[0].deptid : '';

    // When teacher and guardian class information is repeated, remove the duplicates
    classRange.value = [...memberStore.userInfo.teacherInfoList, ...memberStore.userInfo.studentInfoList];
    classRange.value = classRange.value.reduce((acc, cur) => {
      if (!acc.some(item => item.classId === cur.classId)) {
        acc.push(cur);
      }

      return acc;
    }, []);

    headTeacherClassId.value = classRange.value[0] ? classRange.value[0].classId : '';

    // Determine whether you can view table details
    if (classRange.value[0]) {
      showTable.value = classRange.value[0].isTeacher;
    }

    classText.value = classRange.value[0] ? classRange.value[0].className : '';

    // When the role is the HeadMaster or GradeDirector, get a list of all classes
    if (memberStore.userInfo.isHeadMaster || memberStore.userInfo.isGradeDirector) {
      gradeAllData.value = memberStore.userInfo.schoolTreeList;

      // Get the ID of the first grade as the default value of the drop-down list
      const defaultGrade = gradeId(memberStore.userInfo.schoolTreeList);
      gradeAllDefaultId.value = defaultGrade.deptId;
      headMasterGradeId.value = defaultGrade.deptId;
      classText.value = defaultGrade.text;
    }

    await getChartData();
  })
</script>

<style lang="scss">
  .body {
    font-size: 28rpx;
    min-height: 100vh;
    background-color: #FFFFFF;

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

      // Solve the problem that the date picker size does not fit the H5 end
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
      .input-value .selected-item {
        margin-left: 0;
        margin-right: 0;
      }

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

    .headTeacher, .teacher {
      position: relative;
      margin: 40rpx auto;
      width: 680rpx;
      height: 500rpx;
      border-radius: 30rpx;
      box-sizing: border-box;
      overflow: hidden;
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