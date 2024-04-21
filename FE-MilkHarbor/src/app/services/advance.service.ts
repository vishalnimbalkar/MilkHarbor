import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvanceService {

  constructor(private http:HttpClient) { }

  baseUrl:string='http://localhost:5000/advance/'

  //register
  addAdvance(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'add', payload);
  }

  get(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'get');
  }

  getByUname(username:string): Observable<any>{
    return this.http.post<any>(this.baseUrl + 'getByUname',{username:username});
  }

  getById(id:any){
    return this.http.post<any>(this.baseUrl+"getById",{_id:id})
  }

  getByUsername(username:string){
    return this.http.get<any>(this.baseUrl+"getByUsername/"+username)
  }
  delete(_id:string):Observable<any>{
    return this.http.post<any>(this.baseUrl+'delete',{_id})
  }

// change status pending to done
  updateAll(username:string){
    return this.http.post(this.baseUrl+"updateAll",{username});
  }

}
