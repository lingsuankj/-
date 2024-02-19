import { request } from '../request.js';

import { useMemberStore } from '../../stores/modules/member.js';
import { appClient } from '../globals.js';

const memberStore = useMemberStore();

// 获取 token
export function tokenAPI() {
  return request({
    method: 'POST',
    url: '/ding/v1.0/oauth2/accessToken',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appKey: appClient.appKey,
      appSecret: appClient.appSecret,
    },
  });
}

// 获取用户 userid
export function userIdAPI() {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/user/getuserinfo?access_token=${memberStore.token.accessToken}`,
    data: {
      code: memberStore.authCode,
    },
  });
}

// 获取用户信息
export function userInfoAPI() {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/user/get?access_token=${memberStore.token.accessToken}`,
    data: {
      userid: memberStore.userId,
    },
  });
}

// 通讯录 - 获取部门详情
export function deptDetailAPI(deptId) {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/department/get?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}

// 通讯录 - 获取部门列表
export function deptListAPI(deptId = 1) {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/department/listsub?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}

// 家校通讯录 获取学生监护人详情
export function userRelationListAPI(from_userid, class_id) {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/user/relation/get?access_token=${memberStore.token.accessToken}`,
    data: {
      from_userid,
      class_id,
    },
  });
}

// 家校通讯录 - 获取人员详情
export function schoolUserInfoAPI(class_id, userid, role = 'student') {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/user/get?access_token=${memberStore.token.accessToken}`,
    data: {
      class_id,
      userid,
      role,
    },
  });
}

// 家校通讯录 - 获取部门详情
export function schoolDeptDetailAPI(deptId) {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/dept/get?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}
