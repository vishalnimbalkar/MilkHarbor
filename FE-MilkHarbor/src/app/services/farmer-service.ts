import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FarmerServiceService {

  constructor(private http:HttpClient) { }

  baseUrl:string='http://localhost:8080/farmer/'

  signup(payload:any){
    return this.http.post(this.baseUrl+"register",payload);
  }

//get farmer milk detials
getMilkDetails(f_id:any){
  return this.http.get(this.baseUrl+"getMilkDetails/"+f_id)
}

// get user by id
getUser(id:number){
  return this.http.get(this.baseUrl+"getUser/"+id)
}

//add bank account
addBank(payload:any){
  return this.http.post(this.baseUrl+"addBank",payload);
}
}
