import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablecerContrasenaSolicitudComponent } from './restablecer-contrasena-solicitud.component';

describe('RestablecerContrasenaSolicitudComponent', () => {
  let component: RestablecerContrasenaSolicitudComponent;
  let fixture: ComponentFixture<RestablecerContrasenaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestablecerContrasenaSolicitudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestablecerContrasenaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
