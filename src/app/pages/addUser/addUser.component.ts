import {Component, ViewContainerRef, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {Router}  from '@angular/router';

@Component({
    selector: 'add-user',
    styleUrls: ['./addUser.scss'],
    templateUrl: './addUser.html'
})

export class addUser {
    form:FormGroup;
    imageUrl:string;
    @ViewChildren('firstName') firstField;

    constructor(private fb:FormBuilder, private router:Router, private authentication:AuthenticationHelper, private appService:ApplicationAdminServices, public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Add User');
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.userBasicInfo();
    }
    
    ngAfterViewInit() {
        this.firstField.first.nativeElement.focus();
    }

    // set up form.
    userBasicInfo() {
        this.form = this.fb.group({
            'firstName': this.fb.control('', Validators.compose([Validators.required])),
            'lastName': this.fb.control('', Validators.compose([Validators.required])),
            'phoneNumber': this.fb.control(''),
            'email': this.fb.control('', Validators.compose([Validators.required, EmailValidator.validate])),
        });
    }

    // submission of add user form.
    onSubmit(value:any):void {
        this._spinner.show();
        let userData = {
            'first_name': value.firstName.trim(),
            'last_name': value.lastName.trim(),
            'email': value.email,
            'mobile_number':value.phoneNumber.trim()
        };

        // Api call to edit profile, if success editUserProfile(data) and if error editUserProfileFail(error)
        this.appService.addNewUser(userData).subscribe(
            data => this.editProfileSuccess(data),
            error => this.editProfileFail(error)
        );
    }

    //if edit profile success
    editProfileSuccess(result) {
        this._spinner.hide();
        this.toastr.success("User Created successfully");
        this.router.navigate(['/user']);
    }

    //if edit profile fail
    editProfileFail(Error) {
        this._spinner.hide();
        if (Error.error && Error.error.message) {
            this.toastr.error(Error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

}
