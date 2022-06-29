import axios from "axios";
export function request(config) {
  // 新建axios对象
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66',
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