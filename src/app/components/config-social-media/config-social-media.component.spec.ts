import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSocialMediaComponent } from './config-social-media.component';

describe('ConfigSocialMediaComponent', () => {
  let component: ConfigSocialMediaComponent;
  let fixture: ComponentFixture<ConfigSocialMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigSocialMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigSocialMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
