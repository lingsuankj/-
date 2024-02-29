/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-undef */
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    let authCode = ref('');
    let userId = ref('');
    const token = ref({});
    const userInfo = ref({
      userid: '',
      name: '',
      allCourse: [],
      deptIdList: [],
      deptNameList: [],
      deptIdGuardianList: [],
      deptIdTeacherList: [],
      deptIdGuardianParentList: [],
      teacherInfoList: [],
      teacherSubjectList: [],
      isStudent: false,
      isGuardian: false,
      isTeacher: false,
      isHeadTeacher: false,
      isHeadMaster: false,
      studentInfoList: [],
      roleList: [],
    });

    return {
      token,
      userInfo,
    };
  },
  // 持久化: app
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key);
        },
        setItem(key, value) {
          uni.setStorageSync(key, value);
        },
      },
    },
  }
);
