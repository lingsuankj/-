/* eslint-disable prefer-const */
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMemberStore = defineStore(
  'member',
  () => {
    let authCode = ref('');
    let userId = ref('');
    const token = ref({});
    let Limiting = ref(false);
    let qpsMax = ref(18);
    const oldUserInfo = ref({});
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
      isGradeDirector: false,
      isHeadMaster: false,
      studentInfoList: [],
      roleList: [],
      schoolTreeList: [],
    });

    return {
      authCode,
      userId,
      token,
      Limiting,
      qpsMax,
      oldUserInfo,
      userInfo,
    };
  },
  // #ifdef H5
  {
    persist: true,
  },
  // #endif
  // #ifndef H5
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
  // #endif
);
