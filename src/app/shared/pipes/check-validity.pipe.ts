import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkValidity'
})
export class CheckValidityPipe implements PipeTransform {

  transform(value: any): any {
    if (!value) return null;
    const date = new Date(value);
    date.setDate(date.getDate() + 5);
    return date;
  }

}
