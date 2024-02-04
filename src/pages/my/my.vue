<template>
  <view class="body clearfix">
    <view class="userInfo clearfix">
      <view class="userInfoTop">
        <image v-if="memberStore.userInfo.avatar" class="userPic" mode="aspectFill" :src="memberStore.userInfo.avatar">
        </image>
        <div v-else class="defaultAvatar">{{ memberStore.userInfo.default_avatar_text }}</div>
        <view class="nameBox">{{ memberStore.userInfo.nameStr }}</view>
      </view>
      <view class="userInfoBottom">
        <view class="stuNum" v-if="memberStore.userInfo?.studentInfoList">
          班级：{{ memberStore.userInfo?.studentInfoList[0]?.className }}</view>
        <view class="position" v-if="memberStore.userInfo.deptNameStr">
          职位：{{ memberStore.userInfo.deptNameStr }}
        </view>
      </view>
    </view>
    <view class="tools">
      <!--  v-if="memberStore.userInfo.studentInfoList.length > 0" -->
      <view class="tool" @tap="toDetails">
        <view class="imgBox">
          <image mode="aspectFill" src="../../static/images/grade.png"></image>
        </view>
        <view>我的成绩</view>
      </view>
      <view class="tool" @tap="toInquire">
        <view class="imgBox">
          <image mode="aspectFill" src="../../static/images/grade.png"></image>
        </view>
        <view>全部成绩</view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { ref } from 'vue';

  import {
    getAuthCode,
    getToken,
    getUserId,
    getUserInfo,
    getDeptName,
    getTeacherSubject,
    getDeptParentId,
    getUserRelationList,
    getStuInfo,
    getSchoolDeptDetail,
    getDeptStr,
    getNameStr,
    courseAll
  } from '../../utils/http/my.js';

  // #ifndef H5
    import { useMemberStore } from '../../stores/modules/member.js';
  // #endif

  // #ifdef H5
    import { useMemberStore } from '../../stores/modules/memberH5.js';
  // #endif

  const memberStore = useMemberStore();

  const toDetails = () => {
    uni.navigateTo({
      url: `/pages/details/details`,
    });
  };
  const toInquire = () => {
    uni.navigateTo({
      url: `/pages/inquire/inquire`,
    });
  };

  onLoad(async () => {
    await getAuthCode();
    await getToken();
    await getUserId();
    await getUserInfo();
    await getDeptName();

    // start no await
    await getTeacherSubject();
    getDeptStr();
    // end

    await getDeptParentId();
    await getUserRelationList();
    await getStuInfo();

    // start no await
    getNameStr();
    await getSchoolDeptDetail();
    // end

    await courseAll();

    console.log(memberStore.userInfo);
  });

</script>

<style lang="scss">
  .clearfix::before,
  .clearfix::after {
    content: "";
    display: table;
  }

  .clearfix::after {
    clear: both;
  }

  .body {
    min-height: 100vh;
    background-color: #e0efec;
    font-size: 28rpx;

    .userInfo {
      padding-left: 40rpx;
      padding-bottom: 16rpx;
      margin: 120rpx auto 40rpx;
      width: 680rpx;
      background-color: #FFFFFF;
      border-radius: 15rpx;
      box-sizing: border-box;
      box-shadow: 20rpx 20rpx 50rpx #DDDDDD77;

      .userInfoTop {
        display: flex;
        justify-content: left;
        margin: -36rpx 0 0 0;

        .userPic {
          width: 130rpx;
          height: 130rpx;
          border-radius: 25rpx;
        }

        .defaultAvatar {
          width: 130rpx;
          height: 130rpx;
          border-radius: 25rpx;
          text-align: center;
          line-height: 130rpx;
          font-size: 42rpx;
          color: #FFFFFF;
          background-color: #54BBBC;
        }

        .nameBox {
          height: 130rpx;
          margin-left: 30rpx;
          line-height: 166rpx;
          font-size: 32rpx;
          font-weight: 700;
        }
      }

      .userInfoBottom {

        .position,
        .stuNum {
          margin: 15rpx 0;
        }
      }
    }

    .tools {
      display: flex;
      justify-content: left;
      align-items: center;
      margin: 0 auto;
      padding-left: 40rpx;
      width: 680rpx;
      height: 160rpx;
      background-color: #FFF;
      border-radius: 15rpx;
      box-sizing: border-box;
      box-shadow: 20rpx 20rpx 50rpx #DDDDDD77;

      .tool {
        margin-right: 40rpx;

        .imgBox {
          margin: 0 auto 3rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80rpx;
          height: 80rpx;
          background-color: #54BBBC;
          border-radius: 24rpx;

          image {
            width: 60%;
            height: 60%;
          }
        }
      }
    }
  }
</style>