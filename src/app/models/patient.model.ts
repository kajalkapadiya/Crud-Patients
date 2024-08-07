export interface Patient {
  id?: string;
  name: string;
  age: number;
  address: string;
  zipcode: number;
  mobile: number;
  first_name: string;
  last_name?: string;
  dob?: string;
  gender?: string;
  blood_group?: string;
  email: string;
  password: string;
  selected?: boolean;
}
