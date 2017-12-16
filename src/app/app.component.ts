import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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

  formData = new FormGroup({
    'firstName': new FormControl('Default Value', Validators.required),
    'lastName':
        new FormControl({value: '', disable: true}, Validators.required),
    'phoneNumber': new FormControl('')
  });

  send() {
    console.log(this.formData.value);
    console.log(this.formData.getRawValue());
  }
}
