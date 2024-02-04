import {
  tokenAPI,
  userIdAPI,
  userInfoAPI,
  deptDetailAPI,
  userRelationListAPI,
  schoolUserInfoAPI,
  schoolDeptDetailAPI,
  deptListAPI,
} from '../request/my.js';

import { appClient } from '../globals.js';

// #ifndef H5
import { useMemberStore } from '../../stores/modules/member.js';
// #endif

// #ifdef H5
import { useMemberStore } from '../../stores/modules/memberH5.js';
// #endif

import * as dd from 'dingtalk-jsapi';

const memberStore = useMemberStore();

export const getAuthCode = async () => {
  const res = await new Promise((resolve, reject) => {
    // #ifndef H5
    dd.getAuthCode({
      corpId: appClient.corpId,
      success: function(res) {
        memberStore.authCode = res.authCode;
        resolve(res.authCode);
      },
      fail: function(err) {
        uni.showToast({
          icon: 'none',
          title: '自动登陆失败',
        })
        reject(err);
      }
    });
    // #endif

    // #ifdef H5
    dd.runtime.permission.requestAuthCode({
      corpId: appClient.corpId,
      onSuccess: function(res) {
        // code: 'hYLK98jkf0m';
        memberStore.authCode = res.code;
        resolve(res.code);
      },
      onFail: function(err) {
        uni.showToast({
          icon: 'none',
          title: '自动登陆失败',
        })
        reject(err);
      },
    });
    // #endif
  })
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
  memberStore.userInfo = {
    name: res.data.result.name,
    avatar: res.data.result.avatar,
    unionid: res.data.result.unionid,
    userid: res.data.result.userid,
    deptIdList: res.data.result.dept_id_list,
    roleList: res.data.result.role_list,
  }
  // console.log(res.data.result);
};

export const getDeptName = async () => {
  memberStore.userInfo.isStudent = false;
  memberStore.userInfo.isGuardian = false;
  memberStore.userInfo.isTeacher = false;
  memberStore.userInfo.isHeadTeacher = false;
  memberStore.userInfo.isHeadMaster = false;
  memberStore.userInfo.studentInfoList = [];
  memberStore.userInfo.deptIdGuardianList = [];
  memberStore.userInfo.deptIdTeacherList = [];
  const deptNameList = [];

  const promiseAll = memberStore.userInfo.deptIdList.map(item => {
    return deptDetailAPI(item).then(res => {
      deptNameList.push(res.data.result.name);
      // 如果是家长，获取该部门的父级部门（班级部门 ID）
      // 通过班级部门 ID，获取孩子的 userid/name
      if (res.data.result.name === '家长') {
        memberStore.userInfo.isGuardian = true;
        memberStore.userInfo.deptIdGuardianList.push(item);
      }
      if (res.data.result.name === '学生') {
        memberStore.userInfo.isStudent = true;
        memberStore.userInfo.studentInfoList.push({
          name: memberStore.userInfo.name,
          userId: memberStore.userInfo.userid,
          relation_name: '本人',
          calssStudentId: item,
        });
      }
      if (res.data.result.name === '老师') {
        memberStore.userInfo.isTeacher = true;
        memberStore.userInfo.deptIdTeacherList.push(item);
      }
      if (res.data.result.name.includes('班主任')) {
        memberStore.userInfo.isHeadTeacher = true;
      }
      if (res.data.result.name.includes('校长')) {
        memberStore.userInfo.isHeadMaster = true;
      }
    })
  });
  // console.log(`-------------------promiseAll.length: ${promiseAll.length}`);
  await Promise.all(promiseAll);
  memberStore.userInfo.deptNameList = deptNameList;
};

// teacherSubject + allSubject
export const getTeacherSubject = async () => {
  return new Promise(async resolve => {
    let res = await deptListAPI();
    let next = res.data.result.filter(item => item.name === '全体教师')[0].dept_id;
    res = await deptListAPI(next);
    next = res.data.result.filter(item => item.name === '各学科教师')[0].dept_id;
    res = await deptListAPI(next);
    const subjectList = res.data.result.map(item => item.name);

    memberStore.userInfo.teacherSubjectList = [];

    subjectList.forEach(item => {
      if (memberStore.userInfo.deptNameList.includes(item)) {
        memberStore.userInfo.teacherSubjectList.push(item);
      }
    });

    resolve();
  });
};

