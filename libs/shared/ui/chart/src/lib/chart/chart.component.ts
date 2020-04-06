import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() data$: Observable<any>;
  public chartData: any;

  public chart: {
    type: string;
    columnNames: string[];
    options: any;
  };

  private readonly destroyed: Subject<void> = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.chart = {
      type: 'LineChart',
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };

    this.data$.pipe(takeUntil(this.destroyed)).subscribe(newData => (this.chartData = newData));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
