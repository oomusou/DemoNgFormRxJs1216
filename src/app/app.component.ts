import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {NgControl} from '@angular/forms';
import {Subscribable} from 'rxjs/Observable';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

@Component(
    {selector: 'app-root', templateUrl: './app.component.html', styles: []})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchRef') searchControl: NgControl;
  sub: Subscription;
  destroy$ = new Subject();

  ngAfterViewInit(): void {
    // 可以看到 ngModel 的內容和 FromControl 是一樣的
    console.log(this.searchControl);

    // 這個 Observable 不會停，所以要自己停，不然可能會有 memory leak 的問題
    // 建議要停了話，可以透過 destroy$ 來處理，當有多個要停的時候，可以統一由
    // destroy$ 來控制
    this.sub = this.searchControl.valueChanges.pipe(takeUntil(this.destroy$))
                   .subscribe(value => console.log(value));
  }

  ngOnDestroy(): void {
    // 原本要這樣停掉
    this.sub.unsubscribe();

    // 透過 destroy$ 可以在這裡統一取消訂閱
    this.destroy$.next();
    // this.destroy$.unsubscribe();
    // or
    this.destroy$.complete();
  }
}
