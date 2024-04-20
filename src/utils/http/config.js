import {
  tokenAPI,
  userIdAPI,
  userInfoAPI,
} from '../request/config.js';

import { appClient } from '../config.js';

import { useMemberStore } from
// #ifndef H5
  '../../stores/modules/member.js';
// #endif

// #ifdef H5
'../../stores/modules/memberH5.js';
// #endif

import * as dd from 'dingtalk-jsapi';

const memberStore = useMemberStore();

export const getAuthCode = async () => {
  await new Promise((resolve, reject) => {
    dd.ready(function() {
      // #ifndef H5
      dd.getAuthCode({
        corpId: appClient.corpId,
        success(res) {
          memberStore.authCode = res.authCode ? res.authCode : res.code;
          resolve(res.authCode);
        },
        fail(err) {
          uni.showToast({
            icon: 'none',
            title: '自动登陆失败',
          });
          reject(err);
        },
      });
      // #endif

      // #ifdef H5
      dd.runtime.permission.requestAuthCode({
        corpId: appClient.corpId,
        onSuccess(res) {
          memberStore.authCode = res.code;
          resolve(res.code);
        },
        onFail(err) {
          uni.showToast({
            icon: 'none',
            title: '自动登陆失败',
          });
          reject(err);
        },
      });
      // #endif
    });
  });
};

export const getToken = async () => {
  const res = await tokenAPI();
  memberStore.token = {
    accessToken: res.data.accessToken,
    expireIn: +new Date() + res.data.expireIn * 1000,
  };
};

export const getUserId = async () => {
  const res = await userIdAPI();
  memberStore.userId = res.data.result.userid;
};

export const getUserInfo = async () => {
  const res = await userInfoAPI();
  memberStore.userInfo.name = res.data.result.name;
  memberStore.userInfo.userid = res.data.result.userid;
  memberStore.userInfo.deptIdList = res.data.result.dept_id_list;
  memberStore.userInfo.roleList = res.data.result.role_list;
};
