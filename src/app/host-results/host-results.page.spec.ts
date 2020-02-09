import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostResultsPage } from './host-results.page';

describe('HostResultsPage', () => {
  let component: HostResultsPage;
  let fixture: ComponentFixture<HostResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostResultsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
