export type Occurrence = 'One Time' | 'OT' | 'Based On Plan';

export interface UtilityItem {
  u_Occurance: Occurrence;
  amountAfterTax: number;
}

export interface PlanRow {
  id: number;
  name: string;
  date: Date;
  amtBeforeTax: number;
  tax: number;
  amtAfterTax: number;
  percentage: number;
  utilAmt: number;
}

export interface PlanConfig {
  startDate: Date;
  endDate: Date;
  planType: string;
  totalAmount: number;
  taxRate: number;
  utilities: UtilityItem[];
}

export class PaymentPlanGenerator {
  rows: PlanRow[] = [];

  constructor(private config: PlanConfig) {}

  generate(): PlanRow[] {
    const { startDate, endDate, planType, totalAmount, taxRate, utilities } = this.config;

    if (!startDate || !endDate || !planType || totalAmount == null) return [];

    // Clear previous rows
    this.rows = [];

    // Custom plan
    if (planType === 'Customized') {
      this.rows.push(this.createRow(1, totalAmount, taxRate, 100));
      this.applyUtilities();
      return this.rows;
    }

    // Determine dates based on plan
    const dates: Date[] = this.calculateDates(startDate, endDate, planType);

    // Distribute amounts equally (before tax)
    const perRowAmt = parseFloat((totalAmount / dates.length).toFixed(2));
    dates.forEach((d, i) => {
      this.rows.push(this.createRow(i + 1, perRowAmt, taxRate, parseFloat(((perRowAmt / totalAmount) * 100).toFixed(2)), d));
    });

    // Apply utilities
    this.applyUtilities();

    // Finalize percentages (sum = 100%)
    this.finalizePercentages(totalAmount);

    return this.rows;
  }

  private calculateDates(start: Date, end: Date, plan: string): Date[] {
    const dates: Date[] = [];
    switch (plan) {
      case 'Annually': this.pushDatesByMonths(dates, start, end, 12); break;
      case 'Semi-Annually': this.pushDatesByMonths(dates, start, end, 6); break;
      case 'Quarterly': this.pushDatesByMonths(dates, start, end, 3); break;
      case 'Monthly': this.pushDatesByMonths(dates, start, end, 1); break;
      case 'One Time': dates.push(start); break;
      case 'Month Days': this.pushDatesByMonthsWithDayWeights(dates, start, end); break;
      default: this.pushDatesByMonths(dates, start, end, 1);
    }
    return dates;
  }

  private createRow(index: number, amtBeforeTax: number, taxRate: number, percentage: number, date?: Date): PlanRow {
    const tax = +(amtBeforeTax * taxRate / 100).toFixed(2);
    return {
      id: index,
      name: `Row ${index}`,
      date: date || new Date(),
      amtBeforeTax,
      tax,
      amtAfterTax: +(amtBeforeTax + tax).toFixed(2),
      percentage,
      utilAmt: 0
    };
  }

  private finalizePercentages(totalAmount: number) {
    let sumPct = this.rows.reduce((sum, r) => sum + r.percentage, 0);
    const diff = parseFloat((100 - sumPct).toFixed(2));
    if (this.rows.length > 0) {
      this.rows[this.rows.length - 1].percentage += diff;
    }
  }

  private applyUtilities() {
    const utilities = this.config.utilities;
    if (!utilities || !this.rows.length) return;

    const count = this.rows.length;

    utilities.forEach(u => {
      if (u.u_Occurance === 'One Time' || u.u_Occurance === 'OT') {
        this.rows[0].utilAmt += u.amountAfterTax;
        this.rows[0].amtAfterTax += u.amountAfterTax;
      } else if (u.u_Occurance === 'Based On Plan') {
        const perRow = u.amountAfterTax / count;
        this.rows.forEach(r => {
          r.utilAmt += perRow;
          r.amtAfterTax += perRow;
        });
      }
    });

    // Round last row to account for decimal leftovers
    const totalOriginal = this.rows.reduce((sum, r) => sum + r.amtAfterTax, 0);
    const totalRounded = this.rows.reduce((sum, r) => sum + Math.floor(r.amtAfterTax), 0);
    const remainder = totalOriginal - totalRounded;
    this.rows[count - 1].amtAfterTax += remainder;
  }

  private pushDatesByMonths(arr: Date[], start: Date, end: Date, gap: number) {
    const current = new Date(start);
    while (current <= end) {
      arr.push(new Date(current));
      current.setMonth(current.getMonth() + gap);
    }
  }

  private pushDatesByMonthsWithDayWeights(arr: Date[], start: Date, end: Date) {
    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const months: { date: Date; days: number }[] = [];
    while (current <= end) {
      const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
      months.push({ date: new Date(current), days: daysInMonth });
      current.setMonth(current.getMonth() + 1);
    }

    const totalDays = months.reduce((sum, m) => sum + m.days, 0);
    months.forEach((m, i) => {
      let amt = (this.config.totalAmount * m.days) / totalDays;
      amt = parseFloat(amt.toFixed(2));
      if (i === months.length - 1) {
        const sumSoFar = arr.reduce((s:any, r:any) => s + r.amtBeforeTax, 0);
        amt += parseFloat((this.config.totalAmount - sumSoFar - amt).toFixed(2));
      }
      arr.push(new Date(m.date));
    });
  }
}
