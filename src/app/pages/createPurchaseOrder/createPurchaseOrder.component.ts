import {
    Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren, Input, Output,
    OnInit,EventEmitter
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router';
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
import {PaginationService} from "../../appServices/paginationService";
import {Utility} from "../../utilityServices/app.utility";

@Component({
    selector: 'category-view',
    styleUrls: ['./createPurchaseOrder.scss'],
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
        console.log(this.renderValue,'hey hey hey ');
    }

    onClick() {
        this.save.emit(this.rowData);
    }
}


// -------------------------------------------------------------------------

@Component({
    selector: 'createPurchaseOrder',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./createPurchaseOrder.scss'],
    templateUrl: './createPurchaseOrder.html',
    providers: [Utility, PaginationService],
})

export class createPurchaseOrder {
    @ViewChild('fileUpload') fileUpload;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    vendorId: any = 0;
    perPageData: any = 10;
    current_page: any = 1;
    totalCount: any;
    purchaseList: any;
    disablePurchaseButton: any = true;
    selectedItemsPurchase: any;
    vendorNamesData: any;
    purchaseId: any;
    deletePurchaseId: any;
    vendorDraftData: any = [];
    imageUrl: string;
    showError: boolean = false;
    settingComponent: boolean = false;
    itemsEmpty: boolean = true;
    draftedPurchase: any;
    passwordComponent: boolean = false;
    disableBuyButton: boolean = true;
    notificationComponent: boolean = false;
    accreditionComponent: boolean = false;
    @ViewChild('sendPurchaseModal') sendPurchaseModal: Modal;
    @ViewChild('deletePurchaseModal') deletePurchaseModal: Modal;

    purchaseSettings: any = {
        mode: 'external',
        actions: {
            position: 'right',
            columnTitle: 'Actions',
            // custom: [
            //     {
            //         name: 'purchase_route',
            //         title: `<i title="Send to Vendor" class="fa fa-envelope-o"></i>`,
            //
            //     },
            // ],
        },
        columns: {
            id: {
                title: 'PO Number',
            },
            total_amount: {
                title: 'Total Amount (₹)',
            },
            amount_recieved: {
                title: 'Total Amount Received (₹)',
            },
            status: {
                title: 'PO Status',
            },
        },

        add: {
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="ion-edit" title="Edit Purchase Order"></i>',
            saveButtonContent: '',
            cancelButtonContent: '',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Purchase Order"></i>',
            confirmDelete: true,
        },
    };

    settings: any = {
        selectMode: 'multi',
        mode: 'external',
        // actions: {
        //     position: 'right',
        //     columnTitle: 'Actions',
        //     // custom: [
        //     //     {
        //     //         name: 'vendor_item_route',
        //     //         title: `<i title="Buy" class="fa fa-inr"></i>`,
        //     //     },
        //     // ],
        // },
        actions: false,
        columns: {
            item_name: {
                title: 'Item Name',
            },
            price: {
                title: 'Price (₹)',
            },
        },

        add: {
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '',
            saveButtonContent: '',
            cancelButtonContent: '',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Item"></i>',
            confirmDelete: true,
        },
    };


    constructor(private router: Router,
                private adminServices: ApplicationAdminServices,
                private fb: FormBuilder,
                private routes: ActivatedRoute,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                private userUtility: Utility,
                private pageService: PaginationService,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Purchase Order');
    }

    getAllVendorsNames() {
        this.appService.getVendorNames().subscribe(
            data => this.getVendorNamesSuccess(data),
            error => this.getVendorNamesFail(error),
        );
    }

    getPageData(page) {
        this.current_page = page;
        this.getPurchaseOrderTabsById(this.vendorId);
    }

    onCustom(data) {
        let route: any = data.action;
        const purchaseComplete: any = data.data.isExist;
        switch (route) {
            case 'purchase_route': {
                if (purchaseComplete) {
                    this.sendPurchaseOrderToVendor(data.data);
                } else {
                    this.toastr.error(this.userUtility.errorMessages['FILL_PURCHASE_ORDER_DETAILS']);
                }
                break;
            }
        }
    }

    sendToVendor () {
        const data: any = {
            purchase_id: this.purchaseId,
            vendor_id: this.vendorId,
        };
        this.appService.sendPurchaseOrderToVendor(data).subscribe(
            data => this.sendPurchaseOrderSuccess(data),
            error => this.getVendorNamesFail(error),
        );
    }

    deletePurchaseOrder() {
        const deleteId = {
            'purchase_id': this.deletePurchaseId,
            'vendor_id': this.vendorId,
        };
        this.appService.deletePurchaseOrder(deleteId).subscribe(
            data => this.deletePurchaseOrderSuccess(data),
            error => this.deletePurchaseOrderFail(error),
        );
    }

    deletePurchaseOrderSuccess(res) {
        if (res.status < 0) {
            this.toastr.error(this.userUtility.successMessages['DELETE_PURCHASE_ORDER_FAIL']);
        } else {
            this.deletePurchaseModal.close();
            this._spinner.hide();
            this.toastr.success(this.userUtility.successMessages['DELETE_PURCHASE_ORDER_SUCCESS']);
            this.getPurchaseOrderTabsById(this.vendorId);
        }
    }

    deletePurchaseOrderFail(err) {
        this.deletePurchaseModal.close();
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error(this.userUtility.successMessages['DELETE_PURCHASE_ORDER_FAIL']);
        }
    }

    sendPurchaseOrderSuccess(data) {
        if (data.status < 0) {
            this.toastr.error(this.userUtility.successMessages['SEND_PURCHASE_ORDER_FAIL']);
        } else {
            this.sendPurchaseModal.close();
            this._spinner.hide();
            this.toastr.success(this.userUtility.successMessages['SEND_PURCHASE_ORDER_SUCCESS']);
            this.getPurchaseOrderTabsById(this.vendorId);
        }
    }

    sendPurchaseOrderToVendor(data) {
        if (data.status == 'Sent') {
            this.toastr.error('Purchase Order has already sent to Vendor');
        } else {
            this.purchaseId = data.id;
            this.sendPurchaseModal.open();
        }
    }

    getPurchaseOrderTabsById(data) {
        this._spinner.show();
        const vendorData = {
            vendor_id: data
        };
        this.pageService.viewPurchaseOrderbyId(vendorData, this.current_page).subscribe(
            data => this.viewPurchaseOrderSuccess(data),
            error => this.viewPurchaseOrderFail(error)
        );
    }

    viewPurchaseOrderSuccess(res) {
        this._spinner.hide();
        this.source.reset();
        this.source.load(res.data[0].data);
        this.settingComponent = (res.data[0].data.length != 0) ? true : false;
        // this.DraftedPurchase = '';
        // this.purchaseSource.reset();
        this.purchaseList = Array.from(res.data[0].data);
        this.totalCount = res.data[1];
        this.disablePurchaseButton = res.data[2].hasDraft;
        // this.purchaseSource.load(this.purchaseList);
        // // this.getPageData(this.current_page);
        // res.data[0].data.forEach((val) => {
        //     if (val.status == 'Draft') {
        //         this.disablePurchaseButton = true;
        //     }
        // });
    }

    viewPurchaseOrderFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    getVendorNamesSuccess(res) {
        this.vendorNamesData = [];
        res.data[0].forEach((item: any) => {
            this.vendorNamesData.push(item);
        });

        res.data[1].forEach((item: any) => {
            this.vendorDraftData.push(item);
        });
    }

    getVendorNamesFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    ngOnInit() {
        this.vendorId = this.routes.snapshot.queryParams['id'];
        if (this.vendorId) {
            this.onSelectVendorId(this.vendorId);
        } else {
            this.vendorId = 0;
        }
        // if (this.vendorId) {
        //     console.log('I am here');
        //     this.getPurchaseOrderTabsById(this.vendorId);
        //     this.getVendorItemsById(this.vendorId);
        // }
        this.getAllVendorsNames();
    }

    onSelectVendorId(event) {
        this.current_page = 1;
        this.vendorId = event;
        // console.log(this.vendorId,'this.vendorId');
        // this.getVendorItemsById(this.vendorId);
        this.checkDraftStatus(this.vendorId);
        this.getVendorItemsById(this.vendorId);
        this.getPurchaseOrderTabsById(this.vendorId);
    }

    onAddPurchaseOrder() {
        this._spinner.show();
        const data = {
            'vendor_id' : this.vendorId,
            'status' : 'Draft',
        };
        this.appService.addPurchaseOrder(data).subscribe(
            data => this.addPurchaseOrderSuccess(data),
            error => this.addPurchaseOrderFail(error),
        );

    }

    addPurchaseOrderSuccess(result) {
        this._spinner.hide();
        if (result.status < 0) {
            if (result.data.code == '-305') {
                this.toastr.error('Please add terms and conditions to this vendor');
            } else {
                this.toastr.error('Purchase order added failed');
            }
        } else {
            this.purchaseId = result.data.purchase_id;
            this.router.navigate(['purchaseOrder'], {queryParams: {id: this.vendorId, purchase_id : this.purchaseId}});
            this.toastr.success('Purchase Order Added successfully');
        }
    }

    addPurchaseOrderFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }


    editPurchaseTab(res) {
        const isDetailsExist: any = res.data.isExist;
        if (isDetailsExist) {
            this.router.navigate(['editPurchaseOrder'],
                { queryParams: { id: this.vendorId, purchaseId : res.data.id, route: 'purchase_page' } });
        } else {
            // if (this.vendorItemData.length == 0) {
            //     this.toastr.error(this.userUtility.errorMessages['NO_VENDOR_ITEMS']);
            // } else {
                this.router.navigate(['purchaseOrder'],
                    {queryParams: {id: this.vendorId, purchase_id : res.data.id, route: 'purchase_page' }});
            // }
        }
    }

    removePurchaseTab(res) {
        console.log(this.vendorId,'RESPONSE');
        this.deletePurchaseId = res.data.id;
        this.deletePurchaseModal.open();
    }

    checkDraftStatus(id) {
        this.draftedPurchase = '';
        this.vendorDraftData.forEach(val => {
            if (val.id_user == id) {
                this.draftedPurchase = val;
            }
        });
    }

    getVendorItemsById(data) {
        this._spinner.show();
        const vendorData = {id: data};
        this.appService.getVendorItemsById(vendorData).subscribe(
            data => this.getVendorItemsByIdSuccess(data),
            error => this.setDataFail(error)
        );
    }

    setDataFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Vendors Item Id is Incorrect');
        }
    }

    getVendorItemsByIdSuccess(res) {
        this._spinner.hide();
        console.log(res.data[0],'res.data[0]');
        // this.source.reset();
        // this.source.load(res.data[0]);
        this.itemsEmpty = (res.data[0].length == 0) ? true : false;
    }

    onSelectVendorsItem(event) {
        // this._spinner.show();
        this.selectedItemsPurchase = [];
        this.selectedItemsPurchase = Array.from(event.selected);
        this.disableBuyButton = (this.selectedItemsPurchase.length == 0) ? true : false;
    }

    // buyItemsOnSelect() {
    //     const vendorData = {
    //         vendor_id: this.vendorId,
    //         id_item_array: this.selectedItemsPurchase,
    //     };
    //     localStorage.setItem('item_array', JSON.stringify(vendorData));
    //     console.log(this.draftedPurchase,'this.draftedPurchase');
    //     if (this.draftedPurchase) {
    //         this.router.navigate(['editPurchaseOrder'],
    //             { queryParams: { id: this.vendorId, purchaseId: this.draftedPurchase.purchase_id, route: 'onSelect' } });
    //     } else {
    //         this.router.navigate(['purchaseOrder'],
    //             { queryParams: { id: this.vendorId, route: 'onSelect' } });
    //     }
    // }

    addVendor() {
        this.router.navigate(['addVendor']);
    }

    editVendor(event) {
        this.router.navigate(['editVendor'], { queryParams: { id: event.data.id } });
    }

    deleteVendor(event) {
        this.vendorId = event.data.id;
    }
}
