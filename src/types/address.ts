import { IUser } from "./user";

export interface IAddress {
  id: string;
  address: string;
  number: string;
  complement: string;
  reference?: string;
  district: string;
  city: string;
  state: string;
  country: string;
  name: string;
  zipCode: string;
  principal: boolean;
  createdAt: string;
  updatedAt: string;
  user: IUser;
}
