import {
    Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren, Input, Output,
    OnInit, EventEmitter
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Router} from '@angular/router';
import {LocalDataSource} from 'ng2-smart-table/index';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {PaginationService} from "../../appServices/paginationService";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {BlankSpaceValidator} from "../../theme/validators/blank.validator";
import {Modal} from 'ng2-modal';
import {DatePipe} from '@angular/common';
import {EqualPasswordsValidator} from "../../theme/validators/equalPasswords.validator";
import {ViewCell} from "ng2-smart-table/components/cell/cell-view-mode/view-cell";
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'category-view',
    styleUrls: ['./vendor.scss'],
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


// ------------------------------------------------------------------------- //

@Component({
    selector: 'vendors',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./vendor.scss'],
    templateUrl: './vendor.html',
    providers: [PaginationService],
})

export class VendorComponent {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    vendorId: any;
    perPage: any = 10;
    modelChanged: Subject<string> = new Subject<string>();
    searchvalue: any;
    totalCount: any;
    current_page: any = 1;
    vendorList: any = [];
    imageUrl: string;
    showError: boolean = false;
    settingComponent: boolean = true;
    passwordComponent: boolean = false;
    notificationComponent: boolean = false;
    accreditionComponent: boolean = false;

    settings: any = {
        mode: 'external',
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
            // tag_name : {
            //     title: 'Tags',
            // },
            tag_list: {
                title: 'Categories',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction(instance) {
                    instance.save.subscribe(row => {
                        console.log(row);
                    });
                },
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
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                private pageService: PaginationService,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Vendors');

        this.modelChanged
            .debounceTime(300) // wait 300ms after the last event before emitting last event
            .distinctUntilChanged() // only emit if value is different from previous value
            .subscribe(str => {
                this.searchVendor(str.trim());
            });
    }

    getPageData(page) {
        this.current_page = page;
        this.getVendorDetails(page);
    }

    changed(event: string) {
        this.modelChanged.next(event);
    }


    ngOnInit() {
        this.getVendorDetails(this.current_page);
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
            }, {validator: EqualPasswordsValidator.validate('newPassword', 'confirmPassword')}),
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
        this.router.navigate(['addVendor']);
    }

    editVendor(event) {
        this.router.navigate(['editVendor'], {queryParams: {id: event.data.id}});
    }

    deleteVendor(event) {
        this.vendorId = event.data.id;
        this.deleteVendorModal.open();
    }

    deleteVendorFinal() {
        this.deleteVendorModal.close();
        this._spinner.show();
        const deleteId = {
            id: this.vendorId,
        };

        this.appService.deleteVendor(deleteId).subscribe(
            data => this.deleteVendorSuccess(data),
            error => this.deleteVendorFail(error),
        );
    }

    deleteVendorSuccess(data) {
        this._spinner.hide();
        this.deleteVendorModal.close();
        if (data.data.code == '-304') {
            this.toastr.error('Vendor can not be deleted as used in Purchase Order');
        } else if (data.data.code == '-301') {
            this.toastr.error('Vendor can not be deleted as used in Vendor Items');
        } else {
            this.toastr.success('Vendor deleted successfully');
            this.getVendorDetails(this.current_page);
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

    searchVendor(event) {
        this._spinner.show();
        const searchValue: any = { search_input: event };
        this.pageService.getVendorsBySearch(searchValue, this.current_page).subscribe(
            data => this.getVendorsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getVendorDetails(page) {
        this._spinner.show();
        this.pageService.getVendors(page).subscribe(
            data => this.getVendorsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getVendorsSuccess(res) {
        this.vendorList = [];
        this.totalCount = '';
        this.source.reset();
        const response: any = res.data[0];
        this.vendorList = Array.from(response.data);
        this.totalCount = response.total;
        let mockArray = [];
        mockArray[0] = response.data;
        mockArray[0].forEach(val => {
            if (val.tag_name) {
                if (val.tag_name.indexOf(',') == -1) {
                    val.tag_list = val.tag_name.split();
                } else {
                    val.tag_list = val.tag_name.split(',');
                }
            } else {
                val.tag_list = [];
            }
        });
        this.source.load(mockArray[0]);
        this._spinner.hide();
    }

    getVendorsFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }
}
