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
    icon: 'ticket'
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
  @Output() toggled = new EventEmitter();
  constructor(private router: Router, private http: HttpClient) {
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.url;
    });
  }

  ngOnInit(): void {
    this.http.get('./../assets/json/DetailedOrderlist.json').subscribe((j: Array<any>) => {
      this.data = j;
    });
  }

  toggle() {
    this.showChat = !this.showChat;
    this.toggled.emit(!this.showChat);
  }

  navigate(nav) {
    this.showChat = true;
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
    if (keyword) {
      this.placeholder = 'Bot is Typing...';
      self.conversation.push({
        type: 1,
        timestamp: new Date(),
        message: keyword
      });
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
      }, 2000);
      const scroller: any = this.myScrollContainer;
      scroller.SimpleBar.getScrollElement().scrollTop = scroller.SimpleBar.getScrollElement().scrollHeight + 1000;
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
  }

}
