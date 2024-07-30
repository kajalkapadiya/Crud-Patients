export interface Patient {
  id?: number;
  name: string;
  age: number;
  address: string;
  // apikey: string;
  zipcode: number;
  mobile: number;
  first_name: string;
  last_name?: string;
  dob?: string;
  gender?: string;
  blood_group?: string;
}
