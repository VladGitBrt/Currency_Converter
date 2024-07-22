import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject, takeUntil, throwError } from 'rxjs';
import { ICurrencyHeaderElement } from 'src/app/core/models/currency-header.model';
import { CurrencyApiService } from 'src/app/core/services/currency-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currencyUahList: ICurrencyHeaderElement[] = [];
  private unsubscribe$ = new Subject<void>();
  constructor(private currencyApi: CurrencyApiService){}

  ngOnInit(): void {
    this.currencyApi.getNameAndBasedCurrency()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(currencyRes => {
        this.currencyUahList = currencyRes;
      })
  }

  ngOnDestroy(): void { 
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
