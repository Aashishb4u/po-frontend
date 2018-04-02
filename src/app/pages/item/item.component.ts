import {
    Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren, OnInit,
    EventEmitter, Output, Input
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Router} from '@angular/router';
import {LocalDataSource, ViewCell} from 'ng2-smart-table/index';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {PaginationService} from "../../appServices/paginationService";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {BlankSpaceValidator} from "../../theme/validators/blank.validator";
import {Modal} from 'ng2-modal';
import {EqualPasswordsValidator} from "../../theme/validators/equalPasswords.validator";
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'category-view',
    styleUrls: ['../item/item.scss'],
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
    selector: 'viewItem',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./item.scss'],
    templateUrl: './item.html',
    providers: [PaginationService]
})

export class itemComponent {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    vendorId: any;
    itemList: any = [];
    totalCount: any;
    modelChanged: Subject<string> = new Subject<string>();
    searchvalue: any;
    perPage: any = 10;
    current_page: any = 1;
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
        },
        columns: {
            name: {
                title: 'Item Name',
            },
            description: {
                title: 'Item Description',
            },
            tag_list: {
                title: 'Categories',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction(instance) {
                    instance.save.subscribe(row => {
                    });
                },
            },
        },
        add: {
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="ion-edit" title="Edit Items"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Items"></i>',
            confirmDelete: true,
        },
    };

    constructor(private router: Router,
                private pageServices: PaginationService,
                private fb: FormBuilder,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Items');

        this.modelChanged
            .debounceTime(300) // wait 300ms after the last event before emitting last event
            .distinctUntilChanged() // only emit if value is different from previous value
            .subscribe(str => {
                this.getItemsBySearch(str.trim());
            });
    }

    getPageData(page) {
        this.current_page = page;
        this.getItemDetails(page);
    }

    changedItem(event: string) {
        this.modelChanged.next(event);
    }

    ngOnInit() {
        this.getItemDetails(this.current_page);
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

    addItem() {
        this.router.navigate(['addItem']);
    }

    editItem(event) {
        this.router.navigate(['editItem'], { queryParams: { id: event.data.id } });
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

        this.appService.deleteItem(deleteId).subscribe(
            data => this.deleteVendorSuccess(data),
            error => this.deleteVendorFail(error),
        );
    }

    deleteVendorSuccess(data) {
        this._spinner.hide();
        if (data.data.message == '-300') {
                this.toastr.error('Item can not be deleted as used in Purchase Order');
            this.deleteVendorModal.close();
        } else if (data.data.message == '-301') {
                this.toastr.error('Item can not be deleted as used in Item Vendors');
            this.deleteVendorModal.close();
        } else {
            this.toastr.success('Item deleted successfully');
            this.deleteVendorModal.close();
            this.getItemDetails(this.current_page);
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

    getItemDetails(page) {
        this._spinner.show();
        this.pageServices.getItems(page).subscribe(
            data => this.getVendorsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getItemsBySearch(event) {
        this._spinner.show();
        const searchValue: any = { search_input: event };
        this.pageServices.getItemsBySearch(searchValue, this.current_page).subscribe(
            data => this.getVendorsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getVendorsSuccess(res) {
        const response: any = res.data[0];
        this.itemList = [];
        this.totalCount = '';
        this.source.reset();
        this.itemList = Array.from(response.data);
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
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }
}
