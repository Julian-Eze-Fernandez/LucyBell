import { TestBed } from '@angular/core/testing';

import { ModalCategService } from './modal-categ.service';

describe('ModalCategService', () => {
  let service: ModalCategService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalCategService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
