import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Response: any;
  resPonseAllow: any;
  isAllow: boolean;

  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    private router:Router,
    private toastr:ToastrService

  ) { }


  public isAuthenticated(): boolean {
    //this.helper: jwtHelper = new JwtHelper();
    const token = localStorage.getItem('token');
    if(token){
      return !this.jwtHelper.isTokenExpired(token);
    }
   return false;
   //
  }
//   public getURLpermission(url:any): Observable<boolean>{
//     this._service.isAllowURL(url).subscribe(
//     res=>{
//       if(res){

//         this.isAllow =  res['allow'];
//         if(!this.isAllow){
//           this.router.navigate(['/dashboard']);
//           this.toastr.error("You are not authorize! Please contact to admin.");
//         }
//       }
//     },
//     err=>{

//     }
//   )
//  return this.resPonseAllow;
//   }


}
