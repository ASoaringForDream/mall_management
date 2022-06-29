import axios from "axios";
export function request(config) {
  // 新建axios对象
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 3000
  })
  // axios拦截器
  // 拦截请求
  instance.interceptors.request.use((config)=>{
    return config
  },(err)=>{
    console.log(err);
  })
  // 拦截响应
  instance.interceptors.response.use(res=>{
    return res.data
  },err=>{
    console.log(err);
  })

  return instance(config)
}