import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FarmerServiceService {

  constructor(private http:HttpClient) { }

  baseUrl:string='http://localhost:8080/farmer/'

  signup(payload:any){
    return this.http.put(this.baseUrl+"register",payload);
  }

  //get farmers by id
onBackCall(id:any){
  return this.http.get(this.baseUrl+"onBackCall/"+id);
}
}
