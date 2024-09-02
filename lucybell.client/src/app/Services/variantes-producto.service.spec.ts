import { TestBed } from '@angular/core/testing';

import { VariantesProductoService } from './variantes-producto.service';

describe('VariantesProductoService', () => {
  let service: VariantesProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariantesProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
