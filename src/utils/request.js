import { useMemberStore } from '../stores/modules/member.js';

const memberStore = useMemberStore();

function getUrl(url) {
  if (url.startsWith('/ding')) {
    url = url.replace(new RegExp('^/ding'), '');
    url = 'https://api.dingtalk.com' + url;
  }

  if (url.startsWith('/oding')) {
    url = `${import.meta.env.VITE_REQUESTIP}` + url;
  }

  if (url.startsWith('/ling')) {
    // When nginx is not used, uncomment
    // url = url.replace(new RegExp('^/ling'), '');
    url = `${import.meta.env.VITE_REQUESTIP}` + url;
  }

  return url;
}

function getHeaders(headers = {}) {
  return {
    ...headers,
    'Content-Type': headers['Content-Type'] ? headers['Content-Type'] : 'application/json',
  };
}

const max = 20;
let reqPerSecond = 0;

export async function request(options) {
  // Ensure that the number of dingding requests from the client does not exceed 20 per second.
  if (options.url.slice(0, 6) === '/oding') {
    reqPerSecond++;

    while (reqPerSecond > max) {
      await new Promise(res => setTimeout(res, 100));
    }

    setTimeout(() => reqPerSecond--, 1000);
  }

  return new Promise((resolve, reject) => {
    if (!options.headers) options.headers = {};
    options.headers = getHeaders(options.headers);

    options.data.clientId = import.meta.env.VITE_APPKEY;

    // #ifndef H5
    options.url = getUrl(options.url);
    // #endif

    uni.request({
      timeout: 30000,
      ...options,
      success(res) {
        if (res.data.errcode === 88) {
          memberStore.Limiting = true;
        }

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
