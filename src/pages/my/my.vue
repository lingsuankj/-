<template>
	<view class="body clearfix">
		<view class="userInfo clearfix">
			<view class="userInfoTop">
				<image v-if="memberStore.userInfo.avatar" class="userPic" mode="aspectFill"
					:src="memberStore.userInfo.avatar"></image>
				<div v-else class="defaultAvatar">{{memberStore.userInfo.default_avatar_text}}</div>
				<view class="nameBox">{{memberStore.userInfo.nameStr}}</view>
			</view>
			<view class="userInfoBottom">
				<view class="stuNum" v-if="memberStore.userInfo.studentInfoList[0]">
					班级：{{memberStore.userInfo.studentInfoList[0].className}}</view>
				<view class="position" v-if="memberStore.userInfo.deptNameStr">
					职位：{{memberStore.userInfo.deptNameStr}}
				</view>
			</view>
		</view>
		<view class="tools">
			<!--  v-if="memberStore.userInfo.studentInfoList.length > 0" -->
			<view class="tool" @tap="toDetails">
				<view class="imgBox">
					<image mode="aspectFill" src="../../static/images/grade.png"></image>
				</view>
				<view>我的成绩</view>
			</view>
			<view class="tool" @tap="toInquire">
				<view class="imgBox">
					<image mode="aspectFill" src="../../static/images/grade.png"></image>
				</view>
				<view>全部成绩</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		ref,
	} from 'vue'
	import {
		loginAPI,
		tokenAPI,
		userIdAPI,
		userInfoAPI,
		deptDetailAPI,
		userRelationListAPI,
		schoolUserInfoAPI,
		schoolDeptDetailAPI
	} from '@/utils/requests/my.js'
	import {
		useMemberStore
	} from '../../stores/modules/member.js'

	const memberStore = useMemberStore()

	const toDetails = () => {
		uni.navigateTo({
			url: `/pages/details/details`
		})
	}
	const toInquire = () => {
		uni.navigateTo({
			url: `/pages/inquire/inquire`
		})
	}

	//  mock 获取用户信息接口
	const getUserData = async () => {
		const res = await loginAPI('hYLK98jkf0m')
		userInfo.value = res
		memberStore.userInfo = res
		// memberStore.token = {
		// 	accessToken: res.accessToken,
		// 	expireIn: +new Date() + 2 * 60 * 60 * 1000
		// }
	}

	const getAuthCode = async () => {
		const res = await new Promise((resolve, reject) => {
			dd.getAuthCode({
				success: function(res) {
					resolve(res)
				},
				fail: function(err) {
					uni.showToast({
						icon: 'none',
						title: '自动登陆失败'
					})
					reject(err)
				}
			})
		})
		memberStore.authCode = res.authCode
	}

	const getToken = async () => {
		const res = await tokenAPI()
		memberStore.token = {
			accessToken: res.data.accessToken,
			expireIn: +new Date() + res.data.expireIn * 1000
		}
	}

	const getUserId = async () => {
		const res = await userIdAPI()
		memberStore.userId = res.data.result.userid
	}

	const getUserInfo = async () => {
		const res = await userInfoAPI()
		memberStore.userInfo = {
			name: res.data.result.name,
			avatar: res.data.result.avatar,
			unionid: res.data.result.unionid,
			userid: res.data.result.userid,
			deptIdList: res.data.result.dept_id_list,
			roleList: res.data.result.role_list
		}
		console.log(res.data.result)
	}

	const getDeptName = async () => {
		memberStore.userInfo.isStudent = false
		memberStore.userInfo.isGuardian = false
		memberStore.userInfo.isTeacher = false
		memberStore.userInfo.isClassBoss = false
		memberStore.userInfo.studentInfoList = []
		memberStore.userInfo.deptIdGuardianList = []
		memberStore.userInfo.deptIdTeacherList = []
		const deptNameList = []
		const promiseAll = memberStore.userInfo.deptIdList.map(item => {
			return deptDetailAPI(item).then(res => {
				deptNameList.push(res.data.result.name)
				// 如果是家长，获取该部门的父级部门（班级部门 ID）
				// 通过班级部门 ID，获取孩子的 userid/name
				if (res.data.result.name === '家长') {
					memberStore.userInfo.isGuardian = true
					memberStore.userInfo.deptIdGuardianList.push(item)
				}
				if (res.data.result.name === '学生') {
					memberStore.userInfo.isStudent = true
					memberStore.userInfo.studentInfoList.push({
						name: memberStore.userInfo.name,
						userId: memberStore.userInfo.userid,
						relation_name: '本人',
					})
				}
				if (res.data.result.name === '老师') {
					memberStore.userInfo.isTeacher = true
					memberStore.userInfo.deptIdTeacherList.push(item)
				}
				if (res.data.result.name.includes('班主任')) {
					memberStore.userInfo.isClassBoss = true
				}
			})
		})
		await Promise.all(promiseAll)
		memberStore.userInfo.deptNameList = deptNameList
	}

	const getDeptParentId = async () => {
		memberStore.userInfo.deptIdGuardianParentList = []
		const promiseAllGuardian = memberStore.userInfo.deptIdGuardianList.map(item => {
			return deptDetailAPI(item).then(res => {
				memberStore.userInfo.deptIdGuardianParentList.push(res.data.result.parent_id)
			})
		})
		memberStore.userInfo.teacherInfoList = []
		const promiseAllTeacher = memberStore.userInfo.deptIdTeacherList.map(item => {
			return deptDetailAPI(item).then(res => {
				memberStore.userInfo.teacherInfoList.push({
					classId: res.data.result.parent_id
				})
			})
		})
		await Promise.all(promiseAllGuardian.concat(promiseAllTeacher))
	}

	// 获取学生：userid 监护人关系 calssid 
	const getUserRelationList = async () => {
		const promiseAll = memberStore.userInfo.deptIdGuardianParentList.map(item => {
			return userRelationListAPI(item).then(res => {
				res.data.result.relations.forEach(itemId => {
					memberStore.userInfo.studentInfoList.push({
						userId: itemId.to_userid,
						relation_name: itemId.relation_name,
						classId: itemId.class_id
					})
				})
			})
		})
		await Promise.all(promiseAll)
	}

	// 获取学生：名字/学号/班级 userid
	const getStuInfo = async () => {
		const promiseAll = memberStore.userInfo.studentInfoList.map(item => {
			// 获取用户详情
			return schoolUserInfoAPI(item.classId, item.userId, 'student').then(res => {
				item.name = res.data.result.details[0].name
				item.student_no = JSON.parse(res.data.result.details[0].feature).student_no || ''
				item.classId = res.data.result.details[0].class_id
			})
		})
		await Promise.all(promiseAll)
	}

	// 家校通讯录 获取班级名称
	const getSchoolDeptDetail = async () => {
		memberStore.userInfo.studentInfoList.forEach(item => {
			schoolDeptDetailAPI(item.classId).then(res => {
				item.className = res.data.result.detail.name
				item.classDetail = res.data.result.detail
			})
		})
		memberStore.userInfo.teacherInfoList.forEach(item => {
			schoolDeptDetailAPI(item.classId).then(res => {
				item.className = res.data.result.detail.name
				item.classDetail = res.data.result.detail
			})
		})
	}

	const getDeptStr = () => {
		let deptNameStr = ''
		if (memberStore.userInfo.deptNameList.includes('学生')) {
			deptNameStr = '学生'
		} else if (memberStore.userInfo.deptNameList.includes('老师') && memberStore.userInfo.deptNameList.includes(
				'家长')) {
			deptNameStr = '老师 - 家长'
		} else if (memberStore.userInfo.deptNameList.includes('家长')) {
			deptNameStr = '家长'
		} else {
			deptNameStr = '老师'
		}
		memberStore.userInfo.deptNameStr = deptNameStr
	}

	const getNameStr = () => {
		let nameStr = ''
		if (memberStore.userInfo.isGuardian) {
			memberStore.userInfo.nameStr = memberStore.userInfo.studentInfoList[0].name + memberStore.userInfo
				.studentInfoList[0].relation_name
		} else {
			memberStore.userInfo.nameStr = memberStore.userInfo.name
		}
	}

	onLoad(async () => {
		// mock
		// getUserData()

		// 自动登录
		await getAuthCode()
		await getToken()
		console.log('token-------', memberStore.token.accessToken)
		await getUserId()
		await getUserInfo()
		await getDeptName()
		getDeptStr()
		await getDeptParentId()
		await getUserRelationList()
		await getStuInfo()
		getNameStr()
		await getSchoolDeptDetail()
		console.log(memberStore.userInfo)
	})
