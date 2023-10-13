// 代码块
// 封装的目的
// 		1. 发送请求的时候调用更简洁
//		2. 添加一些通用的配置(超时时间，请求头)。 调用者没有传入配置的时候用默认的，调用者传入了相同，优先使用调用者
// 		3. 改成使用promise解决异步问题
//		4. 统一维护域名
//		5. 添加请求拦截器，在所有请求之前加一些通用的操作
//		6. 代码响应之前，进行一些通用的操作
const proxy = {
	"/api": {
		target: "http://dingclass.com",
		pathRewrite: '^/api'
	}
}

function getUrl(url) {
	for (let key in proxy) {
		if (url.startsWith(key)) {
			if (proxy[key].pathRewrite) {
				url = url.replace(new RegExp(proxy[key].pathRewrite), "")
			}
			url = proxy[key].target + url
			break;
		}
	}
	return url;
}

function getHeader(header = {}) {
	if (+new Date() > uni.getStorageSync("randomNameToken").expireTime) {
		// 重新获取token，并存入本地
		uni.setStorageSync("randomNameToken", {
			token: '123',
			expireTime: +new Date() + 2 * 60 * 60 * 1000
		})
	}
	return {
		"Content-Type": typeof(header) === 'string' ? header : "application/x-www-form-urlencoded",
		"access_token": uni.getStorageSync("randomNameToken").token,
		...header
	}
}

function request(options) {
	return new Promise((reslove, reject) => {
		if (!options.header) options.header = {}
		const header = getHeader(options.header);
		options.url = getUrl(options.url)
		uni.request({
			// 设置超时时间10s
			timeout: 10000,
			...options,
			header,
			success(res) {
				resolve(res)
				// if (res.statusCode >= 200 && res.statusCode < 300) {
				// 	resolve(res)
				// } else if (res.statusCode === 401) {
				// 	// 401 清理用户信息 跳转到登录页
				// 	// 标记为失败
				// 	reject(res)
				// } else {
				// 	// 其他错误
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: res.data.msg || '请求错误'
				// 	})
				// 	reject(res)
				// }
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

export function get(url, options) {
	return request({
		url,
		...options,
		method: "GET"
	})
}

export function post(url, data, options) {
	return request({
		url,
		data,
		...options,
		method: "POST"
	})
}