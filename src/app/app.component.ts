import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {defer} from 'rxjs/observable/defer';
import {of} from 'rxjs/observable/of';
import {debounceTime, filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {shareReplay} from 'rxjs/operators/shareReplay';
import {startWith} from 'rxjs/operators/startWith';

@Component(
    {selector: 'app-root', templateUrl: './app.component.html', styles: []})
export class AppComponent implements OnInit {
  readonly wikiAPI = '//en.wikipedia.org/w/api.php';
  formData: FormGroup;
  searchControlValue$ = defer(() => {
                          if (this.formData) {
                            return this.formData.get('search').valueChanges;
                          }
                        }).pipe(tap(value => console.log('search', value)));
  checkControlValue$ =
      defer(() => {
        if (this.formData) {
          return this.formData.get('check').valueChanges.pipe(startWith(true));
        }
      }).pipe(tap(value => console.log('send', value)));
  searchResult$ =
      combineLatest(
          this.searchControlValue$, this.checkControlValue$,
          (search, check) => ({search, check}))
          .pipe(
              debounceTime(500), mergeMap(({search, check}) => {
                if (check) {
                  return this.http.jsonp(this.searchUrl(search, this.wikiAPI), 'callback');
                } else {
                  return of ([]);
                }
              }),
              map((data: any[]) => {
                if (data.length) {
                  data.shift();
                  return data[0];
                }
              }),
              shareReplay());

  private searchUrl(term, base) {
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
      check: new FormControl(true, {validators: [], updateOn: 'change'}),
    });
  }

  constructor(private http: HttpClient) {}
}

// 開發實務心得：變數很多(搭配 RxJS)、方法很少，constructor 只處理注入
