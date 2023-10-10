<template>
	<view class="body">
		<image class="bannerImg" src="../../static/cf5eb8adff344fcc0b17753d9f922e6.png" mode="aspectFill"></image>
		<view class="chartBox_AllbrokenLine">
			<view class="chartTitle">学生答题互动频率</view>
			<view class="AllbrokenLine">
				<qiun-data-charts type="line" :opts="opts_AllbrokenLine" :chartData="chartData_AllbrokenLine" />
			</view>
		</view>
		<view class="chartBox_personage">
			<view class="chartTitle">学生答题次数</view>
			<view class="personage">
				<view class="personage_child">
					<view class="area">
						<qiun-data-charts type="area" :opts="opts_personage" :chartData="chartData_personage_left" />
					</view>

					<text class="name">小明</text>
					<text class="num">10次</text>
				</view>
				<view class="personage_child">
					<view class="area">
						<qiun-data-charts type="area" :opts="opts_personage" :chartData="chartData_personage_right" />
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
		onReady
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'


	let chartData_AllbrokenLine = ref({})
	let chartData_personage_left = ref({})
	let chartData_personage_right = ref({})
	const opts_AllbrokenLine = {
		animation: true,
		legend: {
			show: false
		}
	}
	const opts_personage = {
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
	onReady(() => {
		getServerData_AllbrokenLine();
		getServerData_personage_left();
		getServerData_personage_right();
	})
	const getServerData_AllbrokenLine = () => {
		setTimeout(() => {
			//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			let res = {
				categories: ["1月", "2月", "3月", "4月", "5月", "6月"],
				series: [{
					name: "总数",
					data: [100, 158, 125, 137, 200, 180]
				}]
			}
			chartData_AllbrokenLine.value = JSON.parse(JSON.stringify(res));
		}, 500);
	}
	const getServerData_personage_left = () => {
		//模拟从服务器获取数据时的延时
		setTimeout(() => {
			//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			let resL = {
				categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
				series: [{
					name: "数据A",
					data: [25, 33, 25, 34, 28, 30]
				}]
			};
			chartData_personage_left.value = JSON.parse(JSON.stringify(resL));
		}, 500);
	}
	const getServerData_personage_right = () => {
		//模拟从服务器获取数据时的延时
		setTimeout(() => {
			//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
			let resR = {
				categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
				series: [{
					name: "数据A",
					data: [29, 33, 25, 30, 33, 30]
				}]
			};
			chartData_personage_right.value = JSON.parse(JSON.stringify(resR));
		}, 500);
	}
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

		.chartBox_AllbrokenLine {
			margin: 0 auto 40rpx;
			width: 680rpx;
			position: relative;
			z-index: 9;

			// 图表-标题
			.chartTitle {
				margin-bottom: 16rpx;
				font-size: 28rpx;
				font-weight: 700;
			}

			// 图表-父盒子
			.AllbrokenLine {
				padding: 15rpx 0rpx;
				height: 400rpx;
				background-color: #fff;
				border-radius: 30rpx;
			}
		}

		.chartBox_personage {
			margin: 0 auto 40rpx;
			width: 680rpx;

			// 图表-标题
			.chartTitle {
				margin-bottom: 20rpx;
				font-size: 28rpx;
				font-weight: 700;
			}

			// 两个图表的父盒子
			.personage {
				display: flex;
				justify-content: space-between;
				height: 250rpx;

				.personage_child {
					position: relative;
					width: 47%;
					background-color: #fff;
					border-radius: 30rpx;

					.area {
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