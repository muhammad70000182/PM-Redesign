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
import { Router } from '@angular/router';

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
      icon: 'nav-icon custom-icon icon-dashboard',
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
    private translate: TranslateService,
    private router: Router
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

            const iconMap: any = {
              'Administration': 'nav-icon custom-icon icon-administration',
              'User Management': 'nav-icon custom-icon icon-user-management',
              'Approvals': 'nav-icon custom-icon icon-approval',
              'Permissions': 'nav-icon custom-icon icon-permission',
              'Master Data': 'nav-icon custom-icon icon-master-data',
              'Property Module': 'nav-icon custom-icon icon-property',
              'Reports': 'nav-icon custom-icon icon-reports'
            };
            const exactIconName = iconMap[parent];

            const navItem: NavItem = {
              name: parent, // this will be translated later
              originalName: parent, // ✅ keep original translation key
              url: parentUrl,
              children: childrenArray.map((child: any) => ({
                ...child,
                originalName: child.name // ✅ store original key
              })),
              iconComponent: undefined,
              icon: exactIconName ? exactIconName : (parentIcon ? parentIcon.replace(/\b(fa-solid|fas)\b/g, 'fa-regular') : undefined)
            };
            this.navItems = [...this.navItems, navItem];
            // console.log('this.navItems', JSON.stringify(this.navItems));
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
  searchText = '';

  allPermissions: any[] = [];

  filteredPermissions: any[] = [];
  GetAssignPermissionsList(event: any) {
    let url = '/Permissions/GetAssignedPermissions?RoleId=' + event;

    this.http.Get(url).subscribe({
      next: result => {
        if (result.status) {

          this.PermissionsList = result.data;
          let Permissions = this.PermissionsList.assignPermissions;

          // Clear previous data
          //this.navItems = [];
          this.allPermissions = [];
          this.filteredPermissions = [];

          //#region Group permissions by parent
          const groupedData = Permissions.reduce((result: any, item: any) => {
            const category = item.parrent;

            if (!result[category]) {
              result[category] = [];
            }

            result[category].push(item);
            return result;
          }, {});

          // Get unique parents with sorting
          const sortedParents = Object.keys(groupedData)
            .map(parent => {

              const parentPermission = groupedData[parent][0];

              return {
                parent,
                parentUrl: parentPermission.parentUrl,
                parentIcon: parentPermission.parentIcon,
                sorting: Number(parentPermission.parentSorting ?? 0)
              };

            })
            .sort((a, b) => a.sorting - b.sorting);

          for (let { parent, parentUrl, parentIcon } of sortedParents) {

            const filterChildren = groupedData[parent]
              .filter((child: any) => child.showInMenu)
              .sort((a: any, b: any) => Number(a.sorting ?? 0) - Number(b.sorting ?? 0));

            // Build child array AND search index
            let childrenArray = filterChildren.map((child: any) => {

              // Add to search list
              this.allPermissions.push({
                name: child.title,
                parent: parent,
                url: child.formUrl,
                parentUrl: parentUrl,
                parentIcon: parentIcon
              });

              return {
                name: child.title,
                url: child.formUrl
              };

            });

            const iconMap: any = {
              'Administration': 'nav-icon custom-icon icon-administration',
              'User Management': 'nav-icon custom-icon icon-user-management',
              'Approvals': 'nav-icon custom-icon icon-approval',
              'Permissions': 'nav-icon custom-icon icon-permission',
              'Master Data': 'nav-icon custom-icon icon-master-data',
              'Property Module': 'nav-icon custom-icon icon-property',
              'Reports': 'nav-icon custom-icon icon-reports'
            };

            const exactIconName = iconMap[parent];

            const navItem: NavItem = {
              name: parent,
              originalName: parent,
              url: parentUrl,

              children: childrenArray.map((child: any) => ({
                ...child,
                originalName: child.name
              })),

              iconComponent: undefined,
              icon: exactIconName
                ? exactIconName
                : (parentIcon
                  ? parentIcon.replace(/\b(fa-solid|fas)\b/g, 'fa-regular')
                  : undefined)
            };

            this.navItems = [...this.navItems, navItem];
          }

          this.translateNavItems();
          this.cdr.detectChanges();

          //#endregion

          // Save encrypted permissions
          let perm = this._sharedHelper.encryptData(this.PermissionsList.assignPermissions);
          let agreementPerm = this.PermissionsList.agreementPermissions;

          this._enumService.setAgreementPermissions(agreementPerm);

          localStorage.removeItem('key');
          localStorage.setItem('key', perm);

        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  searchPermissions() {

    const keyword = this.searchText.trim().toLowerCase();

    if (!keyword) {
      this.filteredPermissions = [];
      return;
    }

    this.filteredPermissions = this.allPermissions.filter(permission =>
      permission.name.toLowerCase().includes(keyword)
    );
  }
  highlight(text: string): string {

    if (!this.searchText) {
      return text;
    }

    const regex = new RegExp(`(${this.searchText})`, 'gi');

    return text.replace(regex, '<b>$1</b>');
  }
  navigate(url: string) {

    this.router.navigateByUrl(url);

    this.searchText = '';
    this.filteredPermissions = [];
  }
}
