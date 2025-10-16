import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkValidity'
})
export class CheckValidityPipe implements PipeTransform {

  transform(value: any, validityDays: number = 6): any {
    if (!value) return null;
    const date = new Date(value);
    date.setDate(date.getDate() + (validityDays || 6));
    return date;
  }

}
