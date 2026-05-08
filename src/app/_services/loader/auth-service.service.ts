import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  private Loading = new BehaviorSubject<boolean>(false);
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }
  constructor(private route: Router) {
  }
  get isLoading() {
    return this.Loading.asObservable(); // {2}
  }
  setLoading(v: boolean) {
    this.Loading.next(v); // {2}
  }
}
