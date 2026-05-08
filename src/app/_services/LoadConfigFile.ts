import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Config } from 'protractor';

@Injectable({
    providedIn: 'root'
  })
  export class ConfigService {
    config: Config;
  
    constructor(private http: HttpClient) {}
  
    loadConfig() {
     
      return this.http
        .get<Config>('./assets/config.json')
        .toPromise()
        .then(con => {
          //this.config = config;
          this.config = con!
        });
    }
  }