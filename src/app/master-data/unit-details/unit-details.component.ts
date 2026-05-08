import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../_services/shared.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SharedHelper } from '../../_Helper/SharedHelper';
import { FormLabelHelper } from '../../_Helper/form-lable-helper';
import { PermissionsSharingService } from '../../_services/permissionsharing.service';

@Component({
  selector: 'app-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.css']
})
export class unitdetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  form: FormGroup;
  UnitDetailform: FormGroup;
  submitted: boolean;
  loading: boolean;
  isUpdate: boolean;
  RolesList: any;
  searchData = "";
  RecordCount: any;
  showForm: boolean = false;
  addBreadcrumb: boolean = false;
  showHidetable: boolean = true;
  baseUrl: any = '/RoleManagement/';
  p: any;
  CurrentUserInfo: any | { Id: number; UserCode: string; FullName: string; RoleName: string; RoleID: number; UserImage: string; };
  SAPSettingList: any;
  AllowedPermissions: any;
  UtilityFacilityList: any;
  Facility: string;
  Quantity: string;
  Rate: string;
  bsInlineValue = new Date();
  unitSubmitted: boolean = true;
  FacilityList: any = [];
  UtilityList: any = [];
  agreementItems: any = [];
  ZoneList: any = [];
  SubZoneList: any = [];
  BL_subZone: any;
  BL_Zone: any;
  BL_code: any = "";
  masterSelected: boolean = false;
  Utility: any;
  TaxCode: any;
  Calculation: any;
  UtilityRates: any;
  UtilityRateTotal: any;
  UtilityTax: any;
  UtilityAmountAfterTax: any;
  Occurance: any;
  Amount: any;
  UnitFacilityName: any;
  activeTab = 'UnitDetail';
  UnitactiveTab: string = 'UnitDetail';
  ItemsListData: any;
  UtilityItemsList: any;
  PropertyItemsList: any;
  TaxCodesList: any;
  FacilitiesMasterList: any;
  serach: string = "code";
  BL_Status: null;
  FacilitybyID: any = [];
  UtilitybyID: any = [];
  getselectunits: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _service: SharedService,
    private _sharedHelper: SharedHelper,
    private labelHelper: FormLabelHelper,
    private el: ElementRef,
    private renderer: Renderer2,
    private _permService: PermissionsSharingService
  ) {
    this.AllowedPermissions = this._permService.getPermissions();
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next(null); // no need to pass 0
    this.labelHelper.markRequiredFields(this.form, this.el, this.renderer);
  }

  ngOnDestroy(): void {
    // ✅ Prevent memory leaks
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }
  ngOnInit(): void {
    this.CurrentUserInfo = this._sharedHelper.getCurrentUserInfo();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
ordering:false
    };


    this.form = this.formBuilder.group({
      Id: [0],
      SapUserName: ['', Validators.required],
      SapPassword: ['', Validators.required],
      SapServerAddress: ['', Validators.required],
      SapDbName: ['', Validators.required],
      SapDbType: ['', Validators.required],
      DbUserName: ['', Validators.required],
      DbPassword: ['', Validators.required],
      DbName: ['', Validators.required],
      DbServerName: ['', Validators.required],
      ServiceLayerUrl: ['', Validators.required],
      CreatedBy: [parseInt(this.CurrentUserInfo.Id)],
      UpdatedBy: [parseInt(this.CurrentUserInfo.Id)],
      CreatedDate: [new Date()],
      UpdatedDate: [new Date()]
    });
    this.UnitDetailform = this.formBuilder.group({
      Id: [0],
      TrnsAgreementId: [null],
      U_AGID: [null],
      Name: ['', [Validators.maxLength(100), Validators.required]],
      U_UnitCode: ['', [Validators.maxLength(50), Validators.required]],
      U_PrjID: [null],
      U_BldID: [null],
      U_SecID: [null],
      U_SubSecID: [null],
      U_UnitSize: ["", [Validators.maxLength(20)]],
      U_PerSQMRate: [null],
      U_Total: [null],
      U_DiscPrc: [null],
      U_DiscAmt: [null],
      U_TotAfterDisc: [null],
      U_TaxPrc: [null],
      U_TaxAmt: [null],
      U_TotAfterTax: [null],
      CreatedBy: [parseInt(this.CurrentUserInfo.Id)],
      CreatedDate: [new Date()],
      UpdatedBy: [parseInt(this.CurrentUserInfo.Id)],
      UpdatedDate: [new Date()],
      U_SubZoneName: [''],
      U_TaxCode: [''],
      U_ProjectName: [''],
      U_BuildingName: [''],
      U_ZoneName: [''],
      AgreementUtilities: [''],
      AgreementItemFacilities: [],
      totalRentPerYear: [null],
      U_SecAmt: [null]
    });

    const f = this.UnitDetailform.controls;


    this.GetItemMasterData();
    this.GetTaxCodes();
    this.GetMasterData();
    this.GetZoneData();
    this.GetItemMasterDatanew();
  }

  get f() { return this.form.controls; }
  get un() { return this.UnitDetailform.controls; }
  onSubmit() {
    debugger
    let str = ""
    if (this.BL_subZone != null && this.BL_subZone.length > 0) {
      this.BL_subZone
      str = this.BL_subZone.join(",");
    }
    this.GetSearchquery(this.BL_code, this.BL_Zone, str, this.BL_Status)

  }
  onclear() {
    debugger

    this.serach = "code";
    this.BL_subZone = null;
    this.BL_Zone = null;
    this.BL_code = null;
    this.BL_Status = null;

  }

  clearForm() {
    this.submitted = false;
    this.isUpdate = false;
    this.form.reset();
    this.form.patchValue({
      Id: 0,
      CreatedBy: parseInt(this.CurrentUserInfo.Id),
      UpdatedBy: parseInt(this.CurrentUserInfo.Id),
      CreatedDate: new Date(),
      UpdatedDate: new Date()
    });
  }
  Update(data: any) {

    this.form.patchValue({
      Id: data.id,
      SapUserName: data.sapUserName,
      SapPassword: data.sapPassword,
      SapServerAddress: data.sapServerAddress,
      SapDbName: data.sapDbName,
      SapDbType: data.sapDbType,
      DbUserName: data.dbUserName,
      DbPassword: data.dbPassword,
      DbName: data.dbName,
      DbServerName: data.dbServerName,
      ServiceLayerUrl: data.serviceLayerUrl,
      CreatedBy: data.createdBy,
      UpdatedBy: data.updatedBy,
      CreatedDate: data.createdDate,
      UpdatedDate: data.updatedDate
    });
  }
  AddRemoveFacilty(status: any, data: any) {
    if (status == 'add') {
      // if (!this.F_Occupation || !this.F_Relation) {
      //    this.toastr.warning("Please Select all fields !", "Warning");
      //   return;
      // }
      let FacilityInfo = {
        U_FctCode:String( this.Facility),
        U_Qty: this.Quantity,
        U_Rate: this.Rate,
        U_FacilityName: this.UnitFacilityName
      }

      this.FacilityList.push(FacilityInfo);
    } else {
      this.FacilityList = this.FacilityList.filter((item: any) => item !== data)
    }
    //this.BusinessInformationList
    this.ClearlgForm();
  }
  ClearlgForm() {

    this.Facility = '';
    this.Quantity = '';
    this.Rate = '';
  }
  AddRemoveUtility(status: any, data: any) {

    if (status == 'add') {
      // if (!this.F_Occupation || !this.F_Relation) {
      //    this.toastr.warning("Please Select all fields !", "Warning");
      //   return;
      // }
let Cal = 0;
      if (this.Calculation === 'Fixed') {
        Cal = 1;
      } else if (this.Calculation === 'By Unit Size(Per SQM)') {
        Cal = 2;
      }
      else if (this.Calculation === 'Metered (Per Unit)') {
        Cal = 3;
      }
      let UtilityInfo = {
        u_UtilItemCode: this.Utility,
        u_TaxCode: this.TaxCode,
        u_Calculation:Cal,
        CalculationName: this.Calculation,
        u_Rate: this.UtilityRates,
        u_Occurance: this.Occurance,
        u_Amount: this.UtilityRateTotal,
        tax: this.UtilityTax,
        amountAfterTax: this.UtilityAmountAfterTax
      }

      this.UtilityList.push(UtilityInfo);
    } else {
      this.UtilityList = this.UtilityList.filter((item: any) => item !== data)
    }
    //this.BusinessInformationList

    this.ClearUtilityForm();
  }
  ClearUtilityForm() {

    this.Utility = '';
    this.TaxCode = '';
    this.Calculation = '';
    this.UtilityRates = '';
    this.UtilityRates = '';
    this.Amount = '';

  }
  switchTab(tabName: string, tabType: string) {
    if (tabType == 'header') {
      this.activeTab = tabName;
    } else {
      if (this.UnitactiveTab == 'UnitDetail') {

      }
      this.UnitactiveTab = tabName;
    }

  }
  GetItemMasterDatanew() {

    let url = '/UnitDetails/unitDetail?id=0';
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.PropertyItemsList = result.data


          // this.ItemsListData = result.data;
          //this.UtilityItemsList = result.data.filter((item: any) => item.u_UtilityItem === 'Y');
          // this.PropertyItemsList = result.data.filter((item: any) => item.u_PropertyItem === 'Y');


        }
      },
      error: (err: any) => { },
    });
  }
  GetItemMasterData() {

    let url = '/MasterData/GetItemMasterData';
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {

          //this.ItemsListData = result.data;
          this.UtilityItemsList = result.data.filter((item: any) => item.u_UtilityItem === 'Y');
          //this.PropertyItemsList = result.data.filter((item: any) => item.u_PropertyItem === 'Y');


        }
      },
      error: (err: any) => { },
    });
  }
  GetTaxCodes() {

    let url = '/MasterData/GetTaxCodes';
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.TaxCodesList = result.data;

        }
      },
      error: (err: any) => { },
    });
  }
  GetMasterData() {

    let url = '/MasterData/GetMasterData?type=Facility';
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.FacilitiesMasterList = result.data;
        }
      },
      error: (err: any) => { },
    });
  }
  checkUncheckAll() {
    this.agreementItems.forEach((item: any) => {
      item.selected = this.masterSelected;
    });
  }
  isAllSelected() {
    this.masterSelected = this.agreementItems.every(
      (item: any) => item.selected === true
    );
  }

  getSelectedIds() {
    return this.agreementItems
      .filter((item: any) => item.selected)
      .map((item: any) => item.agrItemId);
  }
  GetZoneData(id: any = 0) {
    let url = '/PropertyStructure/zones?id=' + id;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.ZoneList = result.data;

        }
      },
      error: (err: any) => { },
    });
  }
  GetSubZoneData(id: any = 0, zoneid: any = 0) {

    this.serach = "zone";
    let url = '/PropertyStructure/subzones?id=' + id + '&zoneid=' + zoneid;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.SubZoneList = result.data;

        }
      },
      error: (err: any) => { },
    });
  }
  GetSearchquery(itemCode: any = "", Zone: any = "", SubZone: any = "", status: any = "") {

    this.serach = "zone";
    let url = '/UnitDetails/unitDetailList?itemCode=' + itemCode + '&Zone=' + Zone + '&SubZone=' + SubZone + '&Status=' + status;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.agreementItems = result.data;

        }
      },
      error: (err: any) => { },
    });
   
  }

  getUnitById(unitId: number) {
    return this.agreementItems.find((u: { id: number; }) => u.id === unitId);
  }
  GetFacilityUtilityById(id: any = 0) {
    debugger
    let FacilityUtility = this.getUnitById(id)
    if (FacilityUtility.facilities != null) {
      this.FacilitybyID = [...FacilityUtility.facilities];
    }
    if (FacilityUtility.utilities != null) {
      this.UtilitybyID = [...FacilityUtility.utilities];
    }
    ($('#detailModal') as any).modal('show');
  }

  ondataSubmit() {
   
      const payload = this.agreementItems
      .filter((item: any) => item.selected)
      .map((item: any) => ({
        id: item.id,
        U_ItemCode: item.itemCode,
        Name: item.itemName,
        createdBy: 0,
        createdDate: new Date().toISOString(),
        updatedBy: 0,
        updatedDate: new Date().toISOString(),
        unitFacilities: this.FacilityList,
        unitUtilities: this.UtilityList
      }))
    
    let url = '/UnitDetails/postunitdetails';
    this._service.Post(payload, url).subscribe({
      next: (result: any) => {
        if (result.status) {
          this.clearForm();
          this.toastr.success(result.message, "Success", {
            progressBar: true,
            closeButton: true
          });

        } else {
          this.toastr.error(result.message, "Error", {
            progressBar: true,
            closeButton: true
          });
        }
      },
      error: (err: any) => {

      },
    });
    this.onclearform()
  }
  onclearform() {
    this.agreementItems = [];
    this.FacilityList = [];
    this.UtilityList = [];
    this.onclear();

  }
}
