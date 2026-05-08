import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'protractor';

@Injectable({
    providedIn: 'root'
  })
  export class InputFieldValidator {
    config: Config;
  
    constructor() {}
  
    omit_special_char(event:any):boolean
    {   
       var k;  
       //code to allow underscore
      //  if(event.charCode == 95){
      //    return true;
      //  }
       k = event.charCode;  //         k = event.keyCode;  (Both can be used)
       return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
    }
    numberOnly(event:any): boolean {
      
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
  
    }
  }