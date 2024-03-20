import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyMilkDetailsComponent } from './supply-milk-details.component';

describe('SupplyMilkDetailsComponent', () => {
  let component: SupplyMilkDetailsComponent;
  let fixture: ComponentFixture<SupplyMilkDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplyMilkDetailsComponent]
    });
    fixture = TestBed.createComponent(SupplyMilkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
