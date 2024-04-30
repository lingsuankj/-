import {
  deptDetailAPI,
  userRelationListAPI,
  schoolUserInfoAPI,
  schoolDeptDetailAPI,
} from '../request/config.js';

import { roleList } from '../config.js';

import { useMemberStore } from
// #ifndef H5
  '../../stores/modules/member.js';
// #endif

// #ifdef H5
'../../stores/modules/memberH5.js';
// #endif

const memberStore = useMemberStore();

export const getDeptName = async () => {
  memberStore.userInfo.isStudent = false;
  memberStore.userInfo.isGuardian = false;
  memberStore.userInfo.isTeacher = false;
  for (const item of roleList) {
    memberStore.userInfo[item.role] = false;
  }
  memberStore.userInfo.studentInfoList = [];
  memberStore.userInfo.deptIdGuardianList = [];
  memberStore.userInfo.deptIdTeacherList = [];
  const deptNameList = [];

  const promiseAll = memberStore.userInfo.deptIdList.map(item => {
    return deptDetailAPI(item).then(res => {
      deptNameList.push(res.data.result.name);

      if (res.data.result.name === '家长') {
        memberStore.userInfo.isGuardian = true;
        memberStore.userInfo.deptIdGuardianList.push(item);
      }

      if (res.data.result.name === '学生') {
        memberStore.userInfo.isStudent = true;
        memberStore.userInfo.studentInfoList.push({
          name: memberStore.userInfo.name,
          userId: memberStore.userInfo.userid,
        });
      }

      if (res.data.result.name === '老师') {
        memberStore.userInfo.isTeacher = true;
        memberStore.userInfo.deptIdTeacherList.push(item);
      }

      for (const item of roleList) {
        if (res.data.result.name.includes(item.name)) {
          memberStore.userInfo[item.role] = true;
        }
      }
    });
  });
  await Promise.all(promiseAll);
  memberStore.userInfo.deptNameList = deptNameList;
};

export const getDeptParentId = async () => {
  memberStore.userInfo.deptIdGuardianParentList = [];
  const promiseAllGuardian = memberStore.userInfo.deptIdGuardianList.map(item => {
    return deptDetailAPI(item).then(res => {
      // 获取家长所在的班级
      memberStore.userInfo.deptIdGuardianParentList.push(res.data.result.parent_id);
    });
  });

  memberStore.userInfo.teacherInfoList = [];
  const promiseAllTeacher = memberStore.userInfo.deptIdTeacherList.map(item => {
    return deptDetailAPI(item).then(res => {
      // 获取老师所在的班级
      memberStore.userInfo.teacherInfoList.push({
        classId: res.data.result.parent_id,
      });
    });
  });

  await Promise.all(promiseAllGuardian.concat(promiseAllTeacher));
};

export const getUserRelationList = async () => {
  if (memberStore.userInfo.isStudent) return;

  const promiseAll = memberStore.userInfo.deptIdGuardianParentList.map(item => {
    return userRelationListAPI(memberStore.userInfo.userid, item).then(res => {
      res.data.result.relations.forEach(itemId => {
        memberStore.userInfo.studentInfoList.push({
          userId: itemId.to_userid,
          relation_name: itemId.relation_name,
          classId: itemId.class_id,
        });
      });
    });
  });
  await Promise.all(promiseAll);
};

export const getStuInfo = async () => {
  if (memberStore.userInfo.isStudent) return;

  const userNameList = memberStore.userInfo.studentInfoList.map(item => {
    return schoolUserInfoAPI(item.classId, item.userId, 'student').then(res => {
      item.name = res.data.result.details[0].name;
    });
  });

  const classNameList = memberStore.userInfo.studentInfoList.map(item => {
    return schoolDeptDetailAPI(item.classId).then(res => {
      item.className = res.data.result.detail.name;
    });
  });

  await Promise.all([ ...userNameList, ...classNameList ]);
};
