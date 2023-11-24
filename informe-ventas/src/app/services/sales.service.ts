import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class SalesService {

URL_API = environment.urlApi;

constructor(private httpClient:HttpClient) { }



reportSales(parameters:string):Observable<any>{
    return this.httpClient.get(this.URL_API+parameters);
}

}
