import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {defer} from 'rxjs/observable/defer';
import {of} from 'rxjs/observable/of';
import {debounceTime, filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';

@Component(
    {selector: 'app-root', templateUrl: './app.component.html', styles: []})
export class AppComponent implements OnInit {
  readonly wikiAPI = '//en.wikipedia.org/w/api.php';
  formData: FormGroup;
  searchControlValue$ = defer(() => {
                          if (this.formData) {
                            return this.formData.get('search').valueChanges;
                          }
                        }).pipe(tap(value => console.log(value)));

  searchResult$ = this.searchControlValue$.pipe(
      debounceTime(500), filter((value) => {
        console.log(this.formData.get('check').value);
        if (this.formData.get('check').value) {
          return value;
        };
      }),
      mergeMap(
          value =>
              this.http.jsonp(this.searchUrl(value, this.wikiAPI), 'callback')),
      map((data: any[]) => {
        if (data) {
          data.shift();
          return data[0];
        }
      }),
      tap((value) => {
        console.log(value);
      }));


  searchUrl(term, base) {
    let params = new HttpParams()
                     .append('action', 'opensearch')
                     .append('search', encodeURIComponent(term))
                     .append('format', 'json');
    return `${base}?${params.toString()}`;
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      search: new FormControl(
          '', {validators: [Validators.required], updateOn: 'change'}),
      check: new FormControl(false, {validators: [], updateOn: 'change'}),
    });
  }

  send() {
    this.http.jsonp(this.searchUrl('1234', this.wikiAPI), 'callback')
        .subscribe(value => {
          console.log(value);
        });
  }

  constructor(private http: HttpClient) {}
}

// 開發實務心得：變數很多(搭配 RxJS)、方法很少，constructor 只處理注入
