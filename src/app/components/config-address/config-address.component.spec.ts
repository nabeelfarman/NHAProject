import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddressComponent } from './config-address.component';

describe('ConfigAddressComponent', () => {
  let component: ConfigAddressComponent;
  let fixture: ComponentFixture<ConfigAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
