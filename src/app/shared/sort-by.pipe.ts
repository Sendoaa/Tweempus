import { Pipe, PipeTransform } from '@angular/core';

import { Twimp } from './twimp/twimp.model';

@Pipe({
  name: 'sortBy',
  pure: false
})
export class SortByPipe implements PipeTransform {

  transform(array: Array<Twimp>): any {
    if (array) {
      return array.sort((a: Twimp, b: Twimp) => +a.timestamp.replace(/-/g, '') - +b.timestamp.replace(/-/g, ''))
    } else {
      return array;
    }
  }

}
