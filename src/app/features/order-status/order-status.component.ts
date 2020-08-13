import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as timeline from '@amcharts/amcharts4/plugins/timeline';
import * as bullets from '@amcharts/amcharts4/plugins/bullets';

import * as moment from 'moment';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})

export class OrderStatusComponent implements OnInit {
  orders: Array<any> = [];
  tableHeaders = [{
    label: 'Order No',
    key: 'OrderNumber'
  }, {
    label: 'Item No',
    key: 'ItemNumber'
  }, {
    label: 'Material',
    key: 'MaterialNumber'
  }, {
    label: 'Description',
    key: 'MaterialDescription'
  }, {
    label: 'Quantity',
    key: 'Qty'
  }, {
    label: 'Unit',
    key: 'Unit'
  }, {
    label: 'Desc',
    key: 'OrderStatusDescription'
  }, {
    label: 'Status',
    key: 'StatusRepresentation'
  }];
  tableData: Array<any> = [];
  orderList: Array<any> = [];
  OrderNumber;
  ItemNumber;
  filterName;
  constructor(private http: HttpClient, private router: Router, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.actRoute.params.subscribe(params => {
      this.OrderNumber = params.orderNumber;
      this.ItemNumber = params.itemNumber;
      this.load();
    });
    this.actRoute.queryParams.subscribe(qp => {
      this.load(qp.s);
    });
  }

  load(query?) {
    const self = this;
    const { OrderNumber, ItemNumber } = self;
    self.http.get('./../assets/json/DetailedOrderlist.json').subscribe((j: Array<any>) => {
      const statusGroup = _.groupBy(j, 'OrderStatusDescription');
      self.orders = [];
      for (const s in statusGroup) {
        if (statusGroup[s].length) {
          self.orders.push({
            Status: s,
            Count: statusGroup[s].length
          });
        }
      }
      self.createBar();
      j.forEach(o => o.OrderDate = moment(o.OrderDate).format());
      j = _.orderBy(j, ['OrderDate']);
      self.orderList = j;
      self.tableData = self.orderList.filter((o, i) => i < 10);
      // conditions
      if (OrderNumber && ItemNumber) {
        am4core.ready(() => {
          window.setTimeout(() => {
            const filteredList = _.filter(self.orderList, { OrderNumber: Number(OrderNumber), ItemNumber: Number(ItemNumber) });
            self.orderFlow(self);
          }, 500);
        });
      }
      if (OrderNumber && !ItemNumber) {
        const filteredList = _.filter(self.orderList, { OrderNumber: Number(OrderNumber) });
        const filteredGroup = _.groupBy(filteredList, 'OrderStatusDescription');
        self.orders = [];
        for (const s in filteredGroup) {
          if (filteredGroup[s].length) {
            self.orders.push({
              Status: s,
              Count: filteredGroup[s].length
            });
          }
        }
        self.createBar();
        self.tableData = filteredList.filter((o, i) => i < 10);
      }
      if (query) {
        self.filterTable(query);
      }
    });
  }

  filterTable(OrderStatusDescription) {
    const self = this;
    self.filterName = OrderStatusDescription;
    const search: any = {
      OrderStatusDescription
    };
    const { OrderNumber, ItemNumber } = self;
    if (OrderNumber) {
      search.OrderNumber = Number(OrderNumber);
    }
    if (ItemNumber) {
      search.ItemNumber = Number(ItemNumber);
    }
    const filter = _.filter(self.orderList, search);
    self.tableData = filter.filter((o, i) => i < 10);
  }

