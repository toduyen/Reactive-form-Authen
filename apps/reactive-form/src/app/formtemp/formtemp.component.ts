import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { Observable, Subject, timer } from "rxjs";
import { filter, map, startWith, switchMap, take, tap } from "rxjs/operators";
import {ValidateUserNameService} from "../Service/validate-user-name.service";

const PASSWORD_PATTERN = /^(?=.*[!@#$%^&*]+)[a-z0-9!@#$%^&*]{6,32}$/;
@Component({
  selector: 'reactive-form-formtemp',
  templateUrl: './formtemp.component.html',
  styleUrls: ['./formtemp.component.scss']
})
export class FormtempComponent implements OnInit {
  formSubmit$ = new Subject<any>();
  registerForm!: FormGroup;



  constructor(private _fb: FormBuilder, private _api: ValidateUserNameService) {}



  ngOnInit() {
    this.initForm();
    this.formSubmit$.pipe(
        tap(() => this.registerForm.markAsDirty()),
        switchMap(() =>
          this.registerForm.statusChanges.pipe(
            startWith(this.registerForm.status),
            filter(status => status !== "PENDING"),
            take(1)
          )
        ),filter(status => status === "VALID")
      ).subscribe(validationSuccessful => this.submitForm());
  }




  submitForm() {
    console.log(this.registerForm.value);
  }




  initForm() {
    this.registerForm = this._fb.group(
      {
        username: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[a-z]{6,32}$/i)
          ]),
          this.validateUserNameFromAPIDebounce.bind(this)
        ],
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(PASSWORD_PATTERN)
          ])
        ],
        confirmPassword: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(PASSWORD_PATTERN)
          ])
        ]
      },
      {
        validators: this.validateControlsValue("password", "confirmPassword")
      }
    );
  }




  validateControlsValue(firstControlName: string, secondControlName: string) {
    return function(formGroup: FormGroup) {
      const { value: firstControlValue }:any = formGroup.get(firstControlName);
      const { value: secondControlValue }:any = formGroup.get(secondControlName);
      return firstControlValue === secondControlValue
        ? null
        : {
          valueNotMatch: {
            firstControlValue,
            secondControlValue
          }
        };
    };
  }





  validateUserNameFromAPIDebounce(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return timer(300).pipe(
      switchMap(() =>
        this._api.validateUsername(control.value).pipe(
          map(isValid => {
            if (isValid) {
              return null;
            }
            return {
              usernameDuplicated: true
            };
          })
        )
      )
    );
  }




}
