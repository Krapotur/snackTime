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
