import {
  deptDetailAPI,
  userRelationListAPI,
  schoolUserInfoAPI,
  schoolDeptDetailAPI,
} from '../request/config.js';

import { roleList } from '../config.js';

import { useMemberStore } from '../../stores/modules/member.js';

const memberStore = useMemberStore();

// Get the id details in the dept_id_list list and get the department name
export const getDeptName = async () => {
  if (memberStore.Limiting) return;

  // Set all roles to default false
  for (const item of roleList) {
    memberStore.userInfo[item.role] = false;
  }

  // Student Information List
  memberStore.userInfo.studentInfoList = [];
  // Guardian Department ID List
  memberStore.userInfo.deptIdGuardianList = [];
  // Teacher Department ID List
  memberStore.userInfo.deptIdTeacherList = [];
  const deptNameList = [];

  const promiseAll = memberStore.userInfo.deptIdList.map(item => {
    return deptDetailAPI(item).then(res => {
      /*
      deptIdList: [ 933446584, 933984252, 928463453 ]
      933446584: 物理
      933984252: 老师
      928463453: 家长
      */
      deptNameList.push(res.data.result.name);

      if (res.data.result.name === '家长') {
        // memberStore.userInfo.deptIdGuardianList: [ 928463453 ]
        memberStore.userInfo.deptIdGuardianList.push(item);
      }

      if (res.data.result.name === '学生') {
        // Add your ID and name to the student list
        memberStore.userInfo.studentInfoList.push({
          name: memberStore.userInfo.name,
          userId: memberStore.userInfo.userid,
          isTeacher: false,
        });

        // Get department details
        deptDetailAPI(item).then(res => {
          // Get the parent_id (class id) of the student department
          memberStore.userInfo.studentInfoList[0].classId = res.data.result.parent_id;

          // Get the class name based on the class ID, Prioritize using class name
          schoolDeptDetailAPI(res.data.result.parent_id).then(res => {
            memberStore.userInfo.studentInfoList[0].className = res.data.result.detail.nick ? res.data.result.detail.nick : res.data.result.detail.name;
          });
        });
      }

      if (res.data.result.name === '老师') {
        // memberStore.userInfo.deptIdTeacherList: [ 933984252 ]
        memberStore.userInfo.deptIdTeacherList.push(item);
      }

      // Determine the role based on the department name
      for (const item of roleList) {
        if (res.data.result.name.includes(item.name)) {
          memberStore.userInfo[item.role] = true;
        }
      }
    });
  });

  await Promise.all(promiseAll);

  // deptNameList: ['老师', '家长', '物理']
  memberStore.userInfo.deptNameList = deptNameList;
};

// Get the ID of the class where the teacher/parent is located
export const getDeptParentId = async () => {
  if (memberStore.Limiting) return;

  // List of guardian's classes
  memberStore.userInfo.deptIdGuardianParentList = [];

  const promiseAllGuardian = memberStore.userInfo.deptIdGuardianList.map(item => {
    /*
    According to the id of the 家长 department, get the id of its parent department (class)
    一年级1班：家长部门
              老师部门 
              学生部门
    一年级2班：家长部门
              老师部门 
              学生部门
    */
    return deptDetailAPI(item).then(res => {
      // Get the classId
      memberStore.userInfo.deptIdGuardianParentList.push(res.data.result.parent_id);
    });
  });

  // Teacher's Class List
  memberStore.userInfo.teacherInfoList = [];
  const promiseAllTeacher = memberStore.userInfo.deptIdTeacherList.map(item => {
    /*
    According to the id of the 老师 department, get the id of its parent department (class)
    一年级1班：家长部门
              老师部门 
              学生部门
    一年级2班：家长部门
              老师部门 
              学生部门
    */
    return deptDetailAPI(item).then(res => {
      // Get the classId
      // memberStore.userInfo.teacherInfoList: [{ classId: 933745979, isTeacher: true }]
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
    // List of students associated with this account
    return userRelationListAPI(memberStore.userInfo.userid, item).then(res => {
      /* 
      res.data.result.relations: [
        {
          "from_userid":"02292951094426199275", // User ID for this account
          "to_userid":"3000000001078241163", // Student ID for this account
          "class_id":928674145,
          "relation_name":"爸爸",
          "relation_code":"F"
        }
      ]
      */
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

  // Get student name based on student id
  const userNameList = memberStore.userInfo.studentInfoList.map(item => {
    return schoolUserInfoAPI(item.classId, item.userId, 'student').then(res => {
      item.name = res.data.result.details[0].name;
    });
  });

  // Get class name based on class id
  const classNameList = memberStore.userInfo.studentInfoList.map(item => {
    return schoolDeptDetailAPI(item.classId).then(res => {
      item.className = res.data.result.detail.nick ? res.data.result.detail.nick : res.data.result.detail.name;
    });
  });

  await Promise.all([ ...userNameList, ...classNameList ]);
};
