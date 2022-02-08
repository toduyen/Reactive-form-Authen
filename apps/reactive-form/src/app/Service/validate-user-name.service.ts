import { Injectable } from '@angular/core';
import {delay, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ValidateUserNameService {

  constructor() { }

  validateUsername(username: string): Observable<boolean> {
    console.log(`Trigger API call ${username}`)
    const existedUsers = ["trungvo", "tieppt", "chautran"];
    const isValid = existedUsers.every(x => x !== username);
    return of(isValid).pipe(delay(1000));
  }
}
