import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms/src/model';

@Component(
    {selector: 'app-root', templateUrl: './app.component.html', styles: []})
export class AppComponent {
  send(form) {
    console.log(form.value);
  }
}
