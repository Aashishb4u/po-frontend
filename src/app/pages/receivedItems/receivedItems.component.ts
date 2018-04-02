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
    selector: 'receivedItems',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./receivedItems.scss'],
    templateUrl: './receivedItems.html',
    providers: [PaginationService]
})

export class receivedItems {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChild('addPaymentModal') addPaymentModal: Modal;
    @ViewChild('editPaymentModal') editPaymentModal: Modal;
    @ViewChild('addItemReceivedModal') addItemReceivedModal: Modal;
    @ViewChild('editItemReceivedModal') editItemReceivedModal: Modal;

    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    additemReceivedForm: FormGroup;
    edititemReceivedForm: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    disableButton: any = false;
    itemReceivedList: any = [];
    vendorId: any;
    vendorInformation: any = {};
    paymentId: any;
    logId: any;
    deleteItemId: any;
    payMode: any;
    numberMask: any;
    preDate: any;
    date: any;
    paymentAmount: any;
    paymentAmountEdit: any;
    selectedMode: any;
    showMeButton: any = true;
    dateNew: any;
    dateEdit: any;
    addPurchaseItemQuantity: any;
    editPurchaseItemQuantity: any;
    purchaseId: any;
    itemList: any = [];
    purchaseItems: any = [];
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
    myDateCron1PickerOptions: IMyOptions;

