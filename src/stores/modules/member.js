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
		const userInfo = ref()

		// 保存用户信息，登录时使用
		const setProfile = () => {
			userInfo.value = val
		}

		// 清理用户信息，退出时使用
		const clearProfile = () => {
			userInfo.value = undefined
		}

		// 记得 return
		return {
			userInfo,
			setProfile,
			clearProfile,
		}
	},
	// TODO: 持久化
	{
		// 网页端配置
		// persist: true,
		// 小程序端配置
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