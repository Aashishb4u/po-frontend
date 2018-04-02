import {Component, ViewEncapsulation, ViewContainerRef} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router, ActivatedRoute}  from '@angular/router';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {AuthenticationHelper} from '../../app.authentication';
import {BaThemeSpinner} from '../../theme/services';
import {EmailValidator} from '../../theme/validators/email.validator';
import {AppConstant} from "../../app.constant";
import {ApplicationAdminServices} from '../../appServices/application';

@Component({
    selector: 'emailVerificationConfirmation',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './emailVerificationConfirmation.html',
    styleUrls: ['./emailVerificationConfirmation.scss']
})

export class emailVerificationConfirmation extends AppConstant {
    token : string = '';
   
    constructor(private router: Router, private appService: ApplicationAdminServices,
                public toastr: ToastsManager, vRef: ViewContainerRef, private _spinner: BaThemeSpinner,
                private activatedRoute: ActivatedRoute) {
        super();
        if(activatedRoute.queryParams['value']['confirmlink']){
            this.token = activatedRoute.queryParams['value']['confirmlink'];
            let data = {
                'confirmation_token' :  this.token
            };
            this.appService.emailVerification(data).subscribe(
                data => this.emailVerificationSuccess(data),
                error =>  this.emailVerificationFail(error)
            );
        }
    }

    /**
     * If email verification success.
     */
    emailVerificationSuccess(data) {

    }

    /**
     * If email verification fails.
     */
    emailVerificationFail(Error) {
        if (Error.error && Error.error.message) {
            this.toastr.error(Error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    navigateToHome() {
        this.router.navigate(['']);
    }

    navigateToSignIn() {
        this.router.navigate(['/login']);
    }

}
