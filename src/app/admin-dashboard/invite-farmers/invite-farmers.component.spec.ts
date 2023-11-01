import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFarmersComponent } from './invite-farmers.component';

describe('InviteFarmersComponent', () => {
  let component: InviteFarmersComponent;
  let fixture: ComponentFixture<InviteFarmersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InviteFarmersComponent]
    });
    fixture = TestBed.createComponent(InviteFarmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
