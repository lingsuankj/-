import Mock from 'mockjs';

// 得到对应的所有的年级-班级
export const inquireClass = Mock.mock({
	data: [{
			id: 1,
			parent: null,
			text: '一年级'
		},
		{
			id: 11,
			parent: 1,
			text: '1-1班'
		},
		{
			id: 111,
			parent: 11,
			text: '1-1-1班'
		},
		{
			id: 12,
			parent: 1,
			text: '1-2班'
		},
		{
			id: 2,
			parent: null,
			text: '二年级'
		},
		{
			id: 21,
			parent: 2,
			text: "2-1班"
		},
		{
			id: 22,
			parent: 2,
			text: "2-2班"
		}
	]
})

// 得到所有的课程
export const inquireSubject = Mock.mock({
	data: ['数学', '语文', '英语', '物理', '历史', '地理']
})

// 接收的参数：班级 开始时间 结束时间
// 得到的结果：suject:科目，total:总数提问次数，correctNum:回答正确次数
export const inquireAuthorityHigh = Mock.mock({
	data: [{
		subject: '语文',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '数学',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '英语',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '物理',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '历史',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '化学',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}]
});

// 接收的参数：班级 开始时间 结束时间
// 得到的结果：suject:科目，total:总数提问次数，correctNum:回答正确次数
export const inquireAuthorityLow = Mock.mock({
	data: [{
		subject: '23-1',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '23-2',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '23-3',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		subject: '23-4',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}]
});

// 接收的参数：班级 科目 开始时间 结束时间
// 得到的结果：name:姓名，total:总数提问次数，correctNum:回答正确次数
export const inquireClassDetail = Mock.mock({
	data: [{
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}, {
		name: '@cname()',
		total: '@natural(180, 200)',
		correctNum: '@natural(140, 180)'
	}]
});