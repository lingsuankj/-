import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'

// 定义 Store
export const useMemberStore = defineStore(
	'member',
	() => {
		const token = ref({})
		const userInfo = ref({})

		return {
			token,
			userInfo
		}
	},
	// 持久化
	{
		persist: {
			storage: {
				getItem(key) {
					return uni.getStorageSync(key)
				},
				setItem(key, value) {
					uni.setStorageSync(key, value)
				}
			}
		}
	},
)