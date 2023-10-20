import Mock from 'mockjs';


// 接收的参数：userId 开始时间 结束时间
// 得到的结果：科目：提问次数
Mock.mock('http://127.0.0.1/details/statistics', 'post', {
	'语文': '@natural(20, 100)',
	'数学': '@natural(20, 100)',
	'英语': '@natural(20, 100)',
	'物理': '@natural(20, 100)',
	'化学': '@natural(20, 100)',
	'生物': '@natural(20, 100)'
});

// 接收的参数：userId 开始时间 结束时间
// 得到的结果：suject:科目，total:总数提问次数，correctNum回答正确次数
Mock.mock('http://127.0.0.1/details/accuracy', 'post', {
	data: [{
		subject: '@cword(2)',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '@cword(2)',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '@cword(2)',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '@cword(2)',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '@cword(2)',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '@cword(2)',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}]
});