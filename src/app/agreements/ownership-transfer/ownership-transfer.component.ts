import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../_services/shared.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SharedHelper } from '../../_Helper/SharedHelper';
import { FormLabelHelper } from '../../_Helper/form-lable-helper';
import { PermissionsSharingService } from '../../_services/permissionsharing.service';
import { ConfigService } from '../../_services/LoadConfigFile';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ownership-transfer',
  templateUrl: './ownership-transfer.component.html',
  styleUrls: ['./ownership-transfer.component.css']
})
export class OwnershipTransferComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  isUpdate: boolean = false;
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
  PermormaInvoiceLIst: any;
  AgreementList: any;
  bsInlineValue = new Date();
  datePickerConfig: any;
  activeTab: string = 'UnitDetail';
  BPList: any[] = [];
  lineItems: any[] = [];
  SeriesList: any;
  SelectedAgreement: any = {};
  masterSelected: boolean = false;
  AttachmentTypeListValues: any;
  AttachmentType: any;
  Att_Description: any;
  FileURL: any;
  AttachmentsList: any = [];
  SeriesName: any;
  agrinfo: string;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _service: SharedService,
    private _sharedHelper: SharedHelper,
    private labelHelper: FormLabelHelper,
    private el: ElementRef,
    private renderer: Renderer2,
    private _permService: PermissionsSharingService,
    private configService: ConfigService,
    private datePipe: DatePipe
  ) {
    this.AllowedPermissions = this._permService.getPermissions();
    this.datePickerConfig = this._sharedHelper.getDateConfiguration();
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next(null); // no need to pass 0
    this.labelHelper.markRequiredFields(this.form, this.el, this.renderer);
  }

  ngOnDestroy(): void {
    // ✅ Prevent memory leaks
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.CurrentUserInfo = this._sharedHelper.getCurrentUserInfo();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      ordering: false
    };

    this.form = this.formBuilder.group({
      Id: [0],
      Name: [''],
      U_Seri: ['', Validators.required],
      U_DocNum: [''],
      U_AGID: ['', Validators.required],
      U_PDate: [new Date()],
      U_NBP: ['', Validators.required],
      U_NBPName: [''],
      U_NCPerson: [''],
      U_NCustRefNo: [''],
      U_TDate: [new Date()],
      U_Remarks: [''],
      CreatedBy: [0],
      CreatedDate: [null],
      UpdatedBy: [0],
      UpdatedDate: [null],
      AgreementType: [''],
      U_BPCode: [''],
      U_BPName: [''],
      U_CPName: [''],
      U_CustRefNo: [''],
      StatusName: ['Draft'],
    });


    this.GetAgreementList();
    this.GetLovs()

  }

  get f() { return this.form.controls; }
  onSubmit() {
    debugger

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const payload = { ...this.form.value };
    payload.U_AGID = String(payload.U_AGID ?? '');
    payload.U_InstID = String(payload.U_InstID ?? '');
    payload.U_DocNum = String(payload.U_DocNum ?? '');
    payload.U_Seri = String(payload.U_Seri ?? '');
    payload.U_CRNDraft = 'N';
    payload.U_GLDraft = 'N';
    payload.LineItems = this.SelectedAgreement.agreementItems
      .filter((item: any) => item.selected)
      .map((item: any) => ({
        id: 0,
        pmN_OOTRANSFERId: 0,
        u_AgrItmId: item.agrItemId,
        createdBy: 0,
        createdDate: new Date().toISOString(),
        updatedBy: 0,
        updatedDate: new Date().toISOString()
      }))
    payload.Attachements = this.AttachmentsList;
    if (payload.LineItems.length == 0) {
      this.toastr.warning("Please Select Units!", "Required", {
        progressBar: true,
        closeButton: true
      });
      return
    }

    let url = '/Agreement/postownershiptransfer';
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
  }

  GetLovs() {

    let url = '/MasterData/GetLovs?Form=SaleAgreement';
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {

          this.AttachmentTypeListValues = result.data.filter((item: any) => item.field === 'AttachmentType');
        } else {

          this.toastr.error(result.message, "Error", {
            progressBar: true,
            closeButton: true
          });
        }
      },
      error: (err: any) => { },
    });
  }
  clearForm() {
    this.submitted = false;
    this.isUpdate = false;
    this.form.reset();
    this.SelectedAgreement = {}
    this.form.patchValue({
      Id: 0,
      CreatedBy: parseInt(this.CurrentUserInfo.Id),
      UpdatedBy: parseInt(this.CurrentUserInfo.Id),
      CreatedDate: new Date(),
      UpdatedDate: new Date()
    });
    this.AttachmentsList = [];
  }

  GetAgreementList(Id: any = 0) {

    let url = '/Agreement/agreements?Id=' + Id;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          if (Id > 0) {
            this.SelectedAgreement = result.data[0];

            for (let i = 0; i < this.SelectedAgreement.agreementAttachments.length; i++) {
              if (this.SelectedAgreement.agreementAttachments[i].u_AttName) {
                debugger
                this.SelectedAgreement.agreementAttachments[i].FileURL2 = this.configService.config.baseUrl + this.SelectedAgreement.agreementAttachments[i].u_AttName;
              }
            }
            return;
          }
          this.AgreementList = result.data.filter(
            (item: any) => item.approvalStatus === 'Approved' && item.agType === 'Sales'
          );
          if (history.state && history.state.forward) {

            this.GettransferList(history.state.forward.data);
          }

        } else {

          this.toastr.error(result.message, "Error", {
            progressBar: true,
            closeButton: true
          });
        }
      },
      error: (err: any) => { },
    });
  }
  GetAgreementdetailstList(Id: any = 0, lineItems: any[] = []) {
    debugger
    let url = '/Agreement/agreementDetailforSubDocumentbyAgrid?agrId=' + Id;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          if (Id > 0) {
            debugger
            this.SelectedAgreement = result.data[0];
            // process lineItems safely here
            lineItems.forEach((element: any) => {
              let find = this.SelectedAgreement.agreementItems?.find(
                (m: any) => m.agrItemId == element.u_AgrItmId
              );
              if (find) {
                find.selected = true;
              }
            });
          }

        } else {

          this.toastr.error(result.message, "Error", {
            progressBar: true,
            closeButton: true
          });
        }
      },
      error: (err: any) => { },
    });
  }
  onDropdownChange(data: any, DDType: any, lineItems: any[] = []) {
    if (DDType == 'Agreements') {
      debugger
      let exist = this.AgreementList.find((m: any) => m.id == data);
      this.GetAgreementdetailstList(data, lineItems);
      if (exist) {
        let agTypeText = 'Sale';


        this.form.patchValue({
          AgreementType: agTypeText,
          U_BPCode: exist.u_BPCode,
          U_BPName: exist.name,
          U_CPName: exist.u_CPName,
          U_CustRefNo: exist.u_CustRefNo,
          U_Seri: null,
          U_Stauts: 1,

        });

        this.GetDocSeries(exist.u_AGType);
        // this.GetAgreementList(exist.id)
      }
    }
    if (DDType === 'Series') {
      let exist = this.SeriesList.find((m: any) => m.id == data);
      if (exist) {
        this.form.controls['U_DocNum'].setValue(exist.u_SNext)
      }
    }

  }
  switchTab(tabName: string, tabType: string) {
    if (tabType == 'header') {
      this.activeTab = tabName;
    }

  }
  GetDocSeries(agrId: any) {
    let url = `/MasterData/GetDocSeries?agrmntId=${agrId}&docType=5`;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.SeriesList = result.data;

        } else {

          this.toastr.error(result.message, "Error", {
            progressBar: true,
            closeButton: true
          });
        }
      },
      error: (err: any) => { },
    });
  }
  GetBusinessPartner($event: any = '') {

    let d = $event.term;
    if (d.length < 2) {
      return;
    }
    this.BPList = [];
    let url = '/MasterData/GetBusinessPartnerMasterData?CardCode=' + d;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.BPList = result.data;
        } else {

          this.toastr.error(result.message, "Error", {
            progressBar: true,
            closeButton: true
          });
        }
      },
      error: (err: any) => { },
    });
  }
  onBPChange(event: any) {

    let exist = this.BPList.find((m: any) => m.cardCode == event);

    if (exist) {
      this.form.patchValue({
        U_NBPName: exist.cardName,
        U_NCPerson: exist.contactPersonName,
        //SeriesName: exist.seriesName
      });
    }
  }
  checkUncheckAll() {
    this.SelectedAgreement.agreementItems.forEach((item: any) => {
      item.selected = this.masterSelected;
    });
  }
  isAllSelected() {
    this.masterSelected = this.SelectedAgreement.agreementItems.every(
      (item: any) => item.selected === true
    );
  }

  getSelectedIds() {
    return this.SelectedAgreement.agreementItems
      .filter((item: any) => item.selected)
      .map((item: any) => item.agrItemId);
  }
  async onFileChange(event: any, fileInputRef: HTMLInputElement) {
    const base64: any = await this._sharedHelper.preview(event.target.files, 'image');

    if (base64) {
      this.FileURL = base64; // Optional: For <img [src]="previewImage">
    } else {
      this.toastr.error("Invalid file. Only JPG/PNG under 10MB allowed.");
      if (fileInputRef) fileInputRef.value = '';
    }
  }
  AddRemoveAttachments(action: any, postdata: any) {

    if (action === 'add') {
      if (!this.AttachmentType || !this.Att_Description || !this.FileURL) {
        this.toastr.warning("All fields are required", "Warning");
        return;
      }
      let data = {
        u_UniqueName: this.AttachmentType,
        name: this.Att_Description,
        u_Path: this.FileURL,
        FileURL2: this.FileURL,
      }

      if (data.u_Path) {
        this.AttachmentsList.push(data);
        this.AttachmentType = "";
        this.Att_Description = "";
        this.FileURL = "";
      }


    } else {
      this.AttachmentsList = this.AttachmentsList.filter((item: any) => item !== postdata);
    }
  }

  GettransferList(data: any) {

    this.SeriesName = data.u_SeriesName;
    this.agrinfo = data.u_AGID + "-" + data.name
    this.AttachmentsList = data.attachements
    this.onDropdownChange(data.u_AGID, "Agreements", data.lineItems)
    //this.onDropdownChange(data.u_Seri,"Series")
    this.form.patchValue({
      Id: data.id,
      Name: data.name,
      U_Seri: data.u_Seri,
      U_DocNum: data.u_DocNum,
      U_AGID: data.u_AGID,

      U_NBP: data.u_NBP,
      U_NBPName: data.u_NBPName,
      U_NCPerson: data.u_NCPerson,
      U_NCustRefNo: data.u_NCustRefNo,
      U_TDate: data.u_TDate,
      U_Remarks: data.u_Remarks

    });


  }
}