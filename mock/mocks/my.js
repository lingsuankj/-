import Mock from 'mockjs';

Mock.mock('http://127.0.0.1/my/login?authCode=hYLK98jkf0m', 'get', {
	access_token: '96fc7a7axxx',
	expires_in: '7200',
	userid: '500',
	name: '@cname()',
	pic: '@image("200*200","red","#fff","pic")',
	boss: 'true',
	role_list: {
		group_name: '职务',
		name: '老师',
		id: '100'
	},
	'position|1': [
		'学生',
		'班主任',
		'任课老师'
	]
});