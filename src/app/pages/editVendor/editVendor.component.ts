import {Component, ViewContainerRef, ViewChildren, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {PaginationService} from "../../appServices/paginationService";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {ActivatedRoute, Router} from '@angular/router';
import {Utility} from "../../utilityServices/app.utility";
import {LocalDataSource} from "ng2-smart-table";
import {Modal} from "ng2-modal";

@Component({
    selector: 'editVendor',
    styleUrls: ['./editVendor.scss'],
    templateUrl: './editVendor.html',
    providers: [Utility, PaginationService],
})


export class editVendor {
    form: FormGroup;
    financeForm: FormGroup;
    imageUrl: string;
    tagsArray: any = [];
    tagData: any = [];
    deletetaglist: any = [];
    categoryData: any = [];
    numberData: any = [];
    itemNamesData: any = [];
    assignTagsArray: any = [];
    statesData: any = [];
    financeTab: boolean = false;
    contactTab: boolean = true;
    contactMessage: boolean;
    pinMessage: boolean;
    vendor: any;
    tagSelected: any;
    termId: any;
    termData: any;
    purchaseId: any;
    vendorData: any = [];
    vendorItemData: any = [];
    vendorItemDataPurchse: any = [];
    id_user: any;
    purchaseOrder: any = {
        poNumber : [],
        totalAmount : 0,
        amountRecieved : 0,
        postatus : 'Draft',
    };
    numberMask: any;
    itemSelected: any = 0;
    itemPrice: any;
    deleteItemVendorId: any;
    pinMask: any;
    accountMask: any;
    perPageData: any = 10;
    current_page: any = 1;
    totalCount: any;
    description: any;
    DraftedPurchase: any;
    totalResult: any = 0;
    placeHolderForTag: any;
    id: any;
    selectedItemsPurchase: any=[];
    purchaseList: any=[];
    deletePurchaseId: any;
    route: any;
    purchaseTab: boolean = false;
    disablePurchaseButton: boolean = true;
    disableBuyButton: boolean = true;
    vendorItemsTab: boolean = false;
    paymentTab: boolean = false;
    @ViewChild('deleteVendorItemModal') deleteVendorItemModal: Modal;
    @ViewChild('deletePurchaseModal') deletePurchaseModal: Modal;
    @ViewChild('sendPurchaseModal') sendPurchaseModal: Modal;
    @ViewChildren('vendorName') firstField;
    source: LocalDataSource = new LocalDataSource();
    purchaseSource: LocalDataSource = new LocalDataSource();

    settings: any = {
        selectMode: 'multi',
        mode: 'external',
        actions: {
            position: 'right',
            columnTitle: 'Actions',
            // custom: [
            //     {
            //         name: 'vendor_item_route',
            //         title: `<i title="Buy" class="fa fa-inr"></i>`,
            //     },
            // ],
        },
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

    constructor(private routes: ActivatedRoute, private userUtility: Utility, private fb: FormBuilder, private router: Router, private authentication: AuthenticationHelper, private appService: ApplicationAdminServices, private pageService: PaginationService, public toastr: ToastsManager, vRef: ViewContainerRef, private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Edit Vendor');
        this.numberMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
        this.pinMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
        // this.accountMask = [/[0-9A-Za-z]/];
        this.placeHolderForTag = ' Add Categories ';
    }

    ngOnInit() {
        this.id = this.routes.snapshot.queryParams['id'];
        this.getVendorById(this.id);
        this.route = this.routes.snapshot.queryParams['route'];
        if (this.route) {
            this.changeTab(this.route);
        }
        this.userBasicInfo();
        this.getVendorTags();
        this.getItemNames();
        this.getVendorTagsById(this.id);
        this.getVendorItemsById(this.id);
        this.getPurchaseOrderTabsById(this.id);
        this.loadStates();
    }

    // set up form.
    userBasicInfo() {
        this.form = this.fb.group({
            'companyName': this.fb.control('', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9_\\s-]+$')])),
            'vendorName': this.fb.control('', Validators.compose([Validators.required, Validators.pattern('^[^-\\s][a-zA-Z0-9_\\s-]+$')])),
            'email': this.fb.control('', Validators.compose([Validators.required, EmailValidator.validate])),
            'phoneNumber': this.fb.control('', Validators.compose([Validators.required, Validators.pattern('^(?!0+$)[0-9][0-9]{9,10}$')])),
            'AddressOne': this.fb.control(''),
            'second_email': this.fb.control('', Validators.compose([Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')])),
            'second_phoneNumber': this.fb.control('', Validators.compose([Validators.pattern('^(?!0+$)[0-9][0-9]{9,10}$')])),
            'AddressTwo': this.fb.control(''),
            'city': this.fb.control(''),
            'pin_code': this.fb.control('', Validators.compose([Validators.pattern('^[1-9][0-9]{5}$')])),
            'state': this.fb.control(''),
            'tags': this.fb.control([], Validators.compose([Validators.required])),
        });

        this.financeForm = this.fb.group({
            'bankName': this.fb.control(''),
            'bankDetails': this.fb.control('', Validators.compose([Validators.pattern('^(?!0+$)[a-zA-Z0-9][a-zA-Z0-9]{8,15}$')])),
            'tagRadio': this.fb.control('', Validators.compose([Validators.required])),
            'description': this.fb.control(''),
            'bank_type': this.fb.control(''),
            'pan_number': this.fb.control('', Validators.compose([Validators.pattern('[A-Za-z]{5}\\d{4}[A-Za-z]{1}')])),
            'ifsc_code': this.fb.control('', Validators.compose([Validators.pattern('^[A-Za-z]{4}0[a-zA-Z0-9]{6}$')])),
            'gst_number': this.fb.control
            ('', Validators.compose([Validators.pattern('^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[zZ][0-9A-Za-z]{1}$')])),
        });
    }

    getVendorTags() {
        this._spinner.show();
        this.appService.getAllTags().subscribe(
            data => this.getDataSuccess(data),
            error => this.getDataFail(error)
        );
    }

    getDataSuccess(res) {
        res.data[0].forEach((item: any) => {
            this.tagsArray.push(item);
        });
    }

    getDataFail(error) {
        this._spinner.hide();
        if (error.error && error.error.message) {
            this.toastr.error(error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    getItemNames() {
        const data: any = {
            vendor_id : this.id,
        };
        this.appService.getItemNames(data).subscribe(
            data => this.getItemNamesSuccess(data),
            error => this.getItemNamesFail(error),
        );
    }

    getItemNamesSuccess(res) {
        this._spinner.hide();
        this.itemNamesData = [];
        res.data[0].forEach((item: any) => {
            this.itemNamesData.push(item);
        });
    }

    getItemNamesFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    getVendorTagsById(data) {
        this._spinner.show();
        const vendorData = {id: data};
        this.appService.getCandidateTagById(vendorData).subscribe(
            data => this.setTags(data),
            error => this.setDataFail(error)
        );
    }

    setTags(res) {
        this._spinner.hide();
        this.assignTagsArray = [];
        this.tagData = [];
        this.assignTagsArray = [];
        this.tagData = res.data[0];
        res.data[0].forEach((item: any) => {
            this.assignTagsArray.push(item.tag_id.toString());
        });
        this.categoryData = this.assignTagsArray;
        this.form.controls['tags'].setValue(this.assignTagsArray);
    }

    onSelectVendorsItem(event) {
        this.selectedItemsPurchase = [];
        this.selectedItemsPurchase = Array.from(event.selected);
        this.disableBuyButton = (this.selectedItemsPurchase.length == 0) ? true : false;
    }

    buyItemsOnSelect() {
        const vendorData = {
            vendor_id: this.id,
            id_item_array: this.selectedItemsPurchase,
            terms_data: this.vendor.terms,
        };
        this.appService.buyItems(vendorData).subscribe(
            data => this.buyItemsSuccess(data),
            error => this.setDataFail(error)
        );
    }

    buyItemsSuccess(res){
        if (res.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['ADD_PURCHASE_ORDER_FAIL']);
        } else {
            this.router.navigate(['editPurchaseOrder'],
                { queryParams: { id: this.id, purchaseId : res.data[0].id } });
        }
    }

    setDataFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
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
        this.DraftedPurchase = '';
        this.purchaseSource.reset();
        this.purchaseList = Array.from(res.data[0].data);
        this.totalCount = res.data[1];
        this.disablePurchaseButton = res.data[2].hasDraft;
        // this.disablePurchaseButton = false;
        this.purchaseSource.load(this.purchaseList);
        // this.getPageData(this.current_page);
    }

    getPageData(page) {
        this.current_page = page;
        this.getPurchaseOrderTabsById(this.id);
        console.log(page);
    }

    viewPurchaseOrderFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    onSelectItem(event) {
        this.itemSelected = event.target.value;
    }

    loadStates() {
        this.statesData = [];
        this.userUtility.states.forEach((item: any) => {
            this.statesData.push({state: item});
        });
    }

    deleteVendorItemButton(event) {
        this.deleteItemVendorId = event;
        this.deleteVendorItemModal.open();
    }

    sendPurchaseOrderToVendor(data) {
        if (data.status == 'Sent') {
            this.toastr.error('Purchase Order has already sent to Vendor');
        } else {
            this.purchaseId = data.id;
            this.sendPurchaseModal.open();
        }
    }

    sendToVendor () {
            const data: any = {
                purchase_id: this.purchaseId,
                vendor_id: this.id,
            };
            this.appService.sendPurchaseOrderToVendor(data).subscribe(
                data => this.sendPurchaseOrderSuccess(data),
                error => this.deleteVendorItemsFail(error),
            );
    }

    sendPurchaseOrderSuccess(data) {
        if (data.status < 0) {
            this.toastr.error(this.userUtility.successMessages['SEND_PURCHASE_ORDER_FAIL']);
        } else {
            this.sendPurchaseModal.close();
            this._spinner.hide();
            this.toastr.success(this.userUtility.successMessages['SEND_PURCHASE_ORDER_SUCCESS']);
            this.changeTab('purchase');
            this.getPurchaseOrderTabsById(this.id);
        }
    }

    deleteVendorItems() {
        const deleteId = {
            'id': this.deleteItemVendorId,
            'vendor_id': this.id,
        };
        this.appService.deleteVendorItem(deleteId).subscribe(
            data => this.deleteVendorItemsSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    deletePurchaseOrder() {
        const deleteId = {
            'purchase_id': this.deletePurchaseId,
            'vendor_id': this.id,
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
            this.getPurchaseOrderTabsById(this.id);
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

    deleteVendorItemsSuccess(res) {
        if (res.code < 0) {
        } else {
            this.deleteVendorItemModal.close();
            this._spinner.hide();
            this.toastr.success(this.userUtility.successMessages['DELETE_VENDOR_ITEM_SUCCESS']);
            this.getVendorItemsById(this.id);
        }
    }

    deleteVendorItemsFail(err) {
        this.deleteVendorItemModal.close();
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error(this.userUtility.successMessages['DELETE_VENDOR_ITEM_FAIL']);
        }
    }

    removePurchaseTab(res) {
        this.deletePurchaseId = res.data.id;
        this.deletePurchaseModal.open();
    }

    editPurchaseTab(res) {
        const isDetailsExist: any = res.data.isExist;
        if (isDetailsExist) {
            this.router.navigate(['editPurchaseOrder'],
                { queryParams: { id: this.id, purchaseId : res.data.id } });
        } else {
            if (this.vendorItemData.length == 0) {
                this.toastr.error(this.userUtility.errorMessages['NO_VENDOR_ITEMS']);
            } else {
                this.router.navigate(['purchaseOrder'], {queryParams: {id: this.id, purchase_id : res.data.id}});
            }
        }
    }

    onAddPurchaseOrder() {
        this._spinner.show();
        const data = {
            'vendor_id' : this.id,
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
            this.router.navigate(['purchaseOrder'], {queryParams: {id: this.id, purchase_id : this.purchaseId}});
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

    changeTab(id) {
        const toggleName: any = id;
        switch (toggleName) {
            case 'contact' : {
                this.purchaseTab = false;
                this.contactTab = true;
                this.financeTab = false;
                this.paymentTab = false;
                this.vendorItemsTab = false;
                this.totalResult = 0;
                break;
            }
            case 'finance' : {
                this.purchaseTab = false;
                this.contactTab = false;
                this.financeTab = true;
                this.paymentTab = false;
                this.vendorItemsTab = false;
                this.totalResult = 0;
                break;
            }
            case 'vendor_items' : {
                this.purchaseTab = false;
                this.contactTab = false;
                this.financeTab = false;
                this.vendorItemsTab = true;
                this.paymentTab = false;
                this.totalResult = 0;
                break;
            }
            case 'purchase' : {
                this.purchaseTab = true;
                this.contactTab = false;
                this.financeTab = false;
                this.paymentTab = false;
                this.vendorItemsTab = false;
                // this.getVendorItemsById(this.id);
                break;
            }
            case 'payment' : {
                this.purchaseTab = false;
                this.contactTab = false;
                this.financeTab = false;
                this.paymentTab = true;
                this.vendorItemsTab = false;
                this.totalResult = 0;
                break;
            }
        }
    }

    addVendorItems() {
        const vendorItemData = {
            'id': this.id,
            'item_id': this.itemSelected,
            'price': this.itemPrice,
        };
        this.appService.addNewVendorItems(vendorItemData).subscribe(
            data => this.addNewVendorItemSuccess(data),
            error => this.addNewVendorFail(error),
        );
    }

    addNewVendorItemSuccess(result) {
        if (result.status < 0) {
            this.toastr.error("Vendor's Item is Already Exist");
        } else {
            this._spinner.hide();
            // console.log();
            this.itemSelected = 0;
            this.itemPrice = null;
            this.toastr.success("Vendor's Item" + result.data.message);
            this.getVendorItemsById(this.id);
        }
    }

    addNewVendorFail(error) {
        this._spinner.hide();
        if (error.error && error.error.message) {
            this.toastr.error(error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    getVendorItemsById(data) {
        this._spinner.show();
        const vendorData = {id: data};
        this.appService.getVendorItemsById(vendorData).subscribe(
            data => this.getVendorItemsByIdSuccess(data),
            error => this.setDataFail(error)
        );
    }

    getSummation(data, numberData) {
        let total=0;
        data.forEach(val => {
            const quant: any = (val.quantity) ? Number(val.quantity) : 0;
            const updated: any = (val.updated_price) ? Number(val.updated_price) : 0;
            const price: any = (val.price) ? Number(val.price) : 0;
            if (val.updated_price) {
                total = total + quant * updated;
            } else {
                total = total + quant * price;
            }
        });
        return total;
    }

    onRadioSelect(data){
        this.tagSelected = data.target.id;
        let tagId : any = data.target.id;
        this.getTermsDataByTagId(tagId);
    }

    getTermsDataByTagId(tagId){
        let tag: any = {
            id_tag : tagId,
        };
        this.appService.viewTermsDataByTagId(tag).subscribe(
            data => this.setTermDataSuccess(data),
            error => this.setDataFail(error)
        );
    }

    setTermDataSuccess(res) {
        this.termId = (res.data[0].length != 0) ? res.data[0][0].id_terms : '';
        this.termData = (res.data[0].length != 0) ? res.data[0][0].terms : '';
        this.financeForm.controls['description'].setValue(this.termData);
    }

    getVendorItemsByIdSuccess(res) {
        this._spinner.hide();
        this.source.reset();
        this.source.load(res.data[0]);
        this.vendorItemData = [];
        this.vendorItemDataPurchse = [];
        this.vendorItemData = Array.from(res.data[0]);
        this.vendorItemDataPurchse = res.data[0];
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
        this.vendor = [];
        this.vendor = res.data[0][0];
        this.id_user = this.vendor.id;

        // setting values to contact
        if (this.vendor.name) {
            this.form.controls['vendorName'].setValue(this.vendor.name);
        }
        if (this.vendor.company_name) {
            this.form.controls['companyName'].setValue(this.vendor.company_name);
        }
        if (this.vendor.email) {
            this.form.controls['email'].setValue(this.vendor.email);
        }
        if (this.vendor.city) {
            this.form.controls['city'].setValue(this.vendor.city);
        }
        if (this.vendor.state) {
            this.form.controls['state'].setValue(this.vendor.state);
        }
        if (this.vendor.pin_code) {
            this.form.controls['pin_code'].setValue(this.vendor.pin_code);
        }
        if (this.vendor.contact_number) {
            this.form.controls['phoneNumber'].setValue((this.vendor.contact_number != 0) ? this.vendor.contact_number : '' );
        }
        if (this.vendor.address_line_one) {
            this.form.controls['AddressOne'].setValue(this.vendor.address_line_one);
        }
        if (this.vendor.address_line_two) {
            this.form.controls['AddressTwo'].setValue(this.vendor.address_line_two);
        }

        // setting values to finance
        if (this.vendor.gst_number) {
            this.financeForm.controls['gst_number'].setValue(this.vendor.gst_number);
        }
        if (this.vendor.bank_type) {
            this.financeForm.controls['bank_type'].setValue(this.vendor.bank_type);
        }
        if (this.vendor.bank_name) {
            this.financeForm.controls['bankName'].setValue(this.vendor.bank_name);
        }
        if (this.vendor.ifsc_code) {
            this.financeForm.controls['ifsc_code'].setValue(this.vendor.ifsc_code);
        }
        if (this.vendor.account_number) {
            this.financeForm.controls['bankDetails'].setValue(this.vendor.account_number);
        }
        if (this.vendor.pan_number) {
            this.financeForm.controls['pan_number'].setValue(this.vendor.pan_number);
        }
        if (this.vendor.alternate_contact) {
            this.form.controls['second_phoneNumber'].setValue(this.vendor.alternate_contact);
        }
        if (this.vendor.alternate_email) {
            this.form.controls['second_email'].setValue(this.vendor.alternate_email);
        }
        if (this.vendor.terms_tag) {
            this.financeForm.controls['tagRadio'].setValue(this.vendor.terms_tag);
        } else {
            this.financeForm.controls['tagRadio'].setValue('');
        }

        if (this.vendor.terms) {
            this.financeForm.controls['description'].setValue(this.vendor.terms);
        } else {
            this.financeForm.controls['description'].setValue('');
        }
        this._spinner.hide();
    }

    checkValue() {
        this.deletetaglist = [];
        this.assignTagsArray.forEach(val => {
            if (this.categoryData.indexOf(val) === -1) {
                this.deletetaglist.push(val);
            }
        });
    }

    makeItCapital(data) {
        return data.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // submission of add user form.
    onSubmit(value: any): void {
        this._spinner.show();
        this.contactMessage = (value.phoneNumber.length < 10) ? true : false;
        this.pinMessage = (value.pin_code.length < 6) ? true : false;

        const userData = {
            'update_status' : 'contact',
            'id': this.id,
            'vendor_name': this.makeItCapital(value.vendorName.trim()),
            'company_name': this.makeItCapital(value.companyName.trim()),
            'contact_number': value.phoneNumber.trim(),
            'alternate_contact_number': value.second_phoneNumber.trim(),
            'alternate_email': value.second_email,
            'email': value.email,
            'address_one': value.AddressOne,
            'address_two': value.AddressTwo,
            'city': this.makeItCapital(value.city.trim()),
            'state': value.state.trim(),
            'pin_code': value.pin_code,
            'tags': this.categoryData,
            'delete_tag': this.deletetaglist,
        };

        // Api call to edit profile, if success editUserProfile(data) and if error editUserProfileFail(error)
        this.appService.editVendorById(userData).subscribe(
            data => this.addNewVendorSuccess(data),
            error => this.addNewVendorFail(error),
        );
    }

    onSubmitFinance(value: any): void {
        this._spinner.show();
        const userData = {
            'update_status' : 'finance',
            'id': this.id,
            'email': this.vendor.email,
            'bank_name': this.makeItCapital(value.bankName.trim()),
            'bank_type': value.bank_type,
            'bank_details': value.bankDetails.trim().toUpperCase(),
            'pan_number': value.pan_number.trim().toUpperCase(),
            'gst_number': value.gst_number.trim().toUpperCase(),
            'ifsc_code': value.ifsc_code.toUpperCase(),
            'terms_data': value.description ? value.description : '',
            'terms_id': this.termId ? this.termId : (this.vendor.terms_id ? this.vendor.terms_id : '' ),
            'terms_tag': this.tagSelected ? this.tagSelected : this.vendor.terms_tag,
        };
        console.log(userData);
        this.appService.editVendorById(userData).subscribe(
            data => this.updateFinanceSuccess(data),
            error => this.addNewVendorFail(error),
        );
    }

    // if edit profile success
    addNewVendorSuccess(result) {
        if (result.status < 0) {
            if (result.data.code == '-297') {
                this.toastr.error('Email Address or Contact already Exist');
            } else {
                this.toastr.error("Please Check Internet Connection");
            }
            this._spinner.hide();
        } else {
            this.deletetaglist = [];
            this.getVendorTagsById(this.id);
            this.getItemNames();
            this.getVendorById(this.id);
            this._spinner.hide();
            this.toastr.success(this.userUtility.successMessages['EDIT_VENDOR_CONTACT_SUCCESS']);
            this.changeTab('finance');
        }
    }

    updateFinanceSuccess(result) {
        this.deletetaglist = [];
        this._spinner.hide();
        this.getVendorById(this.id);
        this.toastr.success(this.userUtility.successMessages['EDIT_VENDOR_FINANCE_SUCCESS']);
        this.changeTab('vendor_items');
    }

    goBack() {
        this.router.navigate(['/viewVendors']);
    }

    addCandidatetags(event) {
    }
}
