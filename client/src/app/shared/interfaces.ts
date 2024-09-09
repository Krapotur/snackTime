export interface Login {
  login: string,
  password: string
}

export interface AuthToken {
  token: string
  userName: string
  group: string
  rest: string
}

export interface User {
  _id?: string,
  position?: number,
  status?: boolean,
  firstName: string,
  lastName: string,
  login: string,
  group: string,
  restaurant: string,
  password?: string,
  imgSrc?: string,
  phone: string,
  email?: string
}

export interface Group {
  _id?: string,
  title: string,
  alias: string
}

export interface Restaurant {
  _id?: string,
  position?: number,
  status?: boolean,
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
  position?: number,
  status?: boolean,
  title: string,
  imgSrc?: string
}

export interface Category{
  _id?: string,
  position?: number,
  status?: boolean,
  title: string,
  quantity?: number,
  imgSrc: string
}

export interface Position {
  _id?: string,
  positionNum?: number,
  status?: boolean,
  title: string,
  imgSrc: string,
  price: number,
  composition: string,
  weight: number,
  proteins: number,
  fats: number,
  carbs: number,
  caloric: number,
  category: string
  restaurant: string
}

export interface Elem {
  id: string
  title: string,
  route: string,
  formRoute: string
}

export interface CategoryRoute{
  id: string,
  route: string
}
