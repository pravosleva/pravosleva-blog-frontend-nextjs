interface IRole {
  _id: string
  name: string // "Public",
  description: string
  type: string // "public",
  createdAt: string // "2020-01-21T22:03:29.497Z",
  updatedAt: string // 2020-03-09T13:40:24.565Z",
  __v: number // 0,
  id: string
}
export interface IUserInfo {
  confirmed: boolean
  blocked: boolean
  _id: string
  username: string
  email: string
  provider: string
  createdAt: string // "2020-01-21T22:03:29.497Z",
  updatedAt: string // 2020-03-09T13:40:24.565Z",
  __v: number // 0,
  role: IRole
  id: string
}
