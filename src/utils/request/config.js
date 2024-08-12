import { request } from '../request.js';
import { useMemberStore } from '../../stores/modules/member.js';

const memberStore = useMemberStore();

// Get a token
export function tokenAPI() {
  return request({
    method: 'POST',
    url: '/ding/v1.0/oauth2/accessToken',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appKey: import.meta.env.VITE_APPKEY,
      appSecret: import.meta.env.VITE_APPSRCRET,
    },
  });
}

// Get user id
export function userIdAPI() {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/user/getuserinfo?access_token=${memberStore.token.accessToken}`,
    data: {
      code: memberStore.authCode,
    },
  });
}

// Get user information
export function userInfoAPI() {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/user/get?access_token=${memberStore.token.accessToken}`,
    data: {
      userid: memberStore.userId,
    },
  });
}

// Get contact department details
export function deptDetailAPI(deptId) {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/department/get?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}

// Get a list of departments
export function deptListAPI(deptId = 1) {
  return request({
    method: 'POST',
    url: `/oding/topapi/v2/department/listsub?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}

// List of students associated with this account
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

// Home-school address book, get user details
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

// Home-school contact list, get department details
export function schoolDeptDetailAPI(deptId) {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/dept/get?access_token=${memberStore.token.accessToken}`,
    data: {
      dept_id: deptId,
    },
  });
}

// Home-school contact list, get department list
export function schoolDeptListAPI(super_id = undefined) {
  return request({
    method: 'POST',
    url: `/oding/topapi/edu/dept/list?access_token=${memberStore.token.accessToken}`,
    data: {
      page_size: 30,
      page_no: 1,
      super_id,
    },
  });
}
