import {Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Router}  from '@angular/router';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {BlankSpaceValidator} from "../../theme/validators/blank.validator";
import {Modal} from 'ng2-modal';
import {EqualPasswordsValidator} from "../../theme/validators/equalPasswords.validator";

@Component({
    selector: 'settings',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./settings.scss'],
    templateUrl: './settings.html'
})

export class settings {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('confirmUserChangePasswordModal') confirmUserChangePasswordModal:Modal;
    @ViewChildren('firstName') firstField;

    form:FormGroup;
    changePasswordForm:FormGroup;
    getUserData:any;
    imageUrl:string;
    showError:boolean = false;
    settingComponent:boolean = true;
    passwordComponent:boolean = false;
    notificationComponent:boolean = false;
    accreditionComponent:boolean = false;

    constructor(private router:Router, private adminServices:ApplicationAdminServices, private fb:FormBuilder, private authentication:AuthenticationHelper, private appService:ApplicationAdminServices, public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Settings');
    }

    ngOnInit() {
        // window.scrollTo(0, 0);
        // this.userBasicInfo();
        // this.getUserProfileDetails();
    }

    // ngAfterViewInit() {
    //     this.firstField.first.nativeElement.focus();
    // }


    userBasicInfo() {
        this.form = this.fb.group({
            'firstName': this.fb.control('', Validators.compose([Validators.required,BlankSpaceValidator.validate])),
            'lastName': this.fb.control('', Validators.compose([Validators.required, BlankSpaceValidator.validate])),
            'email': this.fb.control('', Validators.compose([Validators.required, EmailValidator.validate])),
            'phoneNumber': this.fb.control(''),
            'profile_img': this.fb.control(''),
            'chooseImage': this.fb.control(''),
        });

        this.changePasswordForm = this.fb.group({
            'password': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
            'passwords': this.fb.group({
                'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
                'confirmPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
            }, {validator: EqualPasswordsValidator.validate('newPassword', 'confirmPassword')})
        });

        this.changePasswordForm.valueChanges.subscribe(data => {
            if (data.password && data.password.length > 0 && data.passwords.newPassword && data.passwords.newPassword.length > 0) {
                if (data.password == data.passwords.newPassword) {
                    this.showError = true;
                } else {
                    this.showError = false;
                }
            }

        })
    }

    /**
     * To set user user data initially on page load.
     */
    setUserData(userData) {
        this.getUserData = userData;
        if (this.getUserData.firstName) {
            this.form.controls['firstName'].setValue(this.getUserData.firstName);
        }
        if (this.getUserData.lastName) {
            this.form.controls['lastName'].setValue(this.getUserData.lastName);
        }
        if (this.getUserData.email) {
            this.form.controls['email'].setValue(this.getUserData.email);
        }
        if (this.getUserData.mobileNumber) {
            if (this.getUserData.mobileNumber.length > 0) {
                let mobileNo = this.getUserData.mobileNumber[0];
                this.form.controls['phoneNumber'].setValue(mobileNo);
            }
        }
        if (this.getUserData.profileImageURL) {
            this.imageUrl = this.getUserData.profileImageURL;
        }
    }

    triggers() {
        this.fileUpload.nativeElement.click();
    }

    /**
     * Function to load image.
     */
    fileChangeListener($event) {
        let image:any = new Image();
        let file:File = $event.target.files[0];
        if ($event.target.files.length != 0) {
            if (file.type.substring(0, 5) == 'image') {
                let myReader:FileReader = new FileReader();
                myReader.onloadend = (loadEvent:any) => {
                    image.src = loadEvent.target.result;
                    if (file.size <= 2000000) {
                        let a = image.src.split(',')[1];
                        this.form.controls['profile_img'].patchValue(image.src);
                        this.toastr.success('Image uploaded successfully');
                        this.previewImage(image.src);
                    } else {
                        $event.target.value = '';
                        this.toastr.error('File should be less than 2 MB');
                    }
                };
                myReader.readAsDataURL(file);
            } else {
                $event.target.value = '';
                this.toastr.error('Invalid File type');
            }
        }
    }

    previewImage(src) {
        this.form.controls['profile_img'].patchValue(src);
        this.imageUrl = src;
    }

    //onSubmit
    onSubmit(value:any):void {
        this._spinner.show();
        let profileData = {
            'first_name': value.firstName,
            'last_name': value.lastName,
            'email': value.email,
            'mobile_number': value.phoneNumber,
            'profile_image': value.profile_img
        };

        // Api call to edit profile, if success editUserProfile(data) and if error editUserProfileFail(error)
        this.appService.editUserProfile(profileData).subscribe(
            data => this.editProfileSuccess(data),
            error => this.editProfileFail(error)
        );
    }

    // Api call to get user profile, if success getUserProfileSuccess(data) and if error getUserProfileFail(error)
    getUserProfileDetails() {
        this.appService.getUserProfile().subscribe(
            data => this.getUserProfileSuccess(data),
            error => this.getUserProfileFail(error)
        );
    }

    //if get user profile success
    getUserProfileSuccess(resultantUserData) {
        let userData = resultantUserData.success.data.user;
        this.setUserData(userData);
    }

    //if get user profile fail
    getUserProfileFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    //if edit profile success
    editProfileSuccess(profileData) {
        if (profileData.success.data.user) {
            let userData = profileData.success.data.user;
            this.authentication.setUserLocal(profileData);
            // this.form.reset();
            // this.setUserData(userData);
            this.authentication.userValueChangedEvent(userData);
            this.authentication.setUser(userData);
            this._spinner.hide();
            this.toastr.success('Profile updated successfully.');
        }
    }

    //if edit profile fail
    editProfileFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }


    /**
     * Function to submit data for changing password.
     */
    onChangePasswordSubmit(data) {
        this._spinner.show();
        let changePasswordData = {
            old_password: data.password,
            new_password: data.passwords.newPassword
        };
        this.adminServices.changePassword(changePasswordData).subscribe(
            data => this.changePasswordSuccess(data),
            error => this.changePasswordFail(error)
        );
    }

    //if change password success
    changePasswordSuccess(result) {
        this._spinner.hide();
        this.toastr.success('Password changed successfully.');
        this.changePasswordForm.reset();
        this.showError = false;

    }

    //if change password fail
    changePasswordFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    // Function to make selected tab active and other's inactive.
    changeTab(id) {
        if (id == "password") {
            this.passwordComponent = true;
            this.settingComponent = false;
            this.notificationComponent = false;
            this.accreditionComponent = false;
        } else if (id == "notification") {
            this.notificationComponent = true;
            this.settingComponent = false;
            this.passwordComponent = false;
            this.accreditionComponent = false;
        } else if (id == "accredition") {
            this.accreditionComponent = true;
            this.settingComponent = false;
            this.passwordComponent = false;
            this.notificationComponent = false;
        } else {
            this.settingComponent = true;
            this.accreditionComponent = false;
            this.passwordComponent = false;
            this.notificationComponent = false;
        }
    }

    trimContent(value, control) {
        if(value) {
            this.form.controls[control].setValue(value.trim());
        }
        return value.trim();

    }
}
