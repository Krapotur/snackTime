export interface Login {
  login: string,
  password: string
}

export interface AuthToken {
  token: string
}

export interface User {
  status: boolean,
  position: number,
  firstName: string,
  lastName: string,
  login: string,
  group:string,
  password: string,
  imgSrc: string,
  phone: string,
  email: string
}

export interface Restaurant{
  _id?:string,
  status?: boolean,
  title: string,
  description: string,
  work_time: string,
  imgSrc?: string,
  rating?: number,
  kitchen: string,
}

export interface Kitchen {
  _id: string
  title: string,
  imgSrc: string
}
