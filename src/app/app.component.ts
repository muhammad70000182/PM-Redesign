import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { Observable, delay } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Abacus Global';
  processing: boolean;
  Loading: Observable<boolean>;
  auth: any;
  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private translate: TranslateService
    // auth: AuthService,
  ) {
    // this.Loading = auth.isLoading;
    // this.Loading.pipe(delay(0)).subscribe((loading: boolean) => {
    //   this.processing = loading;
    // });
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };

    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    // detect browser language
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/en|ar/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
