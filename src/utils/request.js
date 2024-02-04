/* eslint-disable no-undef */
// import { useMemberStore } from '../stores/modules/member.js';
import { getMockData } from '../../mock/index.js';

// const memberStore = useMemberStore();

function getUrl(url) {
  if (url.startsWith('/ding')) {
    url = url.replace(new RegExp('^/ding'), '');
    url = 'https://api.dingtalk.com' + url;
  }

  if (url.startsWith('/oding')) {
    url = url.replace(new RegExp('^/oding'), '');
    url = 'https://oapi.dingtalk.com' + url;
  }

  if (url.startsWith('/ling')) {
    url = url.replace(new RegExp('^/ling'), '');
    url = 'http://10.0.1.224:7001' + url;
  }

  return url;
}

function getHeaders(headers = {}) {
  // if (+new Date() > memberStore.token.expires_in) {
  //   get token again, save local
  //   memberStore.token = {
  //     accessToken: res.data.accessToken,
  //     expireIn: +new Date() + res.data.expireIn * 1000,
  //   }
  // }
  return {
    ...headers,
    'Content-Type': headers['Content-Type'] ? headers['Content-Type'] : 'application/json',
  };
}

const useMock = false;

// const sleeep = times => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log('run sleeep 0000000');
//       resolve();
//     }, times);
//   });
// };

// const httpRunList = [];
// let sum = 0;

export async function request(options) {
  // sum++;
  // console.log('create new request------------');

  // const maxHttpConcurrent = async (max) => {
  //   return new Promise(async resolve => {
  //     const now = Date.now();
  //     if (httpRunList.length >= max) {
  //       console.log(`length > ${max} enter if`);

  //       while (now - httpRunList[0] > 1000) {
  //         httpRunList.shift();
  //         console.log('shift');
  //       }

  //       await sleeep(200);
  //       console.log('recursive ==');
  //       await maxHttpConcurrent(max);
  //     } else {
  //       httpRunList.push(now);
  //       console.log(`== in == send request success, httpRunList length is ${httpRunList.length}, sum = ${sum}`);
  //       resolve();
  //     }
  //   });
  // };
  // await maxHttpConcurrent(5);
  // console.log(`== out == send request success, httpRunList length is ${httpRunList.length}, sum = ${sum}`);

  if (useMock) {
    if (options.url.indexOf('?') !== -1) {
      options.url = options.url.split('?')[0];
    }

    return new Promise(resolve => {
      setTimeout(() => {
        const data = getMockData(options.url);
        resolve(data);
      }, 100);
    });
  }

  return new Promise((resolve, reject) => {
    if (!options.headers) options.headers = {};
    options.headers = getHeaders(options.headers);

    // #ifndef H5
    options.url = getUrl(options.url);
    // #endif

    uni.request({
      timeout: 30000,
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res);
        } else {
          uni.showToast({
            icon: 'none',
            title: res.data.msg || '请求错误',
          });
          reject(res);
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        });
        reject(err);
      },
    });
  });
}
