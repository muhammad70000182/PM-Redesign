// data-sharing.service.ts
import { Injectable } from '@angular/core';

@Injectable()
export class PermissionsSharingService {
private updateDelte:any;
  setPermissions(data: any) {
    this.updateDelte = data;
  }
  getPermissions() {
    return this.updateDelte;
  }
}
