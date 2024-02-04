/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    let authCode = ref('');
    let userId = ref('');
    const token = ref({});
    const userInfo = ref({});

    return {
      token,
      userInfo,
    };
  },
  // 持久化: Web
  {
    persist: true,
  }
);
