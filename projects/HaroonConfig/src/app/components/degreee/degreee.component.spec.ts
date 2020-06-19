import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeeComponent } from './degreee.component';

describe('DegreeeComponent', () => {
  let component: DegreeeComponent;
  let fixture: ComponentFixture<DegreeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DegreeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
