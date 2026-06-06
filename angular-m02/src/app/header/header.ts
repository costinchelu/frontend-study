import {Component} from '@angular/core';

/*
For templates, we can even inline the template and css, but this would not be a good practice.
Maybe it can be the case for super simple short templates.

@Component({
  selector: 'app-header',
  template: `<h1>Angular M02</h1>`,
  styles: [
    `
      h1 {
        color: red;
      }
    `
  ]
})

For external html and css files, it is recommended to use templateUrl and styleUrls properties
to keep the component file clean and maintainable.

---

For >= Angular 19 the property called "standalone" is set to "true" by default.
The modern way of building Angular components is to set the property standalone to true.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent { }
