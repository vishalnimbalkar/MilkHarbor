import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MilkCollectionServiceService {

  constructor(private http:HttpClient) { }

  baseUrl:string='http://localhost:5000/mc/'

  //milk collection
  onMilkCollection(payload:any){
    return this.http.post(this.baseUrl+"collect",payload);
  }

  // get all milk collection details
  getMilkCollectionDetails(){
    return this.http.get(this.baseUrl+"get");
  } 
  
  //get milk Collection details for one farmer
  getSupplyMilkDetails(id:any){
    return this.http.get(this.baseUrl+"get/"+id);
  }

  //update supply milk information
  updateMilkDetails(payload:any){
    return this.http.put(this.baseUrl+"update",payload);
  }

  //delete milk detials
  deleteMilkDetails(id:any){
    return this.http.delete(this.baseUrl+"delete/"+id);
  }

  //genrate milk rate chart
  generateMilkRateChart(payload:any,payload2:any){
    return this.http.post(this.baseUrl+"genrateMilkRateChart",payload,payload2);
  }
}
