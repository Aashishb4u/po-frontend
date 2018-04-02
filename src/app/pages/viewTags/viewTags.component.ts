import {Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Router} from '@angular/router';
import {LocalDataSource} from 'ng2-smart-table/index';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {BlankSpaceValidator} from "../../theme/validators/blank.validator";
import {Modal} from 'ng2-modal';
import {EqualPasswordsValidator} from "../../theme/validators/equalPasswords.validator";
import {Utility} from "../../utilityServices/app.utility";

@Component({
    selector: 'viewCategories',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./viewTags.scss'],
    templateUrl: './viewTags.html',
    providers: [Utility],
})

export class viewTags {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    tagId: any;
    tagName: any;
    allTagsName = [];
    allDeleteTags = [];
    imageUrl: string;
    showError: boolean = false;
    settingComponent: boolean = true;
    passwordComponent: boolean = false;
    notificationComponent: boolean = false;
    accreditionComponent: boolean = false;
    disableTagButton: boolean = true;
    disableDeleteButton: boolean = true;

    settings: any = {
        mode : 'external',
        actions: {
            columnTitle: 'Actions',
        },
        columns: {
            company_name: {
                title: 'Company Name',
            },
            name: {
                title: 'Contact Person Name',
            },
            email: {
                title: 'Email',
            },
            contact_number: {
                title: 'Contact No.',
            },
            city: {
                title: 'City',
            },
        },
        add: {
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="ion-edit" title="Edit Vendors"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Vendors"></i>',
            confirmDelete: true,
        },
    };

    constructor(private router: Router,
                private adminServices: ApplicationAdminServices,
                private fb: FormBuilder,
                private userUtility: Utility,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Categories');
    }

    ngOnInit() {
        this.getAllTags();
    }

    getAllTags() {
        this._spinner.show();
        this.appService.getAllTags().subscribe(
            data => this.getDataSuccess(data),
            error => this.getDataFail(error)
        );
    }

    getDataSuccess(res) {
        if (res.code < 0) {
        } else {
            this.allTagsName = [];
            this._spinner.hide();
            res.data[0].forEach((item: any) => {
                this.allTagsName.push(item);
            });
        }
    }

    getDataFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    userBasicInfo() {
        this.form = this.fb.group({
            'firstName': this.fb.control('', Validators.compose([Validators.required, BlankSpaceValidator.validate])),
            'lastName': this.fb.control('', Validators.compose([Validators.required, BlankSpaceValidator.validate])),
            'email': this.fb.control('', Validators.compose([Validators.required, EmailValidator.validate])),
            'phoneNumber': this.fb.control(''),
            'profile_img': this.fb.control(''),
            'chooseImage': this.fb.control(''),
        });

        this.changePasswordForm = this.fb.group({
            'password': ['', Validators.compose([Validators.required,
                Validators.minLength(8), Validators.maxLength(16)])],
            'passwords': this.fb.group({
                'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
                'confirmPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            }, { validator: EqualPasswordsValidator.validate('newPassword', 'confirmPassword') }),
        });

        this.changePasswordForm.valueChanges.subscribe(data => {
            if (data.password && data.password.length > 0
                && data.passwords.newPassword &&
                data.passwords.newPassword.length > 0) {
                if (data.password == data.passwords.newPassword) {
                    this.showError = true;
                } else {
                    this.showError = false;
                }
            }

        });
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
                const mobileNo = this.getUserData.mobileNumber[0];
                this.form.controls['phoneNumber'].setValue(mobileNo);
            }
        }
        if (this.getUserData.profileImageURL) {
            this.imageUrl = this.getUserData.profileImageURL;
        }
    }

    selectTag(event, tagId) {

        event.target.classList.toggle('tagChange'); // To toggle
        if (this.allDeleteTags.length > 0) {
            const index = this.allDeleteTags.indexOf(tagId);
            if (index != -1) {
                this.allDeleteTags.splice(index, 1);
            } else {
                this.allDeleteTags.push(tagId);
            }
        } else {
            this.allDeleteTags.push(tagId);
        }
        this.disableDeleteButton = (this.allDeleteTags.length == 0) ? true : false;
    }
    //
    // deleteVendor(event) {
    //     this.vendorId = event.data.id;
    //     this.deleteVendorModal.open();
    // }

    triggers() {
        this.fileUpload.nativeElement.click();
    }

    disablityForAdd() {
        this.disableTagButton = (this.tagName) ? false : true;
    }

    makeItCapital(data) {
        return data.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    addTag() {
        if(this.tagName.trim().length != 0){
            this._spinner.show();
            const data = {
                tag : this.makeItCapital(this.tagName.trim()),
            };
            // console.log(data);
            this.appService.addTag(data).subscribe(
                data => this.addTagSuccess(data),
                error => this.addTagFail(error),
            );
        } else {
            this.tagName = '';
            this.disableTagButton = true;
            this.disableDeleteButton = true;
            this.toastr.error( this.userUtility.errorMessages['TAG_INVALID_ENTRY']);
        }
    }

    addTagSuccess(res) {
        this._spinner.hide();
        if (res.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['TAG_EXIST']);
        } else {
            this.getAllTags();
            this.toastr.success(this.userUtility.successMessages['ADD_TAG_SUCCESS']);
        }
        this.tagName = '';
        this.disableTagButton = true;
    }

    addTagFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    editVendor(event) {
        this.router.navigate(['editVendor'], { queryParams: { id: event.data.id } });
    }

    deleteTag() {
        this.deleteVendorModal.open();
    }

    deleteTagFinal() {
        this.deleteVendorModal.close();
        this._spinner.show();
        const data = {
            'tags' : this.allDeleteTags,
        };
        this.appService.deleteTags(data).subscribe(
            data => this.deleteTagSuccess(data),
            error => this.deleteTagFail(error),
        );
    }

    deleteTagSuccess(res) {
        this._spinner.hide();
        if (res.data.code < 0) {
            this.toastr.success('Category deleted failed');
        } else {
            if (res.data.message == '-302') {
                this.toastr.error('Category can not be deleted as used in Vendors');
                this.deleteVendorModal.close();
            } else if (res.data.message == '-303') {
                this.toastr.error('Category can not be deleted as used in Items');
                this.deleteVendorModal.close();
            } else {
                this.toastr.success('Categories deleted successfully');
                this.disableDeleteButton = true;
                this.allDeleteTags = [];
                this.deleteVendorModal.close();
                this.getAllTags();
            }
        }
    }

    deleteTagFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }
}
