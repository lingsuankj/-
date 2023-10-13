<template>
	<view class="body">
		<image class="bannerImg" src="../../static/images/e550b088ea89cdd2854d9b45878f7c0.png" mode="aspectFill">
		</image>
		<view class="dateRangeBox">
			<uni-datetime-picker v-model="dateRange" type="daterange" :clear-icon="false" @change="dateRangeChange" />
		</view>
		<view class="classBox">
			<uni-data-picker placeholder="请选择班级" :clear-icon="false" :localdata="classesDataTree" v-model="classes"
				@change="onChangeClass">
			</uni-data-picker>
		</view>
		<view class="tips">点击图表查看详情</view>
		<!-- 图表-班主任 -->
		<view class="authorityHigh">
			<qiun-data-charts type="area" :opts="optsAll" :chartData="authorityHighData"
				@getIndex="openTableAuthorityHigh" />
		</view>
		<!-- 图表-任课老师 -->
		<view class="authorityLow">
			<view class="title">语文</view>
			<qiun-data-charts type="area" :opts="optsAll" :chartData="authorityLowData"
				@getIndex="openTableAuthorityLow" />
		</view>

		<!-- 表格 -->
		<view class="tableBox" v-show="tableFlag">
			<view class="title">
				23-1班 语文
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
				<view class="tr">
					<view class="td">小帅1</view>
					<view class="td">20</view>
					<view class="td">18</view>
					<view class="td">90%</view>
				</view>
				<view class="tr">
					<view class="td">张三2</view>
					<view class="td">20</view>
					<view class="td">16</view>
					<view class="td">80%</view>
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

	const currentDate = new Date();
	const startDay = 1
	currentDate.setDate(startDay);
	const startDate = currentDate.toISOString().split('T')[0];
	const endDate = new Date().toISOString().split('T')[0];
	const dateRange = ref([startDate, endDate])

	// 日期点击事件
	const dateRangeChange = (e) => {
		console.log('dateRangeChange事件:', e);
	}

	// 选择班级
	let classes = ref('1-2')
	const classesDataTree = [{
			text: "一年级",
			value: "1-0",
			children: [{
					text: "1.1班",
					value: "1-1"
				},
				{
					text: "1.2班",
					value: "1-2"
				}
			]
		},
		{
			text: "二年级",
			value: "2-0",
			children: [{
					text: "2.1班",
					value: "2-1"
				},
				{
					text: "2.2班",
					value: "2-2"
				}
			]
		},
		{
			text: "三年级",
			value: "3-0",
			disable: true
		}
	]
	// 选择班级后触发
	const onChangeClass = (e) => {
		console.log('选择完成触发！', e);
	}

	// 表格开启状态
	let tableFlag = ref(false)
	// 打开表格（班主任）
	const openTableAuthorityHigh = (e) => {
		tableFlag.value = true
		console.log(e, e.opts.categories[e.currentIndex.index]);
	}
	// 打开表格-（任课老师）
	const openTableAuthorityLow = (e) => {
		tableFlag.value = true
		// console.log(e, e.opts.categories[e.currentIndex.index]);
	}

	const authorityHighData = ref({})
	const authorityLowData = ref({})
	const optsAll = {
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
		padding: [15, 15, 0, 15],
		enableScroll: false,
		legend: {},
		xAxis: {
			disableGrid: true
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

	const getAuthorityHighData = () => {
		//模拟从服务器获取数据时的延时
		setTimeout(() => {
			//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			let res = {
				categories: ["语文", "数学", "英语", "物理", "化学", "生物"],
				series: [{
						name: "提问数量",
						data: [70, 85, 65, 47, 64, 40]
					},
					{
						name: "正确数量",
						data: [55, 67, 55, 30, 54, 38]
					}
				]
			};
			authorityHighData.value = JSON.parse(JSON.stringify(res));
		}, 500);
	}

	const getAuthorityLowData = () => {
		//模拟从服务器获取数据时的延时
		setTimeout(() => {
			//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			let res = {
				categories: ["23-1班", "23-2班", "23-3班", "23-4班"],
				series: [{
						name: "提问数量",
						data: [70, 85, 65, 47]
					},
					{
						name: "正确数量",
						data: [55, 67, 55, 30]
					}
				]
			};
			authorityLowData.value = JSON.parse(JSON.stringify(res));
		}, 500);
	}

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

		.dateRangeBox {
			margin: 0 auto 20rpx;
			width: 680rpx;

			// 解决日期选择器大小不适配 H5 端的问题
			/* #ifdef H5 */
			.uni-calendar:nth-of-type(2) {
				display: none !important;
			}

			/* #endif */
		}

		.classBox {
			margin: 0 auto 20rpx;
			width: 680rpx;

			/* #ifdef MP-ALIPAY */
			.selected-area {
				flex: none;
			}

			/* #endif */
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
			top: 15%;
			left: 50%;
			transform: translateX(-50%);
			width: 680rpx;
			height: 800rpx;
			background-color: #fff;
			border-radius: 15rpx;
			box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .15);
			background-image: linear-gradient(to right bottom, #ebebeb, #ffffff);

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
				height: 600rpx;
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