</script>

<style lang="scss">
	.clearfix::before,
	.clearfix::after {
		content: "";
		display: table;
	}

	.clearfix::after {
		clear: both;
	}

	.body {
		min-height: 100vh;
		background-color: #e0efec;
		font-size: 28rpx;

		.userInfo {
			padding-left: 40rpx;
			padding-bottom: 16rpx;
			margin: 120rpx auto 40rpx;
			width: 680rpx;
			background-color: #FFFFFF;
			border-radius: 15rpx;
			box-sizing: border-box;
			box-shadow: 20rpx 20rpx 50rpx #DDDDDD77;

			.userInfoTop {
				display: flex;
				justify-content: left;
				margin: -36rpx 0 0 0;

				.userPic {
					width: 130rpx;
					height: 130rpx;
					border-radius: 25rpx;
				}

				.defaultAvatar {
					width: 130rpx;
					height: 130rpx;
					border-radius: 25rpx;
					text-align: center;
					line-height: 130rpx;
					font-size: 42rpx;
					color: #FFFFFF;
					background-color: #54BBBC;
				}

				.nameBox {
					height: 130rpx;
					margin-left: 30rpx;
					line-height: 166rpx;
					font-size: 32rpx;
					font-weight: 700;
				}
			}

			.userInfoBottom {

				.position,
				.stuNum {
					margin: 15rpx 0;
				}
			}
		}

		.tools {
			display: flex;
			justify-content: left;
			align-items: center;
			margin: 0 auto;
			padding-left: 40rpx;
			width: 680rpx;
			height: 160rpx;
			background-color: #FFF;
			border-radius: 15rpx;
			box-sizing: border-box;
			box-shadow: 20rpx 20rpx 50rpx #DDDDDD77;

			.tool {
				margin-right: 40rpx;

				.imgBox {
					margin: 0 auto 3rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 80rpx;
					height: 80rpx;
					background-color: #54BBBC;
					border-radius: 24rpx;

					image {
						width: 60%;
						height: 60%;
					}
				}
			}
		}
	}
</style>