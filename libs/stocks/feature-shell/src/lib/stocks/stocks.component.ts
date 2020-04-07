import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;

  quotes$ = this.priceQuery.priceQueries$;

  fromDate: string;
  toDate: string;
  currentDate = new Date();

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  ngOnInit() {}

  fetchQuote() : void {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate,  toDate} = this.stockPickerForm.value;
      const duration = this.durationCal(fromDate, toDate);
      this.priceQuery.fetchQuote(symbol, duration);
    }
  }

  durationCal(from: Date, to: Date) : string {
    const oneDay = 1000 * 60 * 60 * 24;
    const differenceInDays = +(Math.round(to.getTime() - from.getTime()) / oneDay).toFixed(0); 
    switch(true) {
      case (differenceInDays <= 1):
        return '1d';
        break;
      case (differenceInDays <= 5):
        return '5d';
        break;
      case (differenceInDays <= 30):
        return '1m';
        break;
      case (differenceInDays <= 90):
        return '3m';
        break;
      case (differenceInDays <= 180):
        return '6m';
        break;
      case (differenceInDays <= 366):
        return '1y';
        break;
      case (differenceInDays <= 731):
        return '2y';
        break;
      case (differenceInDays <= 1827):
        return '5y';
        break;
      default:
        return 'max';
    }
  }
}
