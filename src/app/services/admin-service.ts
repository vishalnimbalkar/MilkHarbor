import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http:HttpClient) { }

  baseUrl:string='http://localhost:8080/admin/'

  //register
  register(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register', payload);
  }

  //login
  login(payload:any){
    return this.http.post<any>(this.baseUrl + 'login',payload);
  }

}
