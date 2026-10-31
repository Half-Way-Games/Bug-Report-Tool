import { TestBed } from '@angular/core/testing';
import { BugAPI } from './bug-api';

describe('BugAPI', () => {
  let service: BugAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
