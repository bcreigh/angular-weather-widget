import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tempUnit'
})

export class TempUnitPipe implements PipeTransform {
  transform(temp: number, unitType: string){
    switch(unitType) {
      case "c":
      return (temp-32)*(5/9);

      default:
      return temp;
    }
  }
}