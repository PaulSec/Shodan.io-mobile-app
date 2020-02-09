import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySearchesPage } from './my-searches.page';

describe('MySearchesPage', () => {
  let component: MySearchesPage;
  let fixture: ComponentFixture<MySearchesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySearchesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySearchesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
