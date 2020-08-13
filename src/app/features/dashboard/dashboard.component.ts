import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import * as moment from 'moment';
import * as _ from 'lodash';
import { Router } from '@angular/router';
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  orders = [{
    name: 'Credit Block',
    value: '12'
  }, {
    name: 'Delivery Block',
    value: '04'
  }, {
    name: 'Spike Order',
    value: '07'
  }, {
    name: 'Back Order (BO)',
    value: '36'
  }, {
    name: 'Cancelled',
    value: '05'
  }, {
    name: 'Unpacked',
    value: '45'
  }, {
    name: 'Packed',
    value: '78'
  }, {
    name: 'Pending  for GD Release',
    value: '00'
  }];
  tableHeaders = [{
    label: 'Order No',
    key: 'OrderNumber'
  }, {
    label: 'Date',
    key: 'OrderDate'
  }, {
    label: 'Customer No',
    key: 'CustomerNumber'
  }, {
    label: 'Status',
    key: 'OrderStatusDescription'
  }];
  tableData: Array<any> = [];
  orderList: Array<any> = [];
  etdStatus: Array<any> = [];
  activeOrder = '';
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get('./../assets/json/FirstPageHeadOrderList.json').subscribe((j: Array<any>) => {
      this.tableData = j;
    });
    this.http.get('./../assets/json/StatusTable.json').subscribe((j: Array<any>) => {
      this.orders = j;
    });
    this.http.get('./../assets/json/ETDStatusCount.json').subscribe((j: Array<any>) => {
      this.etdStatus = j;
      this.createChart();
    });
  }

  createChart() {
    // Create chart instance
    const chart: any = am4core.create('graphic', am4charts.RadarChart);
    chart.logo.disabled = true;
    // Add data
    const max = _.maxBy(this.etdStatus, 'value');
    this.etdStatus = _.each(this.etdStatus, x => x.full = max.value);
    chart.data = this.etdStatus;

    // Make chart not full circle
    chart.startAngle = -90;
    chart.endAngle = 180;
    chart.innerRadius = am4core.percent(20);

    // Set number format
    chart.numberFormatter.numberFormat = '#';

    // Create axes
    const categoryAxis: any = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.fontWeight = '500';
    categoryAxis.renderer.labels.template.adapter.add('fill', (fill, target) => {
      return (target.dataItem.index >= 0) ? chart.colors.getIndex(target.dataItem.index) : fill;
    });
    categoryAxis.renderer.minGridDistance = 10;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.max = max;
    valueAxis.strictMinMax = true;

    // Create series
    const series1: any = chart.series.push(new am4charts.RadarColumnSeries());
    series1.dataFields.valueX = 'full';
    series1.dataFields.categoryY = 'category';
    series1.clustered = false;
    series1.columns.template.fill = new am4core.InterfaceColorSet().getFor('alternativeBackground');
    series1.columns.template.fillOpacity = 0.08;
    series1.columns.template.cornerRadiusTopLeft = 20;
    series1.columns.template.strokeWidth = 0;
    series1.columns.template.radarColumn.cornerRadius = 20;

    const series2 = chart.series.push(new am4charts.RadarColumnSeries());
    series2.dataFields.valueX = 'value';
    series2.dataFields.categoryY = 'category';
    series2.clustered = false;
    series2.columns.template.strokeWidth = 0;
    series2.columns.template.tooltipText = '{category}: [bold]{value}[/]';
    series2.columns.template.radarColumn.cornerRadius = 20;

    series2.columns.template.adapter.add('fill', (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Add cursor
    chart.cursor = new am4charts.RadarCursor();
  }

  filter(order) {
    this.router.navigate(['order-status'], { queryParams: { s: order.Status } });
  }

  gotoOrder({ OrderNumber }) {
    this.router.navigate(['/order-status', OrderNumber]);
  }

}
