import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public auth: AuthService, 
    public router: Router
    ) {}

    canActivate(): boolean {
    
      if (!this.auth.isAuthenticated()) {
        localStorage.removeItem('token');
        localStorage.removeItem('logInTime');
        this.router.navigate(['/login']);
        return false;
      }
     

      return true;
    }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  
}
