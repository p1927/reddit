import {Pipe, PipeTransform} from '@angular/core'
import * as moment from 'moment'

@Pipe({
  name: 'formatDate'
})
export class DatePipe implements PipeTransform {
  transform(time: any, args?: any): any {
    return moment.unix(time).format('MMMM Do YYYY, h:mm:ss A')

  }
}
