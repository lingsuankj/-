import { request } from '../request.js';
import { useMemberStore } from '../../stores/modules/member.js';
import { appClient } from '../globals.js';

const memberStore = useMemberStore();

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

export function userIdAPI() {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/user/getuserinfo?access_token=${memberStore.token.accessToken}`,
    data: {
      code: memberStore.authCode,
    },
  });
}

export function userInfoAPI() {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/user/get?access_token=${memberStore.token.accessToken}`,
    data: {
      userid: memberStore.userId,
    },
  });
}

export function deptDetailAPI(deptId) {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/department/get?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}

export function deptListAPI(deptId = 1) {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/department/listsub?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}

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

export function schoolDeptDetailAPI(deptId) {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/dept/get?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}
