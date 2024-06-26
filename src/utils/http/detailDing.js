import {
  deptDetailAPI,
  userRelationListAPI,
  schoolUserInfoAPI,
  schoolDeptDetailAPI,
} from '../request/config.js';

import { roleList } from '../config.js';

import { useMemberStore } from '../../stores/modules/member.js';

const memberStore = useMemberStore();

// Replace the ID in deptList with a name, Identify positions by name
export const getDeptName = async () => {
  if (memberStore.Limiting) return;

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
        memberStore.userInfo.deptIdGuardianList.push(item);
      }

      if (res.data.result.name === '学生') {
        memberStore.userInfo.studentInfoList.push({
          name: memberStore.userInfo.name,
          userId: memberStore.userInfo.userid,
          isTeacher: false,
        });

        deptDetailAPI(item).then(res => {
          memberStore.userInfo.studentInfoList[0].classId = res.data.result.parent_id;

          schoolDeptDetailAPI(res.data.result.parent_id).then(res => {
            memberStore.userInfo.studentInfoList[0].className = res.data.result.detail.nick ? res.data.result.detail.nick : res.data.result.detail.name;
          });
        });
      }

      if (res.data.result.name === '老师') {
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

// Get the ID of the class where the teacher/parent is located
export const getDeptParentId = async () => {
  if (memberStore.Limiting) return;

  memberStore.userInfo.deptIdGuardianParentList = [];

  const promiseAllGuardian = memberStore.userInfo.deptIdGuardianList.map(item => {
    return deptDetailAPI(item).then(res => {
      // Get the class of the parent
      memberStore.userInfo.deptIdGuardianParentList.push(res.data.result.parent_id);
    });
  });

  memberStore.userInfo.teacherInfoList = [];
  const promiseAllTeacher = memberStore.userInfo.deptIdTeacherList.map(item => {
    return deptDetailAPI(item).then(res => {
      // Get the class the teacher is in
      memberStore.userInfo.teacherInfoList.push({
        classId: res.data.result.parent_id,
        isTeacher: true,
      });
    });
  });

  await Promise.all([ ...promiseAllGuardian, ...promiseAllTeacher ]);
};

// Get information about your own children in the class
export const getUserRelationList = async () => {
  if (memberStore.Limiting) return;

  if (memberStore.userInfo.isStudent) return;

  const promiseAll = memberStore.userInfo.deptIdGuardianParentList.map(item => {
    return userRelationListAPI(memberStore.userInfo.userid, item).then(res => {
      res.data.result.relations.forEach(itemId => {
        memberStore.userInfo.studentInfoList.push({
          userId: itemId.to_userid,
          relation_name: itemId.relation_name,
          classId: itemId.class_id,
          isTeacher: false,
        });
      });
    });
  });

  await Promise.all(promiseAll);
};

export const getStuInfo = async () => {
  if (memberStore.Limiting) return;

  if (memberStore.userInfo.isStudent) return;

  const userNameList = memberStore.userInfo.studentInfoList.map(item => {
    return schoolUserInfoAPI(item.classId, item.userId, 'student').then(res => {
      item.name = res.data.result.details[0].name;
    });
  });

  const classNameList = memberStore.userInfo.studentInfoList.map(item => {
    return schoolDeptDetailAPI(item.classId).then(res => {
      item.className = res.data.result.detail.nick ? res.data.result.detail.nick : res.data.result.detail.name;
    });
  });

  await Promise.all([ ...userNameList, ...classNameList ]);
};
