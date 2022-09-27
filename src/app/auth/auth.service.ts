import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient){}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCA4awJAEfl3Q409iPuGIJuY0ujhOxxPPA',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(errorRes => {
      let errorMessage = 'An unknown error ocurred!';
      if (!errorRes.error || !errorRes.error.error) return throwError(() => new Error(errorMessage));
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists!';
          break;

        default:
          break;
      }
      return throwError(() => new Error(errorMessage));
    }));
  }
}