import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiarieComponent } from './subsidiarie.component';

describe('SubsidiarieComponent', () => {
  let component: SubsidiarieComponent;
  let fixture: ComponentFixture<SubsidiarieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiarieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiarieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
