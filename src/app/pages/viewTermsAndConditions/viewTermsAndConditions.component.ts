import {
    Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren, Input, Output,
    OnInit,EventEmitter
} from '@angular/core';
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
import {ViewCell} from "ng2-smart-table/components/cell/cell-view-mode/view-cell";

@Component({
    selector: 'category-view',
    styleUrls: ['./viewTermsAndConditions.scss'],
    template: `        
    <span *ngFor="let value of this.renderValue ">
        <span class="tagsSmart">{{value}} </span>
    </span>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
    renderValue: any = [];

    @Input() value: any;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = [];
        this.value.forEach((val) => {
            if (val) {
               this.renderValue.push(val);
            }
        });
    }

    onClick() {
        this.save.emit(this.rowData);
    }
}


@Component({
    selector: 'viewTermsAndConditions',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./viewTermsAndConditions.scss'],
    templateUrl: './viewTermsAndConditions.html',
})

export class viewTermsAndConditionsComponent {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    tagId: any;
    termId: any;
    termsList: any = [];
    current_page: any = 1;
    perPage: any = 10;
    totalCount: any;
    vendorId: any;
    imageUrl: string;
    showError: boolean = false;
    settingComponent: boolean = true;
    passwordComponent: boolean = false;
    notificationComponent: boolean = false;
    accreditionComponent: boolean = false;

    settings: any = {
        mode : 'external',
        actions: {
            columnTitle: 'Actions',
            // custom: [
            //     {
            //         name: 'vendor_prices_route',
            //         title: `<i title="Vendor Prices" class="fa fa-inr"></i>`,
            //     },
            // ],
        },
        columns: {
            tag_name: {
                title: 'Categories',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction(instance) {
                    instance.save.subscribe(row => {
                    });
                },
            },
            status: {
                title: 'Status',
            },
        },

        add: {
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="ion-edit" title="Edit Terms"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Terms"></i>',
            confirmDelete: true,
        },
    };

    constructor(private router: Router,
                private adminServices: ApplicationAdminServices,
                private fb: FormBuilder,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Terms And Conditions');
    }

    ngOnInit() {
        this.getVendorDetails();
    }

    onCustom(data) {
        if(data.action == 'vendor_prices_route'){
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

    triggers() {
        this.fileUpload.nativeElement.click();
    }

    addVendor() {
        this.router.navigate(['addTermsAndCondition']);
    }

    editVendor(event) {
        this.router.navigate(['editTermsAndCondition'], { queryParams: { id: event.data.id_terms } });
    }

    deleteVendor(event) {
        this.tagId = event.data.id_tag;
        this.termId = event.data.id_terms;
        this.deleteVendorModal.open();
    }

    deleteVendorFinal() {
        this.deleteVendorModal.close();
        this._spinner.show();
        const deleteId = {
            id_term: this.termId,
            id_tag: this.tagId,
        };

        this.appService.deleteTerms(deleteId).subscribe(
            data => this.deleteVendorSuccess(data),
            error => this.deleteVendorFail(error),
        );
    }

    deleteVendorSuccess(data) {
        if (data.code < 0) {
            // toastr.error(data.message);
            this.deleteVendorModal.close();
        } else {
            this._spinner.hide();
            this.toastr.success('Terms and Conditions deleted successfully');
            this.deleteVendorModal.close();
            this.getVendorDetails();
        }
    }

    deleteVendorFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    getPageData(page) {
        console.log(page,'PAGE');
        this.current_page = page;
        this.getVendorDetails();
    }

    getVendorDetails() {
        const data: any = {
            page_number : this.current_page,
            limit: this.perPage,
        };
        this.appService.getTermsData(data).subscribe(
            data => this.getVendorsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getVendorsSuccess(res) {
        let mockArray: any = [];
        this.termsList = [];
        this.termsList = Array.from(res.data[0]);
        this.totalCount = res.data[1];
        mockArray = res.data[0];
        mockArray.forEach(val => {
            val.status = 'Yes';
        });
        this.source.load(mockArray);
    }

    getVendorsFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }
}