  createBar() {
    // Create chart instance
    const self = this;
    const chart: any = am4core.create('graphic', am4charts.XYChart3D);
    chart.logo.disabled = true;

    chart.data = this.orders;
    chart.fontSize = 14;

    // Create axes
    const categoryAxis: any = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'Status';
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = 'middle';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.tooltip.label.rotation = 270;
    categoryAxis.tooltip.label.horizontalCenter = 'right';
    categoryAxis.tooltip.label.verticalCenter = 'middle';

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Order Status';
    valueAxis.title.fontWeight = 'bold';

    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = 'Count';
    series.dataFields.categoryX = 'Status';
    series.name = 'Count';
    series.tooltipText = '{categoryX}: [bold]{valueY}[/]';
    series.columns.template.fillOpacity = .8;
    series.columns.template.events.on('hit', (ev) => {
      console.log('clicked on ', ev.target);
      self.filterTable(ev.target.dataItem.categoryX);
    }, this);

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 0.5;
    columnTemplate.stroke = am4core.color('#FFFFFF');

    columnTemplate.adapter.add('fill', (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    columnTemplate.adapter.add('stroke', (stroke, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

  }

  gotoOrder({ OrderNumber, ItemNumber }) {
    this.router.navigate(['/order-status', OrderNumber, ItemNumber]);
  }

  orderFlow(self) {
    const chart: any = am4core.create('timeline', timeline.CurveChart);
    chart.curveContainer.padding(100, 20, 50, 20);
    chart.maskBullets = false;


    const colorSet = new am4core.ColorSet();

    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm';
    chart.dateFormatter.dateFormat = 'HH';

    chart.data = [{
      category: '',
      start: '2019-01-10 06:00',
      end: '2019-01-10 06:15',
      color: colorSet.getIndex(15),
      icon: '',
      text: 'Wake up!'
    }, {
      category: '',
      start: '2019-01-10 06:15',
      end: '2019-01-10 06:30',
      color: colorSet.getIndex(14),
      icon: '',
      text: 'Drink water'
    },
    {
      category: '',
      start: '2019-01-10 06:30',
      end: '2019-01-10 07:00',
      color: colorSet.getIndex(13),
      icon: '',
      text: 'Exercise'
    },
    {
      category: '',
      start: '2019-01-10 07:00',
      end: '2019-01-10 07:30',
      color: colorSet.getIndex(12),
      icon: '',
      text: 'Have breakfast'
    }];

    chart.fontSize = 10;
    chart.tooltipContainer.fontSize = 10;

    const categoryAxis: any = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.paddingRight = 25;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.innerRadius = 10;
    categoryAxis.renderer.radius = 30;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());


    dateAxis.renderer.points = self.getPoints();


    dateAxis.renderer.autoScale = false;
    dateAxis.renderer.autoCenter = false;
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.baseInterval = { count: 5, timeUnit: 'minute' };
    dateAxis.renderer.tooltipLocation = 0;
    dateAxis.renderer.line.strokeDasharray = '1,4';
    dateAxis.renderer.line.strokeOpacity = 0.5;
    dateAxis.tooltip.background.fillOpacity = 0.2;
    dateAxis.tooltip.background.cornerRadius = 5;
    dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor('alternativeBackground');
    dateAxis.tooltip.label.paddingTop = 7;
    dateAxis.endLocation = 0;
    dateAxis.startLocation = -0.5;
    dateAxis.min = new Date(2019, 0, 9, 23, 55).getTime();
    dateAxis.max = new Date(2019, 0, 10, 16, 10).getTime();

    const labelTemplate = dateAxis.renderer.labels.template;
    labelTemplate.verticalCenter = 'top';
    labelTemplate.fillOpacity = 0.6;
    labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor('background');
    labelTemplate.background.fillOpacity = 1;
    labelTemplate.fill = new am4core.InterfaceColorSet().getFor('text');
    labelTemplate.padding(7, 7, 7, 7);

    const series: any = chart.series.push(new timeline.CurveColumnSeries());
    series.columns.template.height = am4core.percent(30);

    series.dataFields.openDateX = 'start';
    series.dataFields.dateX = 'end';
    series.dataFields.categoryY = 'category';
    series.baseAxis = categoryAxis;
    series.columns.template.propertyFields.fill = 'color'; // get color from data
    series.columns.template.propertyFields.stroke = 'color';
    series.columns.template.strokeOpacity = 0;
    series.columns.template.fillOpacity = 0.6;

    const imageBullet1 = series.bullets.push(new bullets.PinBullet());
    imageBullet1.background.radius = 18;
    imageBullet1.locationX = 1;
    imageBullet1.propertyFields.stroke = 'color';
    imageBullet1.background.propertyFields.fill = 'color';
    imageBullet1.image = new am4core.Image();
    imageBullet1.image.propertyFields.href = 'icon';
    imageBullet1.image.scale = 0.7;
    imageBullet1.circle.radius = am4core.percent(100);
    imageBullet1.background.fillOpacity = 0.8;
    imageBullet1.background.strokeOpacity = 0;
    imageBullet1.dy = -2;
    imageBullet1.background.pointerBaseWidth = 10;
    imageBullet1.background.pointerLength = 10;
    imageBullet1.tooltipText = '{text}';

    series.tooltip.pointerOrientation = 'up';

    imageBullet1.background.adapter.add('pointerAngle', (value, target) => {
      if (target.dataItem) {
        const position = dateAxis.valueToPosition(target.dataItem.openDateX.getTime());
        return dateAxis.renderer.positionToAngle(position);
      }
      return value;
    });

    const hs = imageBullet1.states.create('hover');
    hs.properties.scale = 1.3;
    hs.properties.opacity = 1;

    const textBullet = series.bullets.push(new am4charts.LabelBullet());
    textBullet.label.propertyFields.text = 'text';
    textBullet.disabled = true;
    textBullet.propertyFields.disabled = 'textDisabled';
    textBullet.label.strokeOpacity = 0;
    textBullet.locationX = 1;
    textBullet.dy = - 100;
    textBullet.label.textAlign = 'middle';

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.align = 'center';
    chart.scrollbarX.width = am4core.percent(75);
    chart.scrollbarX.parent = chart.curveContainer;
    chart.scrollbarX.height = 300;
    chart.scrollbarX.orientation = 'vertical';
    chart.scrollbarX.x = 128;
    chart.scrollbarX.y = -140;
    chart.scrollbarX.isMeasured = false;
    chart.scrollbarX.opacity = 0.5;

    const cursor = new timeline.CurveCursor();
    chart.cursor = cursor;
    cursor.xAxis = dateAxis;
    cursor.yAxis = categoryAxis;
    cursor.lineY.disabled = true;
    cursor.lineX.disabled = true;

    dateAxis.renderer.tooltipLocation2 = 0;
    categoryAxis.cursorTooltipEnabled = false;

    chart.zoomOutButton.disabled = true;

    chart.events.on('inited', () => {
      setTimeout(() => {
        self.hoverItem(self, series.dataItems.getIndex(0), imageBullet1, series);
      }, 2000);
    });


  }

  hoverItem(self, dataItem, imageBullet1, series) {
    let previousBullet;
    const bullet = dataItem.bullets.getKey(imageBullet1.uid);
    let index = dataItem.index;

    if (index >= series.dataItems.length - 1) {
      index = -1;
    }

    if (bullet) {

      if (previousBullet) {
        previousBullet.isHover = false;
      }

      bullet.isHover = true;

      previousBullet = bullet;
    }
    setTimeout(() => {
      self.hoverItem(self, series.dataItems.getIndex(index + 1), imageBullet1, series);
    }, 1000);
  }


  getPoints() {
    const points = [{ x: -1300, y: 200 }, { x: 0, y: 200 }];

    const w = 400;
    const h = 400;
    const levelCount = 4;

    const radius = am4core.math.min(w / (levelCount - 1) / 2, h / 2);
    const startX = radius;

    for (let i = 0; i < 25; i++) {
      const angle = 0 + i / 25 * 90;
      const centerPoint = { y: 200 - radius, x: 0 };
      points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
    }


    for (let i = 0; i < levelCount; i++) {

      if (i % 2 !== 0) {
        points.push({ y: -h / 2 + radius, x: startX + w / (levelCount - 1) * i });
        points.push({ y: h / 2 - radius, x: startX + w / (levelCount - 1) * i });

        const centerPoint = { y: h / 2 - radius, x: startX + w / (levelCount - 1) * (i + 0.5) };
        if (i < levelCount - 1) {
          for (let k = 0; k < 50; k++) {
            const angle = -90 + k / 50 * 180;
            points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
          }
        }

        if (i === levelCount - 1) {
          points.pop();
          points.push({ y: -radius, x: startX + w / (levelCount - 1) * i });
          const cp1 = { y: -radius, x: startX + w / (levelCount - 1) * (i + 0.5) };
          for (let k = 0; k < 25; k++) {
            const angle = -90 + k / 25 * 90;
            points.push({ y: cp1.y + radius * am4core.math.cos(angle), x: cp1.x + radius * am4core.math.sin(angle) });
          }
          points.push({ y: 0, x: 1300 });
        }

      } else {
        points.push({ y: h / 2 - radius, x: startX + w / (levelCount - 1) * i });
        points.push({ y: -h / 2 + radius, x: startX + w / (levelCount - 1) * i });
        const cp2 = { y: -h / 2 + radius, x: startX + w / (levelCount - 1) * (i + 0.5) };
        if (i < levelCount - 1) {
          for (let k = 0; k < 50; k++) {
            const angle = -90 - k / 50 * 180;
            points.push({ y: cp2.y + radius * am4core.math.cos(angle), x: cp2.x + radius * am4core.math.sin(angle) });
          }
        }
      }
    }

    return points;
  }

}