    settings: any = {
        mode : 'external',
        actions: {
            columnTitle: 'Actions',
        },
        columns: {
            item_name: {
                title: 'Item Name',
            },
            date: {
                title: 'Date',
            },
            price: {
                title: 'Price ( ₹ )',
            },
            quantity: {
                title: 'Quantity ',
            },

        },
        add: {
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        edit: {
            // editButtonContent: '<i class="ion-edit" title="Edit Payment Details"></i>',
            editButtonContent: '',
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
        this.numberMask = [/[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
        this.authentication.setChangedContentTopText('Received Items Details');
        console.log(this.date, 'TODAY DATE');
        this.modelChanged
            .debounceTime(300) // wait 300ms after the last event before emitting last event
            .distinctUntilChanged() // only emit if value is different from previous value
            .subscribe(str => {
                this.getItemsBySearch(str.trim());
            });
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
    }

    getPayMode(event) {
        this.payMode = event.target.value;
    }

    ngAfterViewInit() {
        this.viewPurchasebyId(this.purchaseId);
    }

    closeAddModal() {
        this.addItemReceivedModal.close();
        this.additemReceivedForm.controls['item'].setValue('');
        this.additemReceivedForm.controls['price'].setValue('');
        this.additemReceivedForm.controls['quantity_purchased'].setValue('');
        this.additemReceivedForm.controls['quantity_received'].setValue('');
        this.clearDate();
    }

    closeEditModal() {
        this.editItemReceivedModal.close();
        this.edititemReceivedForm.controls['item'].setValue('');
        this.edititemReceivedForm.controls['quantity_purchased'].setValue('');
        this.edititemReceivedForm.controls['quantity_received'].setValue('');
        this.edititemReceivedForm.controls['date'].setValue(this.date);
    }

    userBasicInfo() {
        this.additemReceivedForm = this.fb.group({
            'poNumber': this.fb.control(''),
            'item': this.fb.control('', Validators.compose([Validators.required])),
            'price': this.fb.control(''),
            'date': this.fb.control('', Validators.compose([Validators.required])),
            'quantity_purchased': this.fb.control(''),
            'quantity_received': this.fb.control('', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),

        });

        this.edititemReceivedForm = this.fb.group({
            'poNumber': this.fb.control(''),
            'item': this.fb.control(''),
            'date': this.fb.control('', Validators.compose([Validators.required])),
            'price': this.fb.control(''),
            'quantity_purchased': this.fb.control(''),
            'quantity_received': this.fb.control('', Validators.compose([Validators.required])),

        });


        // this.edititemReceivedForm = this.fb.group({
        //     'purchaseId': this.fb.control('', Validators.compose([Validators.required])),
        //     'vendor': this.fb.control(''),
        //     'price': this.fb.control(''),
        //     'quantity': this.fb.control('', Validators.compose([Validators.required])),
        //     'date': this.fb.control(''),
        // });
    }

    editItemReceivedDetails(event) {
        let data: any = event.data;
        console.log(data.date,'data.date');
        let quantity_purchased: any = 0;
        this.edititemReceivedForm.controls['item'].setValue(data.id_item);
        this.edititemReceivedForm.controls['price'].setValue(data.price);
        this.edititemReceivedForm.controls['quantity_received'].setValue(data.quantity);
        this.edititemReceivedForm.controls['date'].setValue(data.date);
        this.purchaseItems.map(val => {
            if (val.id_item == data.id_item) {
                quantity_purchased = val.quantity;
            }
        });
        this.edititemReceivedForm.controls['quantity_purchased'].setValue(quantity_purchased);
        this.editItemReceivedModal.open();
    }

    addItemReceivedFinal(values) {
        if (values.quantity_purchased < values.quantity_received) {
            this.toastr.error('Quantity Received should be greater than Quantity Purchased');
        } else {
            this.disableButton = true;
            this._spinner.show();
            const data = {
                vendor_id: this.vendorId,
                id_item: values.item,
                purchase_id: this.purchaseId,
                quantity: values.quantity_received,
                date: values.date.formatted,
                price: values.price,
            };
            this.appService.onAddItemQuantityDetails(data).subscribe(
                data => this.onAddPaymentDetailsSuccess(data),
                error => this.deleteVendorFail(error),
            );
        }
    }

    setDate(): void {
        // Set today date using the patchValue function
        let date = new Date();
        this.additemReceivedForm.patchValue({date: {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()}
        }});
    }

    clearDate(): void {
        // Clear the date using the patchValue function
        this.additemReceivedForm.patchValue({date: null});
    }

    editItemReceivedFinal(values) {
        if (values.quantity_purchased < values.quantity_received) {
            this.toastr.error('Quantity Purchased should be greater than Quantity Received');
        } else {
            this._spinner.show();
            const dateSelected: any = (this.dateEdit) ? this.dateEdit : this.date;
            const data = {
                vendor_id: values.poNumber,
                item_id: values.item,
                quantity_purchased: values.quantity_purchased,
                quantity_received: values.quantity_received,
                date: values.date,
            };
            console.log(data);
            // this.appService.onAddItemQuantityDetails(data).subscribe(
            //     data => this.onAddPaymentDetailsSuccess(data),
            //     error => this.deleteVendorItemsFail(error),
            // );
            // this.showMeButton = false;
            // this.deleteVendorModal.close();
        }

    }

    viewPurchasebyId(data) {
        this._spinner.show();
        const vendorData = {purchase_id: data};
        this.appService.viewPurchasebyId(vendorData).subscribe(
            data => this.setPurchaseDataSuccess(data),
            error => this.setDataFail(error)
        );
    }

    onPurchaseItemChange(event) {
        const data: any = {
            'id_item': event.target.value,
            'purchase_id': this.purchaseId,
        };
        const itemId = event.target.value;
        const purchaseId = this.purchaseId;
        this.appService.showPurchaseDetailByItemId(data).subscribe(
            data => this.showPurchaseDetailSuccess(data),
            error => this.deleteVendorFail(error),
        );
    }

    showPurchaseDetailSuccess(res) {
        if (res.code < 0) {
            // toastr.error(data.message);
            this.deleteVendorModal.close();
        } else {
            this.additemReceivedForm.controls['quantity_purchased'].setValue(res.data[0].quantity);
            this.additemReceivedForm.controls['price'].setValue(res.data[0].price);
        }
    }

    onEditPurchaseItemChange(event) {
        let item_id = event.target.value;
        this.purchaseItems.map(val => {
            if (item_id == val.id_item) {
                this.editPurchaseItemQuantity = val.quantity;
                this.edititemReceivedForm.controls['quantity_purchased'].setValue(val.quantity);
                this.edititemReceivedForm.controls['price'].setValue(val.price);
            }
        });
    }

    setPurchaseDataSuccess(res) {
        this._spinner.hide();
        this.purchaseItems = [];
        res.data[0].forEach(val => {
            this.purchaseItems.push(val);
        });
        // this.purchaseItems

    }

    changedItem(event: string) {
        this.modelChanged.next(event);
    }

    ngOnInit() {
        this.purchaseId = this.routes.snapshot.queryParams['purchaseId'];
        this.vendorId = this.routes.snapshot.queryParams['id'];
        // this.getPaymentDetailsByIds(this.current_page);
        // this.getVendorById(this.vendorId);
        this.userBasicInfo();
        this.getItemsReceivedDetails(this.current_page);
        this.additemReceivedForm.controls['poNumber'].setValue(this.purchaseId);
        this.edititemReceivedForm.controls['poNumber'].setValue(this.purchaseId);
    }

    onUsedDateChanged(event) {
        this.dateNew = event.formatted;
        console.log(this.dateNew, 'this.dateNew');
        this.crondate1Avail();
    }

    onEditItemsReceivedDateChanged(event) {
        this.dateEdit = event.formatted;
        console.log(this.dateEdit, 'this.dateNew');
        this.crondate1Avail();
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
        // this.getUserData = userData;
        // if (this.getUserData.firstName) {
        //     this.form.controls['firstName'].setValue(this.getUserData.firstName);
        // }
        // if (this.getUserData.lastName) {
        //     this.form.controls['lastName'].setValue(this.getUserData.lastName);
        // }
        // if (this.getUserData.email) {
        //     this.form.controls['email'].setValue(this.getUserData.email);
        // }
        // if (this.getUserData.mobileNumber) {
        //     if (this.getUserData.mobileNumber.length > 0) {
        //         const mobileNo = this.getUserData.mobileNumber[0];
        //         this.form.controls['phoneNumber'].setValue(mobileNo);
        //     }
        // }
        // if (this.getUserData.profileImageURL) {
        //     this.imageUrl = this.getUserData.profileImageURL;
        // }
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

    onDeleteItemQuantity() {
        // console.log(event);

    }

    deleteItemQuantitySuccess(res){
        if (res.code < 0) {
        } else {
            // this.deleteItemQuantityModal.close();
            this._spinner.hide();
            this.getItemsReceivedDetails(this.current_page);
            // this.itemQuantityLog = '';
            this.toastr.success('Received Item details deleted Successfully');
            // this.getItemsQuantity();
            // this.getItemsById(this.id);
            // this.getUsedItemsQuantity();
        }
    }

    deleteItemReceivedFinal() {
        this.deleteVendorModal.close();
        this._spinner.show();
        const deleteId = {
            'item_id' : this.deleteItemId,
            'log_id' : this.logId,
        };
        console.log(deleteId,'-----00-----');
        this.appService.deleteItemQuantity(deleteId).subscribe(
            data => this.deleteItemQuantitySuccess(data),
            error => this.deleteVendorFail(error),
        );
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

    deleteItemReceived(event) {
        // console.log(event.data,'event.data');
        this.logId = event.data.log_id;
        this.deleteItemId = event.data.id_item;
        // console.log(this.logId,'this.logId');
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
            this.disableButton = false;
            this._spinner.hide();
            this.closeAddModal();
            this.addItemReceivedModal.close();
            this.getItemsReceivedDetails(this.current_page);
            this.toastr.success('Received Items Added Successfully');

        }
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

    getItemsReceivedDetails(page) {
        this._spinner.show();
        const data: any = {
            vendor_id : this.vendorId,
            purchase_id : this.purchaseId,
        };
        this.pageServices.getItemsReceivedDetails(page, data).subscribe(
            data => this.getItemsReceivedDetailsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getPageData(page) {
        this.current_page = page;
        this.getItemsReceivedDetails(this.current_page);
    }

    getItemsReceivedDetailsSuccess(res) {
        this._spinner.hide();
        this.itemReceivedList = [];
        this.itemReceivedList = Array.from(res.data[0].data);
        this.source.load(res.data[0].data);
        let itemPurchased: any;
        this.totalCount = res.data[0].total;
        console.log(res.data[0].data,'RESPONSE1234');
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
        // console.log(response.data[0].data[0]);
        // let amountRecieved: any = 0;
        // this.itemList = Array.from(response.data[0].data);
        // this.itemList.map((item) => {
        //     amountRecieved = amountRecieved + item.payment_amount;
        //     switch (item.payment_mode) {
        //         case 1 : {
        //             item.payment_mode_name = 'Cheque';
        //          break;
        //         }
        //         case 2 : {
        //             item.payment_mode_name = 'Online Transfer';
        //             break;
        //         }
        //         case 3 : {
        //             item.payment_mode_name = 'Cash';
        //             break;
        //         }
        //     }
        // });
        this.totalCount = response.data[0].total;
        this.totalAmount = response.data[1][0].total_amount;
        this.amountRecieved = this.amountRecieved;
        this.amountRemaining = this.totalAmount - this.amountRecieved;
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
