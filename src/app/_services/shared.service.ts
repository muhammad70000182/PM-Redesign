import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ConfigService } from './LoadConfigFile';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
apiUrl:any

  constructor(
    private http: HttpClient,
    private configService:ConfigService,
  ) {
    this.apiUrl = configService.config['apiUrl'] ;
   }
  Get(link:any):Observable<any> {
    return this.http.get(this.apiUrl + link)
  }
  Post(formData:any,link:any) {
    return this.http.post(this.apiUrl + link, formData);
  }
  PostThirdPary(formData:any,link:any) {
    return this.http.post(link, formData);
  }
}
