import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtdComponent } from './etd.component';

describe('EtdComponent', () => {
  let component: EtdComponent;
  let fixture: ComponentFixture<EtdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
