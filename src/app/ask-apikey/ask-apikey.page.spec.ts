import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskAPIKeyPage } from './ask-apikey.page';

describe('AskAPIKeyPage', () => {
  let component: AskAPIKeyPage;
  let fixture: ComponentFixture<AskAPIKeyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskAPIKeyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskAPIKeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
