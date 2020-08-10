import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fuso';
  minimized = false;

  ngOnInit(): void {

  }
  toggle(event: boolean) {
    this.minimized = event;
  }
}
