import { Component, HostListener, OnInit } from '@angular/core';
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
  selectedOverviewFilter: string = 'Approved';
  overviewFilterOptions: string[] = ['Approved', 'Pending', 'Rejected', 'Pending Ejar', 'Expire in 3 Month'];
  isOverviewFilterOpen = false;
  overviewChartMonths: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  overviewChartBars: Array<{ label: string; value: number; active: boolean }> = [];

  // Search & Dynamic Units Property Section
  loadingProperties: boolean = false;
  searchPropertyName: string = '';
  allProperties: any[] = [];
  rawUnitsList: any[] = [];

  // Slick Slider Properties
  itemsPerPage: number = 3;
  currentSlide: number = 0;
  touchStartX: number = 0;

  staticImages: string[] = [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  ];

  initialFeaturedProperties: any[] = [
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      badges: ['FEATURED', 'FOR SALE', 'NEW'],
      price: 'PKR 4.5 Crore',
      type: 'Villa',
      title: 'Modern 5-Bed Luxury Villa with Private Pool',
      location: 'DHA Phase 6, Block L, Lahore',
      beds: 5,
      baths: 6,
      sqft: '5,400 sqf',
      pills: ['Corner Plot', 'Park Facing', '+2'],
      agent: 'ZP',
      agentName: 'Zameen Premier',
      status: '2 hours ago',
      accent: 'purple'
    },
    {
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      badges: ['FEATURED', 'FOR RENT'],
      price: 'AED 125,000',
      type: 'Apartment',
      title: 'Spacious 3-Bed Apartment with Full Sea View',
      location: 'Marina Walk, Tower 4, Dubai',
      beds: 3,
      baths: 3,
      sqft: '2,100 sqft',
      pills: ['Sea View', 'Balcony', 'Furnished'],
      agent: 'BC',
      agentName: 'Bayut Certified',
      status: '1 day ago',
      accent: 'pink'
    },
    {
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      badges: ['FOR SALE'],
      price: 'PKR 2.85 Crore',
      type: 'House',
      title: '10 Marla Double-Storey House — Prime Location',
      location: 'Bahria Town Phase 7, Rawalpindi',
      beds: 4,
      baths: 3,
      sqft: '2,250 sqft',
      pills: ['Double Story', 'Main Boulevard'],
      agent: 'BP',
      agentName: 'Bahria Properties',
      status: '3 days ago',
      accent: 'blue'
    }
  ];

  featuredProperties: any[] = [];

  constructor(
    private chartsData: DashboardChartsData,
    private toastr: ToastrService,
    private _service: SharedService,
  ) {
    this.allProperties = [...this.initialFeaturedProperties];
    this.featuredProperties = [...this.allProperties];
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

  @HostListener('window:resize')
  onResize(): void {
    this.updateItemsPerPage();
  }

  ngOnInit(): void {
    this.updateItemsPerPage();
    this.initCharts();
    this.buildOverviewChart();
    // this.GetAgreementFilterList();
    this.GetSummary();
    this.GetUnits();
  }

  updateItemsPerPage(): void {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) {
        this.itemsPerPage = 1;
      } else if (width < 1200) {
        this.itemsPerPage = 2;
      } else {
        this.itemsPerPage = 3;
      }
      if (this.currentSlide > this.maxSlideIndex) {
        this.currentSlide = this.maxSlideIndex;
      }
    }
  }

  get maxSlideIndex(): number {
    return Math.max(0, this.featuredProperties.length - this.itemsPerPage);
  }

  canPrev(): boolean {
    return this.currentSlide > 0;
  }

  canNext(): boolean {
    return this.currentSlide < this.maxSlideIndex;
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.maxSlideIndex;
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.maxSlideIndex) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
  }

  goToPage(pageIndex: number): void {
    const target = pageIndex * this.itemsPerPage;
    this.currentSlide = Math.min(target, this.maxSlideIndex);
  }

  isPageActive(pageIndex: number): boolean {
    const activePage = Math.floor(this.currentSlide / this.itemsPerPage);
    return activePage === pageIndex;
  }

  getSlideDots(): number[] {
    const totalDots = Math.ceil(this.featuredProperties.length / this.itemsPerPage);
    return Array.from({ length: Math.max(0, totalDots) }, (_, i) => i);
  }

  getSlideTransform(): string {
    const stepPercent = 100 / this.itemsPerPage;
    return `translateX(-${this.currentSlide * stepPercent}%)`;
  }

  getSlideRangeText(): string {
    if (!this.featuredProperties.length) return '0 of 0';
    const start = this.currentSlide + 1;
    const end = Math.min(this.currentSlide + this.itemsPerPage, this.featuredProperties.length);
    return `${start} - ${end} of ${this.featuredProperties.length}`;
  }

  onTouchStart(e: TouchEvent): void {
    if (e.changedTouches && e.changedTouches.length) {
      this.touchStartX = e.changedTouches[0].screenX;
    }
  }

  onTouchEnd(e: TouchEvent): void {
    if (e.changedTouches && e.changedTouches.length) {
      const diff = this.touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }
  }

  initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.initCharts();
  }

  /**
   * Search current units dynamically using the same AdvanceUnitSearch API as advance-search.component.ts
   */
  GetUnits(searchPayload: any = {}): void {
    this.loadingProperties = true;

    const payload = {
      project: '',
      building: '',
      zone: '',
      subZone: '',
      propertyItemType: '',
      unitCategory: '',
      propertyStatus: '',
      floor: '',
      district: '',
      city: '',
      region: '',
      facingCode: '',
      Electricity: null,
      Water: null,
      Gas: null,
      Furnished: null,
      Basement: null,
      SwimmingPool: null,
      AC: null,
      FullKitchen: null,
      Elevator: null,
      OpenSpace: null,
      Garden: null,
      NearbyPark: null,
      fromBedrooms: null,
      toBedrooms: null,
      fromOtherRooms: null,
      toOtherRooms: null,
      fromWashRooms: null,
      toWashRooms: null,
      fromParkings: null,
      toParkings: null,
      fromServantQuarter: null,
      toServantQuarter: null,
      fromUnitSizeSQM: null,
      toUnitSizeSQM: null,
      fromAnnualRentSQM: null,
      toAnnualRentSQM: null,
      fromTotalRentPerYear: null,
      toTotalRentPerYear: null,
      fromLastRenovated: null,
      toLastRenovated: null,
      fromPropertyAge: null,
      toPropertyAge: null,
      ...searchPayload
    };

    const url = '/MasterData/AdvanceUnitSearch';
    this._service.Post(payload, url).subscribe({
      next: (result: any) => {
        this.loadingProperties = false;
        if (result && result.status && Array.isArray(result.data) && result.data.length > 0) {
          this.rawUnitsList = result.data;
          this.mapUnitsToProperties(result.data);
        } else {
          // If no dynamic data returned, fallback gracefully to initial properties
          if (!this.allProperties.length) {
            this.allProperties = [...this.initialFeaturedProperties];
            this.featuredProperties = [...this.allProperties];
          }
        }
      },
      error: (err: any) => {
        this.loadingProperties = false;
        console.error('Error fetching advance unit search in dashboard:', err);
        if (!this.allProperties.length) {
          this.allProperties = [...this.initialFeaturedProperties];
          this.featuredProperties = [...this.allProperties];
        }
      }
    });
  }

  /**
   * Maps units returned from /MasterData/AdvanceUnitSearch to property card structure
   */
  mapUnitsToProperties(units: any[]): void {
    const accents = ['purple', 'pink', 'blue', 'teal', 'yellow'];

    this.allProperties = units.map((u: any, index: number) => {
      // Images remain static as requested
      const image = this.staticImages[index % this.staticImages.length];

      // Badges
      const badges: string[] = [];
      const status = u.propertyStatus ? String(u.propertyStatus).trim() : 'Available';
      badges.push(status.toUpperCase());

      const salesPrice = Number(u.totalSalesPrice || u.salesPriceSQM);
      const rentPrice = Number(u.totalRentPerYear || u.u_TotalRentPerYear || u.annualRentSQM);

      if (salesPrice > 0) {
        badges.push('FOR SALE');
      } else if (rentPrice > 0) {
        badges.push('FOR RENT');
      }

      // Price Formatting
      let formattedPrice = 'Price on Request';
      if (!isNaN(salesPrice) && salesPrice > 0) {
        formattedPrice = 'SAR ' + salesPrice.toLocaleString();
      } else if (!isNaN(rentPrice) && rentPrice > 0) {
        formattedPrice = 'SAR ' + rentPrice.toLocaleString() + ' / yr';
      } else if (u.totalSalesPrice) {
        formattedPrice = String(u.totalSalesPrice);
      } else if (u.totalRentPerYear) {
        formattedPrice = String(u.totalRentPerYear);
      }

      // Type
      const type = u.unitCategoryName || u.u_PropertyItemType || 'Apartment';

      // Title (Property Name)
      const title = u.itemName || u.unitDetailName || (u.itemCode ? `Unit ${u.itemCode}` : 'Unit');

      // Location
      const locParts = [u.buildingName, u.projectName, u.city || u.district || u.region].filter(Boolean);
      const location = locParts.length ? locParts.join(', ') : (u.city || u.region || 'Prime Location');

      // Specs
      const beds = u.u_Bedrooms ?? u.bedrooms ?? 0;
      const baths = u.u_WashRooms ?? u.washrooms ?? 0;
      const sizeVal = u.unitSizeSQM ?? u.u_UnitSizeSQM;
      const sqft = sizeVal ? `${sizeVal} SQM` : '0 SQM';

      // Facilities Pills
      const pillsRaw: string[] = [];
      if (u.facingName) pillsRaw.push(`${u.facingName} Facing`);
      if (u.u_Furnished === 'Y' || u.furnished === 'Y') pillsRaw.push('Furnished');
      if (u.u_AC === 'Y' || u.ac === 'Y') pillsRaw.push('Central AC');
      if (u.u_SwmPool === 'Y' || u.swimmingPool === 'Y') pillsRaw.push('Swimming Pool');
      if (u.u_Garden === 'Y' || u.garden === 'Y') pillsRaw.push('Garden');
      if (u.u_Parkings) pillsRaw.push(`${u.u_Parkings} Parking`);
      else if (u.associatedParking) pillsRaw.push('Parking');
      if (u.floorName) pillsRaw.push(u.floorName);

      let pills: string[] = [];
      if (pillsRaw.length > 2) {
        pills = [pillsRaw[0], pillsRaw[1], `+${pillsRaw.length - 2}`];
      } else if (pillsRaw.length > 0) {
        pills = pillsRaw;
      } else {
        pills = ['Standard'];
      }

      // Agent
      const agentFullName = u.assignedToBP || 'Property Manager';
      const agentInitials = agentFullName.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'PM';

      // Time Status
      const timeStatus = u.propertyStatus ? String(u.propertyStatus) : 'Active';

      return {
        id: u.itemCode || index,
        code: u.itemCode || '',
        title,
        price: formattedPrice,
        type,
        location,
        city: u.city || u.district || '',
        beds,
        baths,
        sqft,
        badges,
        pills,
        agent: agentInitials,
        agentName: agentFullName,
        status: timeStatus,
        image,
        accent: accents[index % accents.length],
        raw: u
      };
    });

    this.onSearchPropertyChange();
  }

  /**
   * Filter properties by property name, code, location, or type
   */
  onSearchPropertyChange(): void {
    this.currentSlide = 0;
    const term = (this.searchPropertyName || '').trim().toLowerCase();
    if (!term) {
      this.featuredProperties = [...this.allProperties];
      return;
    }

    this.featuredProperties = this.allProperties.filter((item: any) => {
      const titleMatch = item.title && item.title.toLowerCase().includes(term);
      const locationMatch = item.location && item.location.toLowerCase().includes(term);
      const typeMatch = item.type && item.type.toLowerCase().includes(term);
      const codeMatch = item.code && item.code.toLowerCase().includes(term);
      const priceMatch = item.price && item.price.toLowerCase().includes(term);
      return titleMatch || locationMatch || typeMatch || codeMatch || priceMatch;
    });
  }

  clearSearch(): void {
    this.searchPropertyName = '';
    this.onSearchPropertyChange();
  }

  getPropertiesMeta(): string {
    if (this.searchPropertyName && this.searchPropertyName.trim()) {
      return `Results matching "${this.searchPropertyName.trim()}"`;
    }
    const locations = Array.from(new Set(this.allProperties.map(p => p.city).filter(Boolean)));
    const locText = locations.length > 0
      ? (locations.slice(0, 2).join(' • ') + (locations.length > 2 ? ` • +${locations.length - 2}` : ''))
      : 'All Locations';
    return `${locText} • All Statuses • All Types`;
  }

  GetAgreementFilterList(Id: any = 0) {
    let url = '/Agreement/agreements?agrType=' + Id;
    this._service.Get(url).subscribe({
      next: result => {
        if (result.status) {
          this.AgreementList = result.data;

          const mapping: { [key: number]: string } = {
            1: 'Sale',
            2: 'Rent',
            3: 'Maintenance',
            5: 'OffPlan'
          };

          const getApprovalStatus = (status: any): string => {
            if (typeof status === 'string') return status;
            switch (+status) {
              case 1: return 'Pending';
              case 2: return 'Approved';
              case 3: return 'Rejected';
              default: return 'Unknown';
            }
          };

          this.summary = this.AgreementList.reduce((acc: any, item: any) => {
            const agTypeName = mapping[item.u_AGType] || 'Unknown';
            const statusName = getApprovalStatus(item.approvalStatus);

            if (!acc[agTypeName]) {
              acc[agTypeName] = {
                total: 0,
                statuses: {}
              };
            }

            acc[agTypeName].total++;

            if (!acc[agTypeName].statuses[statusName]) {
              acc[agTypeName].statuses[statusName] = 0;
            }

            acc[agTypeName].statuses[statusName]++;

            return acc;
          }, {});

        }
      },
      error: (err: any) => { },
    });
  }

  getBadgeClass(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '-');
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
          this.buildOverviewChart();
          this.updateOverviewChart();
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

  toggleOverviewFilter(): void {
    this.isOverviewFilterOpen = !this.isOverviewFilterOpen;
  }

  applyOverviewFilter(filter: string): void {
    this.selectedOverviewFilter = filter;
    this.isOverviewFilterOpen = false;
    this.buildOverviewChart();
    this.updateOverviewChart();
  }

  buildOverviewChart(): void {
    const baseSeriesByFilter: { [key: string]: number[] } = {
      Approved: [28, 36, 42, 52, 48, 86, 58, 43, 54, 40, 34, 49],
      Pending: [22, 28, 31, 46, 41, 55, 62, 48, 40, 35, 31, 44],
      Rejected: [18, 20, 23, 25, 30, 36, 29, 27, 34, 26, 18, 21],
      'Pending Ejar': [12, 18, 24, 30, 29, 38, 34, 26, 32, 24, 19, 28],
      'Expire in 3 Month': [20, 25, 32, 41, 38, 58, 49, 44, 46, 36, 29, 42]
    };

    const activeMonthByFilter: { [key: string]: number } = {
      Approved: 5,
      Pending: 6,
      Rejected: 5,
      'Pending Ejar': 5,
      'Expire in 3 Month': 5
    };

    const source = baseSeriesByFilter[this.selectedOverviewFilter] || baseSeriesByFilter['Approved'];
    const activeIndex = activeMonthByFilter[this.selectedOverviewFilter] || 5;

    this.overviewChartBars = this.overviewChartMonths.map((label, index) => ({
      label,
      value: source[index] || 0,
      active: index === activeIndex
    }));
  }

  getSelectedOverviewTotal(): number {
    if (!Array.isArray(this.summaryData) || !this.summaryData.length) {
      return 0;
    }

    const filterKeyMap: { [key: string]: string } = {
      Approved: 'approved',
      Pending: 'pending',
      Rejected: 'rejected',
      'Pending Ejar': 'pendingEjar',
      'Expire in 3 Month': 'expiringIn3Months'
    };

    const key = filterKeyMap[this.selectedOverviewFilter] || 'approved';
    return this.summaryData.reduce((sum: number, item: any) => sum + (Number(item[key]) || 0), 0);
  }

  updateOverviewChart(): void {
    this.chartsData.updateFromSummary(this.summaryData, this.selectedOverviewFilter);
    this.mainChart = JSON.parse(JSON.stringify(this.chartsData.mainChart));
  }

}
