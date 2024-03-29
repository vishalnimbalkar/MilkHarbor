import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceComponent } from './advance.component';

describe('AdvanceComponent', () => {
  let component: AdvanceComponent;
  let fixture: ComponentFixture<AdvanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvanceComponent]
    });
    fixture = TestBed.createComponent(AdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
