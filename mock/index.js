import {
	myLogin
} from './mocks/my.js';
import {
	homeSummarize,
	homePersonage
} from './mocks/home.js';
import {
	detailsStatistics,
	detailsAccuracy
} from './mocks/details.js';
import {
	inquireClass,
	inquireAuthorityHigh,
	inquireAuthorityLow,
	inquireClassDetail,
	inquireSubject
} from './mocks/inquire.js';

export const getMockData = (url) => {
	switch (url) {
		case '/api/my/login':
			return myLogin
		case '/api/home/summarize':
			return homeSummarize
		case '/api/home/personage':
			return homePersonage
		case '/api/details/statistics':
			return detailsStatistics
		case '/api/details/accuracy':
			return detailsAccuracy
		case '/api/inquire/class':
			return inquireClass
		case '/api/inquire/authorityHigh':
			return inquireAuthorityHigh
		case '/api/inquire/authorityLow':
			return inquireAuthorityLow
		case '/api/inquire/classDetail':
			return inquireClassDetail
		case '/api/inquire/subject':
			return inquireSubject
		default:
			throw 'no match url'
	}
}