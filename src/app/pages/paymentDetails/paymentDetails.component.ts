import {
    Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren, OnInit,
    EventEmitter, Output, Input
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router';
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
import {IMyOptions, IMyDate} from "mydatepicker";

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
    selector: 'paymentDetails',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./paymentDetails.scss'],
    templateUrl: './paymentDetails.html',
    providers: [PaginationService]
})

export class paymentDetails {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChild('addPaymentModal') addPaymentModal: Modal;
    @ViewChild('editPaymentModal') editPaymentModal: Modal;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    vendorId: any;
    vendorInformation: any = {};
    paymentId: any;
    payMode: any;
    paymentMode: any = 0;
    numberMask: any;
    preDate: any;
    date: any;
    paymentAmount: any;
    paymentAmountEdit: any;
    selectedMode: any;
    showMeButton: any = true;
    dateNew: any;
    dateEdit: any;
    purchaseId: any;
    itemList: any = [];
    amountRecieved: any = 0;
    amountRemaining: any = 0;
    totalCount: any;
    totalAmount: any;
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
    selectedDate: any;
    myDateCron1PickerOptions: IMyOptions;

    settings: any = {
        mode : 'external',
        actions: {
            columnTitle: 'Actions',
        },
        columns: {
            purchase_id: {
                title: 'PO Number',
            },
            date: {
                title: 'Date',
            },
            payment_mode_name: {
                title: 'Payment Mode',
            },
            payment_amount: {
                title: 'Amount ( ₹ )',
            },

        },
        add: {
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="ion-edit" title="Edit Payment Details"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Payment Details"></i>',
            confirmDelete: true,
        },
    };

    constructor(private router: Router,
                private pageServices: PaginationService,
                private fb: FormBuilder,
                private routes: ActivatedRoute,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.preDate = new Date().toISOString().slice(0, 10).split('-');
        this.date = this.preDate[2] + '-' + this.preDate[1] + '-' + this.preDate[0];
        this.dateNew = this.date;
        this.selectedDate = '';
        this.numberMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
        this.authentication.setChangedContentTopText('Payment Details');
        console.log(this.date, 'TODAY DATE');
        this.modelChanged
            .debounceTime(300) // wait 300ms after the last event before emitting last event
            .distinctUntilChanged() // only emit if value is different from previous value
            .subscribe(str => {
                this.getItemsBySearch(str.trim());
            });
    }

    getPageData(page) {
        this.current_page = page;
        this.getPaymentDetailsByIds(page);
    }

    getPayMode(event) {
        this.payMode = event.target.value;
    }

    changedItem(event: string) {
        this.modelChanged.next(event);
    }

    paymentModalClose() {
        this.paymentAmount = 0;
        this.selectedDate = '';
        this.dateNew = '';
        this.paymentMode = 0;
        this.payMode = 0;
        this.addPaymentModal.close();
    }

    ngOnInit() {
        this.myDateCron1PickerOptions = {
            dateFormat: 'dd-mm-yyyy',
            showTodayBtn : true,
            firstDayOfWeek: 'mo',
            showClearDateBtn: false,
            disableSince: {year: this.preDate[0], month: this.preDate[1], day: ((+this.preDate[2]) + 1) },
            sunHighlight: true,
            height: '34px',
            inline: false,
            selectionTxtFontSize: '12px',
        };
        this.purchaseId = this.routes.snapshot.queryParams['purchaseId'];
        this.vendorId = this.routes.snapshot.queryParams['id'];
        this.getPaymentDetailsByIds(this.current_page);
        this.getVendorById(this.vendorId);

    }

    getVendorById(data) {
        this._spinner.show();
        const vendorData = {id: data};
        this.appService.viewVendorbyId(vendorData).subscribe(
            data => this.setDataSuccess(data),
            error => this.setDataFail(error)
        );
    }

    setDataSuccess(res) {
        console.log(res.data[0][0],'Vendor');
        this.vendorInformation = res.data[0][0];
    }

    setDataFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    onDate1Changed(event) {
        this.dateNew = event.formatted;
        console.log(this.dateNew, 'this.dateNew');
        this.crondate1Avail();
    }

    onDate1ChangedEdit(event) {
        this.dateEdit = event.formatted;
        console.log(this.dateEdit, 'this.dateNew');
        this.crondate1Avail();
    }

