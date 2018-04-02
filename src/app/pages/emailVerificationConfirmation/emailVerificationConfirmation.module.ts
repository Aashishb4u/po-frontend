import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {emailVerificationConfirmation} from './emailVerificationConfirmation.component';
import {routing}       from './emailVerificationConfirmation.routing';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        routing
    ],
    declarations: [
        emailVerificationConfirmation
    ]
})
export class EmailVerificationModule {
}
