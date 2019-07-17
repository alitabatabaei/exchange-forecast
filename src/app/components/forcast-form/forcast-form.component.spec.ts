import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcastFormComponent } from './forcast-form.component';

describe('ForcastFormComponent', () => {
  let component: ForcastFormComponent;
  let fixture: ComponentFixture<ForcastFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcastFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcastFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
