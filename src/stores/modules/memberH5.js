/* eslint-disable prefer-const */
import { defineStore } from 'pinia';
import { ref } from 'vue';

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
      isGradeDirector: false,
      isHeadMaster: false,
      studentInfoList: [],
      roleList: [],
    });

    return {
      authCode,
      userId,
      token,
      userInfo,
    };
  },
  {
    persist: true,
  }
);
