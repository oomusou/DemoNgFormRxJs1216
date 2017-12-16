import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component(
    {selector: 'app-root', templateUrl: './app.component.html', styles: []})
export class AppComponent {
  /* 期望的 Form 格式
  {
    firstName:'Chang',
    lastName: 'Poy',
    phoneNumber: 1234
  }
   */
  formData = this.fb.group({
    'firstName': ['Default Value', Validators.required],
    'lastName': [{value: '', disable: true}, Validators.required],
    'phoneNumber': ['']
  });

  send() {
    console.log(this.formData.value);
    console.log(this.formData.getRawValue());
  }

  constructor(private fb: FormBuilder) {}
}

// 開發實務心得：變數很多(搭配 RxJS)、方法很少，constructor 只處理注入
