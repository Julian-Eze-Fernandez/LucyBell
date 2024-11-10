import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneButtonModalComponent } from './one-button-modal.component';

describe('OneButtonModalComponent', () => {
  let component: OneButtonModalComponent;
  let fixture: ComponentFixture<OneButtonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OneButtonModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneButtonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
