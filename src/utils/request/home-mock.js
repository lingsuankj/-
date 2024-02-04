// import { request } from '../request.js';
import { request } from '../request-mock.js';

// 学生答题互动频率数据
export function summarizeAPI() {
  return request({
    method: 'GET',
    url: '/api/home/summarize',
  });
}

// 热门学生数据
export function personageAPI() {
  return request({
    method: 'GET',
    url: '/api/home/personage',
  });
}
