import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkCollectionComponent } from './milk-collection.component';

describe('MilkCollectionComponent', () => {
  let component: MilkCollectionComponent;
  let fixture: ComponentFixture<MilkCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilkCollectionComponent]
    });
    fixture = TestBed.createComponent(MilkCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
