function getUrl(url) {
	if (url.startsWith('/api')) {
		url = url.replace(new RegExp('^/api'), "")
		url = "http://127.0.0.1" + url
	}
	return url;
}

function getHeader(header = {}) {
	if (+new Date() > uni.getStorageSync("dingEnumeratorToken").expireTime) {
		// 重新获取token，并存入本地------------------
		uni.setStorageSync("dingEnumeratorToken", {
			access_token: 'sss.ddd.fff',
			expires_in: +new Date() + 2 * 60 * 60 * 1000
		})
	}
	return {
		"Content-Type": typeof(header) === 'string' ? header : "application/x-www-form-urlencoded",
		"access_token": uni.getStorageSync("dingEnumeratorToken").token,
		...header
	}
}

export function request(options) {
	return new Promise((resolve, reject) => {
		if (!options.header) options.header = {}
		const header = getHeader(options.header);
		options.url = getUrl(options.url)
		uni.request({
			// 设置超时时间10s
			timeout: 10000,
			...options,
			header,
			success(res) {
				// resolve(res)
				if (res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res)
				} else {
					// 其他错误
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