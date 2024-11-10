import { ComponentFixture, TestBed } from '@angular/core/testing';

import { navBarComponent } from './navBar.component';

describe('InicioComponent', () => {
  let component: navBarComponent;
  let fixture: ComponentFixture<navBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [navBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(navBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