// allCourse
export const courseAll = async () => {
  return new Promise(async resolve => {
    let res = await deptListAPI();
    let next = res.data.result.filter(item => item.name === '全体教师')[0].dept_id;
    res = await deptListAPI(next);
    next = res.data.result.filter(item => item.name === '各学科教师')[0].dept_id;
    res = await deptListAPI(next);
    const subjectList = res.data.result.map(item => item.name);

    memberStore.userInfo.allCourse = subjectList;
    resolve();
  });
};

export const getDeptParentId = async () => {
  memberStore.userInfo.deptIdGuardianParentList = [];
  const promiseAllGuardian = memberStore.userInfo.deptIdGuardianList.map(item => {
    return deptDetailAPI(item).then(res => {
      memberStore.userInfo.deptIdGuardianParentList.push(res.data.result.parent_id);
    });
  });
  memberStore.userInfo.teacherInfoList = [];
  const promiseAllTeacher = memberStore.userInfo.deptIdTeacherList.map(item => {
    return deptDetailAPI(item).then(res => {
      memberStore.userInfo.teacherInfoList.push({
        classId: res.data.result.parent_id,
      });
    });
  });
  await Promise.all(promiseAllGuardian.concat(promiseAllTeacher));
};

// 获取学生：userid 监护人关系 calssid
export const getUserRelationList = async () => {
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

  // 向 studentInfoList 中添加 classId + className
  if (memberStore.userInfo.studentInfoList.filter(item => item.relation_name === '本人').length) {
    let res = await deptDetailAPI(memberStore.userInfo.studentInfoList[0].calssStudentId);
    const classId = res.data.result.parent_id;
    memberStore.userInfo.studentInfoList[0].classId = classId;
    res = await deptDetailAPI(classId);
    memberStore.userInfo.studentInfoList[0].className = res.data.result.name;
  }
};

// 获取学生：名字/学号/班级 userid
export const getStuInfo = async () => {
  if (memberStore.userInfo.studentInfoList.filter(item => item.relation_name === '本人').length) return;

  const promiseAll = memberStore.userInfo.studentInfoList.map(item => {
    // 获取用户详情
    return schoolUserInfoAPI(item.classId, item.userId, 'student').then(res => {
      item.name = res.data.result.details[0].name;
      item.student_no = JSON.parse(res.data.result.details[0].feature).student_no || '';
      item.classId = res.data.result.details[0].class_id;
    });
  });
  await Promise.all(promiseAll);
};

// 家校通讯录 获取班级名称
export const getSchoolDeptDetail = async () => {
  memberStore.userInfo.studentInfoList.forEach(item => {
    schoolDeptDetailAPI(item.classId).then(res => {
      item.className = res.data.result.detail.name;
      item.classDetail = res.data.result.detail;
    });
  });
  memberStore.userInfo.teacherInfoList.forEach(item => {
    schoolDeptDetailAPI(item.classId).then(res => {
      item.className = res.data.result.detail.name;
      item.classDetail = res.data.result.detail;
    });
  });
  memberStore.userInfo.teacherInfoList.sort((a, b) => a.classId - b.classId);
};

export const getDeptStr = () => {
  let deptNameStr = '';
  if (memberStore.userInfo.deptNameList.includes('学生')) {
    deptNameStr = '学生';
  } else if (memberStore.userInfo.deptNameList.includes('老师') && memberStore.userInfo.deptNameList.includes(
      '家长')) {
    deptNameStr = '老师 - 家长';
  } else if (memberStore.userInfo.deptNameList.includes('家长')) {
    deptNameStr = '家长';
  } else {
    deptNameStr = '老师';
  }
  memberStore.userInfo.deptNameStr = deptNameStr;
};

export const getNameStr = () => {
  let nameStr = '';
  if (memberStore.userInfo.isGuardian) {
    memberStore.userInfo.nameStr = memberStore.userInfo.studentInfoList[0].name + memberStore.userInfo
      .studentInfoList[0].relation_name;
  } else {
    memberStore.userInfo.nameStr = memberStore.userInfo.name;
  }
};
