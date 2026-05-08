import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from "rxjs/operators";
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    messageCount: number = 0;
    constructor(
        private route: Router,
        private auth: AuthService,
        private toastr: ToastrService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let Token = localStorage.getItem('token');
        if (this.auth.isAuthenticated() && localStorage.getItem('token') != null) {

            const clonedReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + Token)
                //setHeaders: { Authorization: `Bearer ${Token}` }
            });
            return next.handle(clonedReq).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status == 401) {
                            this.route.navigateByUrl('/user/login');
                        } else
                            if (err?.status == 403) {
                                this.messageCount++;
                                if (this.messageCount == 1) {
                                    this.toastr.error("Your account is inactive. Please contact administrator.", "Error", {
                                        progressBar: true,
                                        closeButton: true
                                    });
                                    localStorage.removeItem('token');
                                    this.route.navigateByUrl('/user/login');

                                }
                            }
                    }

                )

            )
        }
        else {
            localStorage.removeItem('token');
            return next.handle(req.clone());
        }


    }
}