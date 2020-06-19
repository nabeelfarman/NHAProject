import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptUserComponent } from './rpt-user.component';

describe('RptUserComponent', () => {
  let component: RptUserComponent;
  let fixture: ComponentFixture<RptUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
