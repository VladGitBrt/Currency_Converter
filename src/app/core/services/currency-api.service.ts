import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { ICurrencyHeaderElement } from '../models/currency-header.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyApiService {
  private baseUrl: string = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/';

  constructor(private http: HttpClient) { }

  public getCurrencyNames(): Observable<any> {
      return this.http.get(`${this.baseUrl}currencies.json`);
  } 

  public getUahBasedCurrency(): Observable<any> {
    return this.http.get(`${this.baseUrl}currencies/uah.json`);
  }

  public getCurrencyBased(currency: string | undefined): Observable<any> {
    return this.http.get(`${this.baseUrl}currencies/${currency}.json`);
  }

  public getNameAndBasedCurrency(): Observable<ICurrencyHeaderElement[]> {
    return forkJoin({
      currencyNames: this.getCurrencyNames(),
      currencyUahBased: this.getUahBasedCurrency()
    }).pipe(
      map(forkRes => {
        let result = [];
        let namesResult: string[] = Object.values(forkRes.currencyNames);
        let currencyResult: number[] = Object.values(forkRes.currencyUahBased.uah);
        if (namesResult.length === currencyResult.length) {
          for (let i = 0; i < namesResult.length; i++) {
            result.push({ currencyName: namesResult[i], currencyValue: currencyResult[i] });
          }
        }
        return result;
      })
    );
  }
}
