<template>
	<view class="body">
		<image class="bannerImg" src="../../static/images/cf5eb8adff344fcc0b17753d9f922e6.png" mode="aspectFill">
		</image>
		<view class="chartBox">
			<view class="chartTitle">学生答题互动频率</view>
			<view class="summarizeLine">
				<qiun-data-charts type="line" :opts="summarizeLineOpts" :chartData="summarizeLineData" />
			</view>
		</view>
		<view class="chartBox">
			<view class="chartTitle">学生答题次数</view>
			<view class="personageBox">
				<view class="personage">
					<view class="areaCharts">
						<qiun-data-charts type="area" :opts="personageAreaOpts" :chartData="personageAreaDataL" />
					</view>
					<text class="name">小明</text>
					<text class="num">10次</text>
				</view>
				<view class="personage">
					<view class="areaCharts">
						<qiun-data-charts type="area" :opts="personageAreaOpts" :chartData="personageAreaDataR" />
					</view>
					<text class="name">张三</text>
					<text class="num">8次</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'
	import {
		summarizeAPI,
		personageAPI
	} from '@/utils/requests/home.js'

	let summarizeLineData = ref({})
	let personageAreaDataL = ref({})
	let personageAreaDataR = ref({})

	const summarizeLineOpts = {
		animation: true,
		legend: {
			show: false
		}
	}
	const personageAreaOpts = {
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
		padding: [10, 15, 15, 15],
		dataLabel: false,
		dataPointShape: false,
		enableScroll: false,
		legend: {
			show: false
		},
		xAxis: {
			disabled: true,
			axisLine: false
		},
		yAxis: {
			disableGrid: true,
			disabled: true
		},
		extra: {
			area: {
				type: "curve",
				opacity: 0.2,
				addLine: true,
				width: 2,
				gradient: true,
				activeType: "hollow"
			}
		}
	}

	const getSummarizeData = async () => {
		const res = await summarizeAPI()
		// 在这里设置初始值，否则会报错
		summarizeLineData.value = {
			categories: ["1月", "2月", "3月", "4月", "5月", "6月"],
			series: [{
				name: "总数",
				data: [100, 158, 125, 137, 200, 180]
			}]
		}
		summarizeLineData.value.categories = Object.keys(res);
		summarizeLineData.value.series[0].data = Object.values(res);
	}

	const getPersonageData = async () => {
		const res = await personageAPI()
		// 在这里设置初始值，否则会报错
		personageAreaDataL.value = {
			categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
			series: [{
				name: "数据A",
				data: [25, 33, 25, 34, 28, 30]
			}]
		}
		personageAreaDataL.value.categories = Object.keys(res.all[0].data);
		personageAreaDataL.value.series[0].data = Object.values(res.all[0].data);

		personageAreaDataR.value = {
			categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
			series: [{
				name: "数据A",
				data: [25, 33, 25, 34, 28, 30]
			}]
		}
		personageAreaDataR.value.categories = Object.keys(res.all[1].data);
		personageAreaDataR.value.series[0].data = Object.values(res.all[1].data);
	}

	onReady(() => {
		getSummarizeData()
		getPersonageData()
	})
	onLoad(() => {})
</script>

<style lang="scss">
	.body {
		min-height: 100vh;
		background-color: #F7F8FA;

		.bannerImg {
			display: block;
			margin: 0 auto -100rpx;
			width: 730rpx;
			height: 350rpx;
			border-radius: 15rpx;
		}

		.chartBox {
			margin: 0 auto 40rpx;
			width: 680rpx;
			position: relative;
			z-index: 9;

			// 图表-标题
			.chartTitle {
				margin-bottom: 20rpx;
				font-size: 28rpx;
				font-weight: 700;
			}

			// 图表-父盒子
			.summarizeLine {
				padding: 15rpx 0rpx;
				height: 400rpx;
				background-color: #fff;
				border-radius: 30rpx;
			}

			// 两个图表的父盒子
			.personageBox {
				display: flex;
				justify-content: space-between;
				height: 250rpx;

				.personage {
					position: relative;
					width: 47%;
					background-color: #fff;
					border-radius: 30rpx;

					.areaCharts {
						margin-top: 50rpx;
						height: 200rpx;
					}

					.name {
						position: absolute;
						top: 25rpx;
						left: 25rpx;
						font-size: 26rpx;
						font-weight: 600;
						color: #777;
					}

					.num {
						position: absolute;
						top: 70rpx;
						left: 25rpx;
						font-size: 28rpx;
						font-weight: 900;
						color: #555;

						&::before {
							position: absolute;
							right: -30rpx;
							content: '';
							display: block;
							width: 0rpx;
							height: 0rpx;
							border-top: 8rpx solid transparent;
							border-bottom: 8rpx solid #10AEFF;
							border-left: 8rpx solid transparent;
							border-right: 8rpx solid transparent;
						}
					}
				}
			}

		}
	}
</style>