import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { ICurrencyHeaderElement } from 'src/app/core/models/currency-header.model';
import { CurrencyApiService } from 'src/app/core/services/currency-api.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit, OnDestroy {
  currencyFullNameRes: ICurrencyHeaderElement[] = [];
  currencyNames = [];
  currency1 = new FormControl<string | any>('True USD');
  currency2 = new FormControl<string | any>('Euro');
  value1 = new FormControl<number | any>(0);
  value2 = new FormControl<number | any>(0);
  options1: string[] = [];
  options2: string[] = [];
  filteredOptions1: Observable<any[]> | undefined;
  filteredOptions2: Observable<any[]> | undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(private currencyApi: CurrencyApiService){}

  ngOnInit() {
    this.currencyApi.getCurrencyNames()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(currencyNames => {
        this.currencyNames = currencyNames;
      }) 
    this.currencyApi.getNameAndBasedCurrency()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(currencyRes => {
        this.currencyFullNameRes = currencyRes;
        currencyRes.forEach(currObj => {
          this.options1.push(currObj.currencyName);
          this.options2.push(currObj.currencyName);
        })
        
        this.filteredOptions1 = this.currency1.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(name as string, 1) : this.options1.slice();
          }),
        );
        this.filteredOptions2 = this.currency2.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(name as string, 2) : this.options2.slice();
          }),
        );
      })


      this.value1.valueChanges.subscribe(newValue => {
       this.calculateValue(newValue,'first')
      })

      this.value2.valueChanges.subscribe(newValue => {
        this.calculateValue(newValue,'second')
      })
      
  }

  public calculateValue(newValue: number | null, valueType: 'first' | 'second') {
    if(valueType === 'first') {
      var currRequestName1 = Object.keys(this.currencyNames).find((key: any) => this.currencyNames[key] === this.currency1.value);
      this.currencyApi.getCurrencyBased(currRequestName1)
       .pipe(takeUntil(this.unsubscribe$))
       .subscribe((data) => {
         let foundCurrName = Object.keys(this.currencyNames).find((key: any) => this.currencyNames[key] === this.currency2.value);
         if(newValue === null) {
          this.value2.setValue(this.value2.value * data[currRequestName1!][foundCurrName!],{ emitEvent: false });
         } else {
          this.value2.setValue(newValue! * data[currRequestName1!][foundCurrName!],{ emitEvent: false });
         }
       })
    } else {
      var currRequestName2 = Object.keys(this.currencyNames).find((key: any) => this.currencyNames[key] === this.currency2.value);
       this.currencyApi.getCurrencyBased(currRequestName2)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
          let foundCurrName = Object.keys(this.currencyNames).find((key: any) => this.currencyNames[key] === this.currency1.value);
          if(newValue === null) {
            this.value1.setValue(this.value1.value * data[currRequestName2!][foundCurrName!],{ emitEvent: false });
           } else {
            this.value1.setValue(newValue! * data[currRequestName2!][foundCurrName!],{ emitEvent: false });
           }
        })
    }
  }

  private _filter(name: string, selector: number): any[] {
    const filterValue = name.toLowerCase();

    if(selector === 1) {
      return this.options1.filter((option) => option.toLowerCase().includes(filterValue));
    }
    else {
      return this.options2.filter((option) => option.toLowerCase().includes(filterValue));
    }
  }

  ngOnDestroy(): void { 
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
