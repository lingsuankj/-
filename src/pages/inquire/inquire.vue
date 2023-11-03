<template>
	<view class="body">
		<image class="bannerImg" src="../../static/images/e550b088ea89cdd2854d9b45878f7c0.png" mode="aspectFill">
		</image>
		<view class="dateSelector">
			<uni-datetime-picker v-model="dateRange" type="daterange" :clear-icon="false" @change="dateRangeChange" />
		</view>
		<view class="classSelector">
			<uni-data-picker placeholder="请选择班级" :clear-icon="false" :localdata="classesDataTree" v-model="classes"
				@change="classChange">
			</uni-data-picker>
		</view>
		<view class="subjectSelector">
			<picker mode="selector" @change="subjectChange" :range="subjectList">
				<view class="subjectContent">
					<view class="subjectText">{{subject}}</view>
					<view class="subjectIcon"></view>
				</view>
			</picker>
		</view>
		<view class="tips">点击图表查看详情</view>
		<!-- 图表-班主任 -->
		<view class="authorityHigh">
			<qiun-data-charts type="area" :opts="optsAll" :ontouch='true' :chartData="authorityHighData"
				@getIndex="openTableAuthorityHigh" />
		</view>
		<!-- 图表-任课老师 -->
		<view class="authorityLow">
			<view class="title">{{subject}}</view>
			<qiun-data-charts type="area" :opts="optsAll" :ontouch='true' :chartData="authorityLowData"
				@getIndex="openTableAuthorityLow" />
		</view>

		<!-- 表格 -->
		<view class="tableBox" v-show="tableFlag">
			<view class="title">
				{{tableClass}} {{tableSubject}}
				<view class="btnOff" @tap="tableFlag = !tableFlag">x</view>
			</view>
			<!-- 表头 -->
			<view class="th">
				<view class="td">姓名</view>
				<view class="td">答题数量</view>
				<view class="td">正确数量</view>
				<view class="td">正确率</view>
			</view>
			<scroll-view scroll-y=true class="table">
				<view class="tr" v-for="(item,index) in ClassDetailData" :key='index'>
					<view class="td">{{item.name}}</view>
					<view class="td">{{item.total}}</view>
					<view class="td">{{item.correctNum}}</view>
					<view class="td">{{item.accuracy}}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app';
	import {
		ref
	} from 'vue';
	import {
		authorityHighAPI,
		authorityLowAPI,
		classAPI,
		classDetailAPI,
		subjectAPI
	} from '@/utils/requests/inquire.js'

	const tableClass = ref('')
	const tableSubject = ref('')

	// 日期
	const currentDate = new Date()
	const startDay = 1
	currentDate.setDate(startDay)
	const startDate = currentDate.toISOString().split('T')[0]
	const endDate = new Date().toISOString().split('T')[0]
	const dateRange = ref([startDate, endDate])
	// 日期点击事件
	const dateRangeChange = (e) => {
		getAuthorityHighData()
		getAuthorityLowData()
	}

	// 选择班级
	let classes = ref(11)
	const classesDataTree = ref([
		// {
		// 	text: "一年级",
		// 	value: "1-0",
		// 	children: [{
		// 			text: "1.1班",
		// 			value: "1-1"
		// 		},
		// 		{
		// 			text: "1.2班",
		// 			value: "1-2"
		// 		}
		// 	]
		// },
		// {
		// 	text: "二年级",
		// 	value: "2-0",
		// 	children: [{
		// 		text: "2.1班",
		// 		value: "2-1"
		// 	}, {
		// 		text: "2.2班",
		// 		value: "2-2"
		// 	}]
		// },
		// {
		// 	text: "三年级",
		// 	value: "3-0",
		// 	disable: true
		// }
	])
	// 选择班级后触发
	const classChange = (e) => {
		getAuthorityHighData()
		getAuthorityLowData()
		tableClass.value = ''
		e.detail.value.forEach(item => {
			tableClass.value = tableClass.value + item.text + ' '
		})
	}

	// 科目
	const subjectList = ref([])
	let subject = ref(subjectList.value[0])
	const subjectChange = (e) => {
		subject.value = subjectList.value[e.detail.value]
		tableSubject.value = subjectList.value[e.detail.value]
	}

	// 表格
	const ClassDetailData = ref([])
	// 表格开启状态
	let tableFlag = ref(false)
	// 打开表格（班主任）
	const openTableAuthorityHigh = (e) => {
		tableFlag.value = true
		tableSubject.value = e.opts.categories[e.currentIndex.index]
		// console.log(e, e.opts.categories[e.currentIndex.index])
	}
	// 打开表格-（任课老师）
	const openTableAuthorityLow = (e) => {
		tableFlag.value = true
		tableClass.value = e.opts.categories[e.currentIndex.index]
		// console.log(e, e.opts.categories[e.currentIndex.index]);
	}

	const authorityHighData = ref({})
	const authorityLowData = ref({})
	const optsAll = {
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
		padding: [15, 15, 0, 15],
		enableScroll: true,
		legend: {},
		xAxis: {
			disableGrid: true,
			scrollShow: true,
			itemCount: 4
		},
		yAxis: {
			gridType: "dash",
			dashLength: 2
		},
		extra: {
			area: {
				type: "straight",
				opacity: 0.2,
				addLine: true,
				width: 2,
				gradient: false,
				activeType: "hollow"
			}
		}
	}

	const getClassData = async () => {
		const res = await classAPI()
		// 处理 class 数据格式
		const treeFun = (treeList, parentId, newArr) => {
			for (let k of treeList) {
				if (k.parent === parentId) {
					newArr.push(k)
				}
			}
			for (let m of newArr) {
				m.children = []
				m.value = m.id
				treeFun(treeList, m.id, m.children)
				if (m.children.length === 0) {
					delete m.children
				}
			}
			return newArr
		}
		classesDataTree.value = treeFun(res.data, null, [])
	}

	const getSubjectData = async () => {
		const res = await subjectAPI()
		subjectList.value = res.data
		subject.value = subjectList.value[0]
	}

	const getAuthorityHighData = async () => {
		const res = await authorityHighAPI(classes.value, dateRange.value[0], dateRange.value[1])
		const categories = []
		const seriesTotal = []
		const seriesCorrectNum = []
		res.data.forEach(item => {
			categories.push(item.subject)
			seriesTotal.push(item.total)
			seriesCorrectNum.push(item.correctNum)
		})

		authorityHighData.value = {
			categories: categories,
			series: [{
					name: "提问数量",
					data: seriesTotal
				},
				{
					name: "正确数量",
					data: seriesCorrectNum
				}
			]
			// categories: ["语文", "数学", "英语", "物理", "化学", "生物"],
			// series: [{
			// 		name: "提问数量",
			// 		data: [70, 85, 65, 47, 64, 40]
			// 	},
			// 	{
			// 		name: "正确数量",
			// 		data: [55, 67, 55, 30, 54, 38]
			// 	}
			// ]
		}
	}

	const getAuthorityLowData = async () => {
		const res = await authorityLowAPI()
		const categories = []
		const seriesTotal = []
		const seriesCorrectNum = []
		res.data.forEach(item => {
			categories.push(item.subject)
			seriesTotal.push(item.total)
			seriesCorrectNum.push(item.correctNum)
		})
		authorityLowData.value = {
			categories: categories,
			series: [{
					name: "提问数量",
					data: seriesTotal
				},
				{
					name: "正确数量",
					data: seriesCorrectNum
				}
			]
		}
	}

	// 表格中数据
	const getClassDetailData = async () => {
		const res = await classDetailAPI(classes.value, dateRange.value[0], dateRange.value[1], subject)
		res.data.forEach(item => {
			item.accuracy = Math.round(item.correctNum / item.total * 100) + '%'
		})
		ClassDetailData.value = res.data
	}

	onLoad(() => {
		getClassData()
		getSubjectData()
		getClassDetailData()
	})
	onReady(() => {
		getAuthorityHighData()
		getAuthorityLowData()
	})
