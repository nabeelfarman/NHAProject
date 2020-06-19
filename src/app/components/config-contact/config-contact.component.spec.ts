import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigContactComponent } from './config-contact.component';

describe('ConfigContactComponent', () => {
  let component: ConfigContactComponent;
  let fixture: ComponentFixture<ConfigContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
