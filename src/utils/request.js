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
    url = 'http://10.0.1.224:7002' + url;
  }

  return url;
}

function getHeaders(headers = {}) {
  return {
    ...headers,
    'Content-Type': headers['Content-Type'] ? headers['Content-Type'] : 'application/json',
  };
}

export async function request(options) {
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