</script>

<style lang="scss">
	.body {
		font-size: 28rpx;

		.bannerImg {
			display: block;
			margin: 0 auto 30rpx;
			width: 730rpx;
			height: 350rpx;
			border-radius: 15rpx;
		}

		.dateSelector {
			margin: 0 auto 20rpx;
			width: 680rpx;

			// 解决日期选择器大小不适配 H5 端的问题
			/* #ifdef H5 */
			.uni-calendar:nth-of-type(2) {
				display: none !important;
			}

			/* #endif */
			.uni-icons {
				margin-left: 20rpx;
			}
		}

		.classSelector {
			margin: 0 auto 20rpx;
			width: 680rpx;

			/* #ifdef MP-ALIPAY */
			.selected-area {
				flex: none;
			}

			/* #endif */
			// 年级/班级 边距
			.selected-item {
				margin-left: 0;
				margin-right: 0;
			}

			// 下箭头
			.input-value {
				padding-right: 0;
			}

			.arrow-area {
				margin-right: 20rpx;
				width: 10px;
			}
		}

		.subjectSelector {
			margin: 0 auto 20rpx;
			padding-left: 20rpx;
			width: 680rpx;
			height: 35px;
			border: 1rpx solid #e5e5e5;
			border-radius: 5px;
			line-height: 35px;
			box-sizing: border-box;
			font-size: 14px;

			.subjectContent {
				display: flex;
				justify-content: space-between;

				.subjectIcon {
					margin: auto 20rpx;
					transform: rotate(-45deg);
					width: 7px;
					height: 7px;
					border-left: 1px solid #999;
					border-bottom: 1px solid #999;
				}
			}


		}

		// 提示信息 - 折线图可点
		.tips {
			text-align: center;
			font-size: 28rpx;
			color: #bfdade;
		}

		// 图表 - 班主任及以上可见
		.authorityHigh {
			margin: 40rpx auto;
			width: 680rpx;
			// height: 500rpx;
		}

		// 图表 - 任课老师可见
		.authorityLow {
			margin: 40rpx auto;
			width: 680rpx;

			.title {
				text-align: center;
			}
		}

		// 弹框 - 表格
		.tableBox {
			position: fixed;
			top: 10%;
			left: 50%;
			transform: translateX(-50%);
			// width: 680rpx;
			// height: 800rpx;
			width: 90%;
			height: 80%;
			background-color: #e0e0e0;
			border-radius: 15rpx;
			box-shadow: 20rpx 20rpx 60rpx #bebebe,
				-20rpx -20rpx 60rpx #ffffff;
			background-image: linear-gradient(to right bottom, #ebebeb, #ffffff);
			transition: all .5s;

			.title {
				position: relative;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 36rpx;
				font-weight: 800;

				.btnOff {
					position: absolute;
					top: 0rpx;
					right: 30rpx;
					font-size: 36rpx;
				}
			}

			.th {
				margin: 0 auto;
				width: 90%;
				display: flex;
				justify-content: left;
				text-align: center;
				background-color: #e4ebeb;

				.td {
					width: 25%;
					border: 1rpx solid #ccc;
					padding: 10rpx;
				}
			}

			.table {
				// position: relative;
				display: flex;
				flex-direction: column;
				width: 90%;
				height: calc(100% - 80rpx - 56rpx - 5%);
				margin: 0 auto;

				.tr {
					display: flex;
					justify-content: left;
					text-align: center;
				}

				.td {
					width: 25%;
					border: 1rpx solid #ccc;
					padding: 10rpx;
				}
			}
		}
	}
</style>