    crondate1Avail() {
        this.myDateCron1PickerOptions = {
            dateFormat: 'dd-mm-yyyy',
            showTodayBtn : true,
            firstDayOfWeek: 'mo',
            showClearDateBtn: false,
            sunHighlight: true,
            height: '34px',
            inline: false,
            selectionTxtFontSize: '12px',
        };
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

    deletePaymentFinal() {
        this.deleteVendorModal.close();
        this._spinner.show();
        const deleteId = {
            payment_id: this.paymentId,
        };

        this.appService.deletePaymentDetail(deleteId).subscribe(
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
            this.toastr.success('Payment Details deleted successfully');
            this.deleteVendorModal.close();
            this.getPaymentDetailsByIds(this.current_page);
        }
    }

    triggers() {
        this.fileUpload.nativeElement.click();
    }

    addPaymentDetails() {
        this.addPaymentModal.open();
        // this.router.navigate(['addItem']);
    }

    editPaymentDetails(event) {
        this.paymentId = event.data.id;
        this.dateEdit = event.data.date;
        this.paymentAmountEdit = event.data.payment_amount;
        this.selectedMode = event.data.payment_mode;
        this.editPaymentModal.open();
        console.log(event.data,'DATA');
        // this.router.navigate(['editItem'], { queryParams: { id: event.data.id } });
    }

    editPaymentFinal() {
        this.showMeButton = false;
        this.deleteVendorModal.close();
        // this._spinner.show();
        const dateSelected: any = (this.dateNew) ? this.dateNew : this.date;
        const data = {
            payment_id: this.paymentId,
            date: this.dateEdit,
            payment_mode: this.selectedMode,
            payment_amount: this.paymentAmountEdit,
        };
        console.log(data,'data');
        this.appService.onEditPaymentDetails(data).subscribe(
            data => this.onEditPaymentDetailsSuccess(data),
            error => this.deleteVendorFail(error),
        );
    }

    deletePayment(event) {
        this.paymentId = event.data.id;
        this.deleteVendorModal.open();
    }

    addPaymentFinal() {
        this.showMeButton = false;
        this.deleteVendorModal.close();
        this._spinner.show();
        const dateSelected: any = (this.dateNew) ? this.dateNew : this.date;
        const data = {
            vendor_id: this.vendorId,
            date: dateSelected,
            purchase_id: this.purchaseId,
            payment_mode: this.payMode,
            payment_amount: this.paymentAmount,
            amount_received: this.amountRecieved,
        };
        console.log(data,'data');
        this.appService.onAddPaymentDetails(data).subscribe(
            data => this.onAddPaymentDetailsSuccess(data),
            error => this.deleteVendorFail(error),
        );
    }

    onAddPaymentDetailsSuccess(data) {
        if (data.code < 0) {
            // toastr.error(data.message);
            this.addPaymentModal.close();
        } else {
            this._spinner.hide();
            this.toastr.success('Payment Details Added Successfully');
            this.addPaymentModal.close();
            this.getPaymentDetailsByIds(this.current_page);
        }
        this.paymentAmount = 0;
        this.showMeButton = true;
    }

    onEditPaymentDetailsSuccess(data) {
        if (data.code < 0) {
            // toastr.error(data.message);
            this.editPaymentModal.close();
        } else {
            this._spinner.hide();
            this.toastr.success('Payment Details Edited Successfully');
            this.editPaymentModal.close();
            this.getPaymentDetailsByIds(this.current_page);
        }
        this.showMeButton = true;
        this.paymentAmountEdit = 0;
    }

    deleteVendorFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    getPaymentDetailsByIds(page) {
        this._spinner.show();
        const data: any = {
            vendor_id : this.vendorId,
            purchase_id : this.purchaseId,
        };
        this.pageServices.getPaymentDetails(page, data).subscribe(
            data => this.getPaymentDetailsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getItemsBySearch(event) {
        this._spinner.show();
        const searchValue: any = { search_input: event };
        this.pageServices.getItemsBySearch(searchValue, this.current_page).subscribe(
            data => this.getPaymentDetailsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getPaymentDetailsSuccess(response) {
        console.log(response.data[0].data[0]);
        let amountRecieved: any = 0;
        this.itemList = Array.from(response.data[0].data);
        this.itemList.map((item) => {
            amountRecieved = amountRecieved + item.payment_amount;
            switch (item.payment_mode) {
                case 1 : {
                    item.payment_mode_name = 'Cheque';
                 break;
                }
                case 2 : {
                    item.payment_mode_name = 'Online Transfer';
                    break;
                }
                case 3 : {
                    item.payment_mode_name = 'Cash';
                    break;
                }
            }
        });
        this.totalCount = response.data[0].total;
        this.totalAmount = response.data[1][0].total_amount;
        this.amountRecieved = amountRecieved;
        this.amountRemaining = this.totalAmount - this.amountRecieved;
        this.source.load(this.itemList);
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
