import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AgreementType {
  fieldValue: number;
  fieldName: string;
}

export interface AgreementActions {
  quotation: boolean;
  acceptance: boolean;
  cancelation: boolean;
  proformaDP:boolean;
  proformaCancelation:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  private agreementTypes$ = new BehaviorSubject<AgreementType[]>([]);
  private agreementActions$ = new BehaviorSubject<AgreementActions>({
    quotation: false,
    acceptance: false,
    cancelation: false,
    proformaDP: false,
    proformaCancelation: false
  });

  setAgreementPermissions(agreementPerm: any) {
    // --- Existing Agreement Types Mapping ---
    const mapping: { [prop: string]: { fieldValue: number, fieldName: string } } = {
      saleAgreement: { fieldValue: 1, fieldName: 'Sale' },
      rentAgreement: { fieldValue: 2, fieldName: 'Rent' },
      offPlanAgreement: { fieldValue: 5, fieldName: 'Off Plan' },
      maintenanceAgreement: { fieldValue: 3, fieldName: 'Maintenance' }
    };

    const agreements = Object.keys(mapping)
      .filter(prop => agreementPerm[prop] === true)
      .map(prop => mapping[prop]);

    this.agreementTypes$.next(agreements);

    // --- New Agreement Actions ---
    const actions: AgreementActions = {
      quotation: !!agreementPerm.agreementQuotation,
      acceptance: !!agreementPerm.agreementAcceptence,
      cancelation: !!agreementPerm.agreementCancelation,
//---------------Proforma Permissiont-----------
      proformaDP: !!agreementPerm.agreementCancelation,
      proformaCancelation: !!agreementPerm.agreementCancelation,
    };

    this.agreementActions$.next(actions);
  }

  // Observable for Agreement Types
  getAgreementTypes() {
    return this.agreementTypes$.asObservable();
  }

  // Observable for Agreement Actions
  getAgreementActions() {
    return this.agreementActions$.asObservable();
  }

  // Optional: To get current values (not just observable)
  getCurrentAgreementActions(): AgreementActions {
    return this.agreementActions$.getValue();
  }
}
