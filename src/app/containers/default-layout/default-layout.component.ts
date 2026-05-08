import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { navItems } from './_nav';
import { Observable, Subscription, delay } from 'rxjs';
import { AuthService } from '../../_services/loader/auth-service.service';
import { SharedService } from '../../_services/shared.service';
import { SharedHelper } from '../../_Helper/SharedHelper';
import jwt_decode from "jwt-decode";
import { INavData } from '@coreui/angular';
import { EnumService } from '../../_services/enum.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

interface NavItem {
  name: string;
  originalName?: string;
  url: string;
  iconComponent?: { name: string };
  children?: { name: string; url: string }[];
  icon?: string; // Font Awesome icon class, e.g., 'fa-solid fa-user'
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {

  processing: boolean;
  Loading: Observable<boolean>;
  auth: any;
  private langSub: Subscription;
  public navItems: INavData[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      //iconComponent: { name: 'cil-speedometer' },
      icon: 'fa-solid fa-house',
      originalName: 'Dashboard'
    },
    // {
    //   name: 'Main',
    //   title: true
    // },

  ]

  PermissionsList: any;

  constructor(
    auth: AuthService,
    private http: SharedService,
    private _sharedHelper: SharedHelper,
    private cdr: ChangeDetectorRef,
    private _enumService: EnumService,
    private translate: TranslateService
  ) {
    this.Loading = auth.isLoading;
    this.Loading.pipe(delay(0)).subscribe((loading: boolean) => {
      this.processing = loading;
    });
  }
  ngOnInit(): void {

    let token = localStorage.getItem('token');
    if (token) {
      let decoded: { RoleID: number } = jwt_decode(token);
      // let roleId =  decoded.RoleId;
      this.GetAssignPermissionsList(decoded.RoleID);
    }
    // this.langSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.translateNavItems();
    // });
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.translateNavItems();
      this.cdr.detectChanges();
    });
  }
  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
  GetAssignPermissionsListOld(event: any) {

    let url = '/Permissions/GetAssignedPermissions?RoleId=' + event;
    this.http.Get(url).subscribe({
      next: result => {
        if (result.status) {

          this.PermissionsList = result.data;
          let Permissions = this.PermissionsList.assignPermissions;
          //#region Group by permissions by parrent
          const groupedData = Permissions.reduce((result: any, item: any) => {
            const category = item.parrent;

            if (!result[category]) {
              result[category] = [];
            }
            result[category].push(item);
            return result;
          }, {});
          for (let parent of Object.keys(groupedData)) {
            let pr = Permissions.find((m: any) => m.parrent == parent);
            // let parentUrl = '';
            // if(parent == 'Master'){
            //   parentUrl = '/users'
            // }else if(parent == 'Permissions'){
            //   parentUrl =  '/permissions'
            // }else if(parent == 'Punching'){
            //   parentUrl =  '/punching'
            // }
            const filterChilderen = Permissions.filter((item: any) => item.parrent === parent);
            let childerenArray: any = [];
            for (let i = 0; i < filterChilderen.length; i++) {
              let data: any = {
                name: filterChilderen[i].title,
                url: filterChilderen[i].formUrl
              }
              childerenArray.push(data);
            }
            const punchingNavItem: NavItem = {
              name: parent,
              url: pr.parentUrl,
              //iconComponent: { name: 'fa fa-file-image' },
              children: childerenArray,
              icon: 'fa-solid fa-eye'
            };
            //this.navItems.push(punchingNavItem);
            this.navItems = [...this.navItems, punchingNavItem];
          }

          this.cdr.detectChanges();
          //#endregion
          let perm = this._sharedHelper.encryptData(this.PermissionsList.assignPermissions);
          localStorage.removeItem('key')
          localStorage.setItem('key', perm);
        }
      },
      error: (err: any) => {

      },
    });
  }
  GetAssignPermissionsList(event: any) {
    let url = '/Permissions/GetAssignedPermissions?RoleId=' + event;
    this.http.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.PermissionsList = result.data;
          let Permissions = this.PermissionsList.assignPermissions;

          //#region Group by permissions by parent
          const groupedData = Permissions.reduce((result: any, item: any) => {
            const category = item.parrent;
            if (!result[category]) {
              result[category] = [];
            }
            result[category].push(item);
            return result;
          }, {});

          // clear navItems before pushing new ones

          // get unique parents with parentSorting
          const sortedParents = Object.keys(groupedData)
            .map(parent => {
              // take the first record (all children under same parent have same parentSorting)
              const parentPermission = groupedData[parent][0];

              return {
                parent,
                parentUrl: parentPermission.parentUrl,
                parentIcon: parentPermission.parentIcon,
                sorting: Number(parentPermission.parentSorting ?? 0)
              };
            })
            .sort((a, b) => a.sorting - b.sorting); // ascending by parentSorting

          for (let { parent, parentUrl, parentIcon } of sortedParents) {
            // sort children by child sorting
            // const filterChildren = groupedData[parent].sort(
            //   (a: any, b: any) => Number(a.sorting ?? 0) - Number(b.sorting ?? 0)
            // );
            const filterChildren = groupedData[parent]
              .filter((child: any) => child.showInMenu) // ✅ only take children where showInMenu is true
              .sort((a: any, b: any) => Number(a.sorting ?? 0) - Number(b.sorting ?? 0));

            let childrenArray = filterChildren.map((child: any) => ({
              name: child.title,
              url: child.formUrl
            }));

            // const navItem: NavItem = {
            //   name: parent,
            //   url: parentUrl,
            //   children: childrenArray,
            //   icon: parentIcon

            // };

            const navItem: NavItem = {
              name: parent, // this will be translated later
              originalName: parent, // ✅ keep original translation key
              url: parentUrl,
              children: childrenArray.map((child: any) => ({
                ...child,
                originalName: child.name // ✅ store original key
              })),
              icon: parentIcon
            };
            this.navItems = [...this.navItems, navItem];
          }

          this.translateNavItems();
          this.cdr.detectChanges();
          //#endregion

          // save encrypted permissions in localStorage
          let perm = this._sharedHelper.encryptData(this.PermissionsList.assignPermissions);
          let agreementPerm = this.PermissionsList.agreementPermissions;

          this._enumService.setAgreementPermissions(agreementPerm);
          localStorage.removeItem('key');
          localStorage.setItem('key', perm);

        }
      },
      error: (err: any) => { },
    });
  }
  //test comments
  private translateNavItems(): void {
    this.navItems = this.navItems.map(item => ({
      ...item,
      name: this.translate.instant(item.originalName ?? item.name ?? ''),
      children: item.children?.map(child => ({
        ...child,
       name: this.translate.instant(child.originalName ?? child.name ?? ''),
      })) || []
    }));
  }


}
