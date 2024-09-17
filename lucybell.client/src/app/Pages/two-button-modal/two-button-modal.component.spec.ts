import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoButtonModalComponent } from './two-button-modal.component';

describe('TwoButtonModalComponent', () => {
  let component: TwoButtonModalComponent;
  let fixture: ComponentFixture<TwoButtonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoButtonModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoButtonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
