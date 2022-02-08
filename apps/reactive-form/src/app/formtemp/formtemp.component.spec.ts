import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormtempComponent } from './formtemp.component';

describe('FormtempComponent', () => {
  let component: FormtempComponent;
  let fixture: ComponentFixture<FormtempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormtempComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormtempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
