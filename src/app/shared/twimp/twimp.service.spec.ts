/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TwimpService } from './twimp.service';

describe('Service: Twimp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwimpService]
    });
  });

  it('should ...', inject([TwimpService], (service: TwimpService) => {
    expect(service).toBeTruthy();
  }));
});
