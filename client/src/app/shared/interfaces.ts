export interface Login {
  login: string,
  password: string
}

export interface AuthToken {
  token: string
}

export interface User {
  _id?:string
  status?: boolean,
  position?: number,
  firstName: string,
  lastName: string,
  login: string,
  restaurant: string,
  password: string,
  imgSrc?: string,
  phone: string,
  email?: string
}

export interface Restaurant {
  _id?: string,
  status?: boolean,
  position?: number,
  title: string,
  description: string,
  timeOpen: string,
  timeClose: string,
  imgSrc?: string,
  rating?: number,
  kitchen: string,
  typePlace: string
}

export interface Kitchen {
  _id?: string,
  status?: boolean,
  position?: number,
  title: string,
  imgSrc?: string
}

export interface Elem {
  id: string
  title: string,
  route: string,
  formRoute: string
}
