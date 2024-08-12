/* eslint-disable no-undef */
import {
  tokenAPI,
  userIdAPI,
  userInfoAPI,
} from '../request/config.js';

import { useMemberStore } from '../../stores/modules/member.js';

// Note: The name here cannot be dd. The dd of the micro application will overwrite the original dd of the mini program.
import * as microappdd from 'dingtalk-jsapi';

const memberStore = useMemberStore();

// Get the Mini Program Login-Free Authorization Code
export const getAuthCode = async () => {
  await new Promise((resolve, reject) => {
    // #ifndef H5
    dd.getAuthCode({
      success(res) {
        // res； { authCode: "855dcf918b9b35ba9a562c86997ecca3" }
        memberStore.authCode = res.authCode;

        resolve(res.authCode);
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '自动登录失败',
        });

        reject(err);
      },
    });
    // #endif

    // #ifdef H5
    microappdd.ready(function() {
      microappdd.runtime.permission.requestAuthCode({
        corpId: import.meta.env.VITE_CORPID,
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
    });
    // #endif
  });
};

// Get a token
export const getToken = async () => {
  const res = await tokenAPI();
  /*
  res: {
    "expireIn":7200,
    "accessToken":"b8fbc5b70c7d33798a564252963ad84e"
  }
  */
  memberStore.token = {
    accessToken: res.data.accessToken,
    expireIn: +new Date() + res.data.expireIn * 1000,
  };
};

// Get user id
export const getUserId = async () => {
  if (memberStore.Limiting) return;

  const res = await userIdAPI();
  // res.userid: "02292951094426199275"
  memberStore.userId = res.data.result.userid;
};

// Get user information
export const getUserInfo = async () => {
  if (memberStore.Limiting) return;

  const res = await userInfoAPI();
  // "dept_id_list":[ 933446584, 933984252, 928463453 ]
  memberStore.userInfo.name = res.data.result.name;
  memberStore.userInfo.userid = res.data.result.userid;
  memberStore.userInfo.deptIdList = res.data.result.dept_id_list;
  memberStore.userInfo.roleList = res.data.result.role_list;
};
