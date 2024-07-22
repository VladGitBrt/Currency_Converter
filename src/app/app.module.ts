//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Material modules
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

//Components
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyApiService } from './core/services/currency-api.service';
import { ConverterComponent } from './components/converter/converter.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ConverterComponent,
    HeaderComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [CurrencyApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
