import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http:HttpClient) { }

  baseUrl:string='http://localhost:5000/users/'

  //register
  register(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register', payload);
  }

  //login
  login(payload:any){
    return this.http.post<any>(this.baseUrl + 'login',payload);
  }

  //get User
  getUser(username:string){
    return this.http.get(this.baseUrl+"getUser/"+username);
  }

  updateProfile(payload:any){
    return this.http.post(this.baseUrl+"update",payload);
  }
  //invite farmers
  inviteFarmers(payload:string[]){
    return this.http.post(this.baseUrl+"inviteFarmers",payload)
  }

  checkUsername(username:String){
    return this.http.post(this.baseUrl+"checkUsername",{username})
  }
  //get pending farmers
  getPendingFarmers(){
  return this.http.get(this.baseUrl+"getPendingFarmers");
  }

  //approve farmers
  onApprove(payload:any){
    return this.http.post(this.baseUrl+"approve",payload);
  }
  
  //decline farmers
  onDecline(payload:any){
    return this.http.post(this.baseUrl+"decline",payload);
  }

  //get Farmer list
  getFarmersList(){
    return this.http.get(this.baseUrl+"getFarmers");
  }

  //active 
  onActive(payload:any){
    return this.http.put(this.baseUrl+"active",payload);
  } 
  // inactive
  onInActive(payload:any){
    return this.http.put(this.baseUrl+"inactive",payload);
  }

  getTotal(id:number){
    return this.http.get(this.baseUrl+"getTotal/"+id)
  }

}
