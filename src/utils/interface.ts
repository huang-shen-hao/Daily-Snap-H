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

// 用户信息
export interface UsersPermissionsUser {
  id: number
  documentId: string
  username: string
  email: string
  avatar: string
  uuid?: string // 可选字段，因为某些对象可能不包含
}

// 评论项（支持多级嵌套）
export interface ICommentItem {
  child: ICommentItem[] // 子评论数组，元素本身也是 CommentItem，实现递归嵌套 :contentReference[oaicite:0]{index=0}
  content: string
  createdAt: string // ISO 时间字符串
  documentId: string
  id: number
  kind: string
  likes: any[] // 点赞列表，具体可根据实际改成更细粒度类型 :contentReference[oaicite:1]{index=1}
  locale: string | null
  pid: string | null
  publishedAt: string | null
  puid: string
  title: string | null
  type: string
  updatedAt: string // ISO 时间字符串
  users_permissions_user: UsersPermissionsUser
}
