import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectBoxComponent } from './connect-box.component';

describe('ConnectBoxComponent', () => {
  let component: ConnectBoxComponent;
  let fixture: ComponentFixture<ConnectBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
