import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component(
    {selector: 'app-root', templateUrl: './app.component.html', styles: []})
export class AppComponent implements OnInit, OnChanges {
  // #region
  /* 期望的 Form 格式
  {
    firstName:'Poy',
    lastName: 'Chang',
    phoneNumber: 1234
  }
  */
  // #endregion
  
  // 假設資料室從外面進來時，會觸發 ngOnChanges，藉此行為進行 form.reset() 的動作
  @Input() data = {'firstName': 'Poy', 'lastName': 'Chang', 'phoneNumber': ''};
  

  formData = this.fb.group({
    'firstName': ['', Validators.required],
    'lastName': ['', Validators.required],
    'phoneNumber': ['']
  });

  send() {
    console.log(this.formData.value);
    console.log(this.formData.getRawValue());
  }
  ngOnChanges(): void {
    this.formData.reset(this.data);
  }
  ngOnInit(): void {}

  constructor(private fb: FormBuilder) {}
}

// 開發實務心得：變數很多(搭配 RxJS)、方法很少，constructor 只處理注入
