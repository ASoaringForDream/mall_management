import axios from "axios";
import nProgress from "nprogress";
import 'nprogress/nprogress.css'
export function request(config) {
  // 新建axios对象
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 3000
  })
  // axios拦截器
  // 拦截请求 携带token
  instance.interceptors.request.use((config)=>{
    nProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },(err)=>{
    console.log(err);
  })
  // 拦截响应
  instance.interceptors.response.use(res=>{
    nProgress.done()
    return res.data
  },err=>{
    console.log(err);
  })

  return instance(config)
}