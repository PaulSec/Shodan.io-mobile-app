import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueriesPage } from './queries.page';

describe('QueriesPage', () => {
  let component: QueriesPage;
  let fixture: ComponentFixture<QueriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueriesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
