import { commonConfig } from "@/config";
function request(method, url, data) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: commonConfig.api_addr + url,
      data,
      method,
      header: getHeader(),
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}
export function get(url, data = {}) {
  return request("GET", url, data);
}
export function post(url, data = {}) {
  return request("POST", url, data);
}
function getHeader() {
  return {};
}
