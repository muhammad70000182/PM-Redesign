import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SharedHelper } from './SharedHelper';
import { PermissionsSharingService } from '../_services/permissionsharing.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  Permissions: any;
  constructor(
    public router: Router,
    private _sharedHelper: SharedHelper,
    private datasharing:PermissionsSharingService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let Url = state.url;
    let PermissionsString = localStorage.getItem('key');
    if(!PermissionsString){
      localStorage.removeItem('token');
        localStorage.removeItem('logInTime');
        this.router.navigate(['/login']);
        return false;
    }
    this.Permissions = this._sharedHelper.decryptData(PermissionsString);
    const dt = this.Permissions.find((x:any) => x.formUrl == Url);
    if (dt) {
      this.datasharing.setPermissions(dt);
      return true;
    } else {
      return false;
    }

  }
  canActivateChild() {

    let Url = this.router.url;
    //return this.checkHavePermission();
  }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

}
