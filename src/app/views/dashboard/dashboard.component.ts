import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../_services/shared.service';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  AgreementList: any;
  dashboardTiles: any[] = [];
  summary: any = {};
  summaryData: any;
  SaleAgreementData: any;
  RentAgreementData: any;
  MaintenanceAgreementData: any;
  OffPlanAgreementData: any;
  totalExpiringIn3Months: any;
  totalPendingEjar: any;
  constructor(
    private chartsData: DashboardChartsData,
    private toastr: ToastrService,
    private _service: SharedService,
  ) {
  }

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/img/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/img/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/img/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/img/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/img/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/img/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];
  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  ngOnInit(): void {
    this.initCharts();
    // this.GetAgreementFilterList();
    this.GetSummary();
  }

  initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.initCharts();
  }
  GetAgreementFilterList(Id: any = 0) {

    let url = '/Agreement/agreements?agrType=' + Id;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.AgreementList = result.data;

          const data = this.AgreementList; // replace with your actual variable

          // Main logic to build summary
          const mapping: { [key: number]: string } = {
            1: 'Sale',
            2: 'Rent',
            3: 'Maintenance',
            5: 'OffPlan'
          };

          // Approval status mapping (optional, if your backend sends numeric codes)
          const getApprovalStatus = (status: any): string => {
            if (typeof status === 'string') return status; // already string like 'Approved'
            switch (+status) {
              case 1: return 'Pending';
              case 2: return 'Approved';
              case 3: return 'Rejected';
              default: return 'Unknown';
            }
          };

          // Main logic
          this.summary = this.AgreementList.reduce((acc: any, item: any) => {
            const agTypeName = mapping[item.u_AGType] || 'Unknown';
            const statusName = getApprovalStatus(item.approvalStatus);

            // initialize agreement type group
            if (!acc[agTypeName]) {
              acc[agTypeName] = {
                total: 0,
                statuses: {}
              };
            }

            // increment type total
            acc[agTypeName].total++;

            // initialize status count
            if (!acc[agTypeName].statuses[statusName]) {
              acc[agTypeName].statuses[statusName] = 0;
            }

            // increment status count
            acc[agTypeName].statuses[statusName]++;

            return acc;
          }, {});

        }
      },
      error: (err: any) => { },
    });
  }
  GetSummary() {

    let url = '/MasterData/GetDashboardSummary';
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.summaryData = result.data;
          this.totalExpiringIn3Months = 0;
          this.totalPendingEjar = 0;
          this.SaleAgreementData = this.summaryData.find((m: any) => m.agreementType === 'Sale');
          this.RentAgreementData = this.summaryData.find((m: any) => m.agreementType === 'Rent');
          this.MaintenanceAgreementData = this.summaryData.find((m: any) => m.agreementType === 'Maintenance');
          this.OffPlanAgreementData = this.summaryData.find((m: any) => m.agreementType === 'OffPlan');
          this.totalExpiringIn3Months = this.summaryData.reduce((sum: any, item: any) => sum + (item.expiringIn3Months || 0), 0);
          this.totalPendingEjar = this.summaryData.reduce((sum: any, item: any) => sum + (item.pendingEjar || 0), 0);
          this.chartsData.updateFromSummary(this.summaryData);
          // Create a new object reference to trigger change detection
          this.mainChart = JSON.parse(JSON.stringify(this.chartsData.mainChart));
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

}
