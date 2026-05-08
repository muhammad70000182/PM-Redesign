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

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.css']
})
export class reportlistComponent implements OnInit, AfterViewInit {

   @ViewChild(DataTableDirective, { static: false })
    dtElement!: DataTableDirective;
  
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
    ReportsList: any;
    AllowedPermissions: any;
    datePickerConfig: any;
    bsInlineValue = new Date();
    LovsList: any;
    AgreementTypeListVlaues: any;
    AgreementList: any;
    GenericForma: { DateFormate: string; };
    currentStep: number = 1;
    totalSteps = 2;
    FileURL: any;
    constructor(
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private _service: SharedService,
      private _sharedHelper: SharedHelper,
      private labelHelper: FormLabelHelper,
      private el: ElementRef,
      private renderer: Renderer2,
      private _permService: PermissionsSharingService,
      private configService:ConfigService
    ) {
      this.AllowedPermissions = this._permService.getPermissions();
      this.datePickerConfig = this._sharedHelper.getDateConfiguration();
      this.GenericForma = this._sharedHelper.getGenericFormate();
    }
    ngAfterViewInit(): void {
      this.dtTrigger.next(null);
      this.labelHelper.markRequiredFields(this.form, this.el, this.renderer);
    }
  
    rerender(): void {
      if (!this.dtElement) return;
      this.dtElement.dtInstance?.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    }
  
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
    ngOnInit(): void {
  
     this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      ordering:false
    };
  
      this.GetReports();
    }
  
   
    GetReports() {
      let url = '/Reports/GetReports';
      this._service.Get(url).subscribe({
        next: result => {
          if (result.status) {
            this.ReportsList = result.data;
            this.ReportsList.forEach((element:any) => {
              element.rptURL = this.configService.config['rptURL']+'ReportViewer/CR_Viewer.aspx?ReportName='+element.fileURL
            });
            
            this.rerender();
          }
        },
        error: (err: any) => { },
      });
    }
   
    openReport(reporturl: string) {
    const url = reporturl;//`https://yourdomain.com/Reports/ReportViewer.aspx?id=${id}`;
    window.open(url, '_blank'); // _blank = new tab/window
  }
    
}