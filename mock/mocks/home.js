import Mock from 'mockjs';

Mock.mock('http://127.0.0.1/home/summarize', 'get', {
	'2023-1': '@natural(100, 200)',
	'2023-2': '@natural(100, 200)',
	'2023-3': '@natural(100, 200)',
	'2023-4': '@natural(100, 200)',
	'2023-5': '@natural(100, 200)',
	'2023-6': '@natural(100, 200)'
});

Mock.mock('http://127.0.0.1/home/personage', 'get', {
	all: [{
		name: '@cname()',
		total: '@natural(100, 200)',
		data: {
			'2023-1': '@natural(100, 200)',
			'2023-2': '@natural(100, 200)',
			'2023-3': '@natural(100, 200)',
			'2023-4': '@natural(100, 200)',
			'2023-5': '@natural(100, 200)',
			'2023-6': '@natural(100, 200)'
		}
	}, {
		name: '@cname()',
		total: '@natural(100, 200)',
		data: {
			'2023-1': '@natural(100, 200)',
			'2023-2': '@natural(100, 200)',
			'2023-3': '@natural(100, 200)',
			'2023-4': '@natural(100, 200)',
			'2023-5': '@natural(100, 200)',
			'2023-6': '@natural(100, 200)'
		}
	}]
});