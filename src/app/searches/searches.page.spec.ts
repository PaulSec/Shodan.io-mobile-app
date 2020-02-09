import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchesPage } from './searches.page';

describe('SearchesPage', () => {
  let component: SearchesPage;
  let fixture: ComponentFixture<SearchesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
