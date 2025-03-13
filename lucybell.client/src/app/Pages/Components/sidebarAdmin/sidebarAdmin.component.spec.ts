import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAdminComponent } from './sidebarAdmin.component';

describe('SidebarComponent', () => {
  let component: SidebarAdminComponent;
  let fixture: ComponentFixture<SidebarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
