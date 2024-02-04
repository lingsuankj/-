import Mock from 'mockjs';

export const homeSummarize = Mock.mock({
	'2023-1': '@natural(100, 200)',
	'2023-2': '@natural(100, 200)',
	'2023-3': '@natural(100, 200)',
	'2023-4': '@natural(100, 200)',
	'2023-5': '@natural(100, 200)',
	'2023-6': '@natural(100, 200)',
});

export const homePersonage = Mock.mock({
	all: [{
		name: '@cname()',
		total: '@natural(100, 200)',
		data: {
			'2023-1': '@natural(100, 200)',
			'2023-2': '@natural(100, 200)',
			'2023-3': '@natural(100, 200)',
			'2023-4': '@natural(100, 200)',
			'2023-5': '@natural(100, 200)',
			'2023-6': '@natural(100, 200)',
		},
	}, {
		name: '@cname()',
		total: '@natural(100, 200)',
		data: {
			'2023-1': '@natural(100, 200)',
			'2023-2': '@natural(100, 200)',
			'2023-3': '@natural(100, 200)',
			'2023-4': '@natural(100, 200)',
			'2023-5': '@natural(100, 200)',
			'2023-6': '@natural(100, 200)',
		},
	}],
});
