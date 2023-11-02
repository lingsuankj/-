import {
	getMockData
} from '../../mock/index.js'

const useMock = true
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
}