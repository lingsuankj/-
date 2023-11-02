import {
	useMemberStore
} from '../stores/modules/member.js'

const memberStore = useMemberStore()

function getUrl(url) {
	if (url.startsWith('/api')) {
		url = url.replace(new RegExp('^/api'), '')
		url = 'http://127.0.0.1' + url
	}
	return url;
}

function getHeader(header = {}) {
	if (+new Date() > memberStore.token.expires_in) {
		// 重新获取token，并存入本地 ------------------
		// memberStore.token = {
		// 	accessToken: res.data.accessToken,
		// 	expireIn: +new Date() + res.data.expireIn * 1000
		// }
	}
	return {
		'Content-Type': typeof(header) === 'string' ? header : 'application/x-www-form-urlencoded',
		'accessToken': memberStore.token.accessToken,
		...header
	}
}

const useMock = false
import {
	getMockData
} from '../../mock/index.js'

export function request(options) {
	if (useMock) {
		if (options.url.indexOf('?') !== -1) {
			options.url = options.url.split('?')[0]
		}
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const data = getMockData(options.url)
				resolve(data)
			}, 100)
		})
	}
	return new Promise((resolve, reject) => {
		if (!options.header) options.header = {}
		const header = getHeader(options.header);
		options.url = getUrl(options.url)
		uni.request({
			// 设置超时时间 10s
			timeout: 10000,
			...options,
			header,
			success(res) {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res)
				} else {
					uni.showToast({
						icon: 'none',
						title: res.data.msg || '请求错误'
					})
					reject(res)
				}
			},
			fail(err) {
				uni.showToast({
					icon: 'none',
					title: '网络错误，换个网络试试'
				})
				reject(err)
			}
		})
	})
}