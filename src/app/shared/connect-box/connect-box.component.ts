import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';
@Component({
  selector: 'app-connect-box',
  templateUrl: './connect-box.component.html',
  styleUrls: ['./connect-box.component.scss']
})
export class ConnectBoxComponent implements OnInit {
  @ViewChild('scrollMe') public myScrollContainer: ElementRef;
  showChat = true;
  time = new Date();
  numbers = Array(50).fill(0);
  options = { autoHide: false };
  activeRoute = 'dashboard';
  navigations = [{
    label: 'Dashboard',
    icon: 'dashboard',
    route: 'dashboard'
  }, {
    label: 'Order Status',
    icon: 'newspaper',
    route: 'order-status'
  }, {
    label: 'ETD Ticket',
    icon: 'ticket',
    route: 'etd-status'
  }, {
    label: 'Claim Status',
    icon: 'package'
  }, {
    label: 'Price Inquiry',
    icon: 'wallet'
  }, {
    label: 'Stock Inquiry',
    icon: 'card'
  }, {
    label: 'FAQs',
    icon: 'question',
    route: 'faq'
  }];
  conversation: Array<any> = [];
  userSearch = '';
  placeholder = '';
  disabled = false;
  data: Array<any> = [];
  itemStatus: Array<any> = [];
  text: Array<any> = [];
  showMail = false;
  @Output() toggled = new EventEmitter();
  constructor(private router: Router, private http: HttpClient) {
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.url.split('/')[1];
    });
  }

  ngOnInit(): void {
    this.http.get('./../assets/json/DetailedOrderlist.json').subscribe((j: Array<any>) => {
      this.data = j;
    });
    this.http.get('./../assets/json/StatusDetails.json').subscribe((j: Array<any>) => {
      this.itemStatus = j;
    });
    this.http.get('./../assets/json/text.json').subscribe((j: Array<any>) => {
      this.text = j;
    });
  }

  toggle() {
    this.showChat = !this.showChat;
    this.toggled.emit(!this.showChat);
  }

  navigate(nav) {
    // this.showChat = true;
    if (nav && nav.route) {
      if (nav.route === 'order-status') {
        this.conversation.push({
          type: 0,
          timestamp: new Date(),
          message: 'Provide Order and Item Number.'
        });
      }
      this.router.navigate([nav.route]);
    }
  }

  search() {
    const self = this;
    const keyword = self.userSearch;
    self.userSearch = '';
    const scroller: any = this.myScrollContainer;
    if (keyword) {
      this.placeholder = 'Bot is Typing...';
      self.conversation.push({
        type: 1,
        timestamp: new Date(),
        message: keyword
      });
      self.scroll();
      window.setTimeout(() => {
        const num: Array<string> = keyword.match(/\d+/g);
        if (num && num.length) {
          const filtered = self.filter(num);
          self.conversation.push({
            type: 0,
            timestamp: new Date(),
            message: num.length > 1 ? `Order No: ${num[0]} <br> Item No: ${num[1]}` : `Order No: ${num[0]}`
          });
          if (filtered && filtered.length) {
            if (num.length > 1) {
              const itemStatus = _.filter(self.itemStatus, (itm) => {
                return itm['Order Number'] === Number(num[0])
                  && itm['Item Number'] === Number(num[1])
                  && itm['Status Representation'] !== 'G';
              });
              const itemStatusOk = _.filter(self.itemStatus, (itm) => {
                return itm['Order Number'] === Number(num[0])
                  && itm['Item Number'] === Number(num[1])
                  && itm['Status Representation'] === 'G';
              });
              const txtI = itemStatus && itemStatus.length ? itemStatus[0] : { };
              let ref;
              if (txtI && txtI.TEXT_REF) {
                ref = self.text.find(t => t['Text ID'] === txtI.TEXT_REF).Text;
              } else {
                ref = self.text.find(t => t['Text ID'] === itemStatusOk[itemStatusOk.length - 1].TEXT_REF).Text;
              }
              self.conversation.push({
                type: 0,
                timestamp: new Date(),
                message: ref
              });
              self.router.navigate(['/order-status', num[0], num[1]]);
            } else {
              self.router.navigate(['/order-status', num[0]]);
            }
          } else {
            self.noDataError();
          }
        } else {
          self.conversation.push({
            type: 0,
            timestamp: new Date(),
            message: 'Order or Item Number is missing. Retry'
          });
        }
        self.placeholder = '';
        self.scroll();
      }, 2000);
    }
  }

  filter(num) {
    const s: any = {};
    let result = [];
    if (num) {
      if (num.length > 1) {
        s.OrderNumber = Number(num[0]);
        s.ItemNumber = Number(num[1]);
      } else {
        s.OrderNumber = Number(num[0]);
      }
      result = _.filter(this.data, s);
    }
    return result;
  }

  noDataError() {
    const self = this;
    self.conversation.push({
      type: 0,
      timestamp: new Date(),
      message: 'No Matching item found for the search.'
    });
    self.scroll();
  }

  scroll() {
    const scroller: any = this.myScrollContainer;
    window.setTimeout(() => {
      scroller.SimpleBar.getScrollElement().scrollTop = scroller.SimpleBar.getScrollElement().scrollHeight + 100;
    }, 10);
  }

}
