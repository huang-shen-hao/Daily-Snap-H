export interface registerForm {
  username: string
  email: string
  password: string
  code: string
}

// 通过 Omit 排除注册表单中不需要的字段
export type LoginForm = Omit<registerForm, 'username' | 'code'>

export interface weatherForm {
  city: string
  key: string
}

export interface realWeatherType {
  aqi: string
  direct: string
  humidity: string
  info: string
  power: string
  temperature: string
  wid: string
}
