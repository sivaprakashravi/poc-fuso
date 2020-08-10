import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-connect-box',
  templateUrl: './connect-box.component.html',
  styleUrls: ['./connect-box.component.scss']
})
export class ConnectBoxComponent implements OnInit {
  showChat = true;
  time = new Date();
  numbers = Array(50).fill(0);
  options = { autoHide: false };
  navigations = [{
    label: 'Order Status',
    icon: 'newspaper'
  }, {
    label: 'ETA Ticket',
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
    icon: 'question'
  }];
  @Output() toggled = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  toggle() {
    this.showChat = !this.showChat;
    this.toggled.emit(!this.showChat);
  }

}
