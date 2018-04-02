import {Component, ViewContainerRef, ViewChildren, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {ActivatedRoute, Router} from '@angular/router';
import {LocalDataSource} from "ng2-smart-table";
import {Utility} from "../../utilityServices/app.utility";
import {Modal} from "ng2-modal";
import {IMyOptions} from "mydatepicker";
import {PaginationService} from "../../appServices/paginationService";

// import {LocalDataSource} from "ng2-smart-table";

@Component({
    selector: 'editItem',
    styleUrls: ['./editItem.scss'],
    templateUrl: './editItem.html',
    providers: [Utility, PaginationService],
})

export class editItem {
    form:FormGroup;
    itemQuantityForm:FormGroup;
    itemQuantityFormVendor:FormGroup;
    itemUsedFormVendor:FormGroup;
    imageUrl:string;
    financeTab: boolean = false;
    contactTab: boolean = true;
    purchaseTab: boolean = false;
    paymentTab: boolean = false;
    tagsArray: any = [];
    tagData: any = [];
    assignTagsArray: any = [];
    categoryData: any = [];
    deletetaglist: any = [];
    vendorNamesData: any = [];
    locationArray: any = [];
    numberMask: any;
    vendorId: any;
    vendorSelected: any = 0;
    somePlaceholder: any;
    itemPrice: any;
    id: any;
    totalCount: any;
    totalCountUsed: any;
    preDate: any;
    perPage: any = 10;
    currentPage: any = 1;
    currentPageUsed: any = 1;
    date: any;
    itemQuantityList: any = [];
    itemUsedList: any = [];
    dateNew: any;
    dateVendor: any;
    disableItemDate: any = true;
    disableUsedItemDate: any = false;
    dateUsed: any;
    purchaseOrdersByItem: any;
    vendorsByItem: any;
    showPurchase: any;
    showVendor: any = true;
    disbaleItemsQuantityButton: any = false;
    disbaleUsedQuantityButton: any = false;
    gstMask: any;
    deleteVendorItemId: any;
    itemQuantityLog: any;
    itemUsedLog: any;
    item: any;
    quantityAvailable: any;
    quantityUsed: any;
    placeHolderForTag: string;
    pinMask: any;
    categoriesMessage: boolean;
    myDateCron1PickerOptions: IMyOptions = {
        dateFormat: 'dd-mm-yyyy',
        showTodayBtn : true,
        firstDayOfWeek: 'mo',
        showClearDateBtn: false,
        sunHighlight: true,
        height: '34px',
        inline: false,
        selectionTxtFontSize: '12px',
    };
    pinMessage: boolean;
    @ViewChildren('vendorName') firstField;
    @ViewChild('deleteItemVendorModal') deleteItemVendorModal: Modal;
    @ViewChild('deleteItemQuantityModal') deleteItemQuantityModal: Modal;
    @ViewChild('deleteItemUsedModal') deleteItemUsedModal: Modal;
    @ViewChild('addItemQuantityModal') addItemQuantityModal: Modal;
    @ViewChild('addUsedItemQuantityModal') addUsedItemQuantityModal: Modal;
    source: LocalDataSource = new LocalDataSource();
    itemQuantitysource: LocalDataSource = new LocalDataSource();
    itemUsedsource: LocalDataSource = new LocalDataSource();

    settings: any = {
        mode : 'external',
        actions: {
            position: 'right',
            columnTitle: 'Actions',
            // custom: [
            //     {
            //         name: 'buy_product_route',
            //         title: `<i title=" Buy " class="fa fa-inr"></i>`,
            //     },
            // ],
        },
        columns: {
            vendor_name: {
                title: 'Vendor Name',
            },
            price: {
                title: 'Price',
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
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Vendor"></i>',
            confirmDelete: true,
        },
    };

    items_available_settings: any = {
        mode : 'external',
        // actions: {
        //     position: 'right',
        //     columnTitle: 'Actions',
        //     // custom: [
        //     //     {
        //     //         name: 'buy_product_route',
        //     //         title: `<i title=" Buy " class="fa fa-inr"></i>`,
        //     //     },
        //     // ],
        // },
        actions: false,
        columns: {
            date: {
                title: 'Date',
            },
            vendor_name: {
                title: 'Vendor',
            },
            quantity: {
                title: 'Quantity Received',
            },
            price: {
                title: 'Price Per Item',
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
            // deleteButtonContent: '<i class="ion-trash-b" title="Delete Vendor"></i>',
            confirmDelete: true,
        },
    };

    items_used_settings: any = {
        mode : 'external',
        actions: {
            position: 'right',
            columnTitle: 'Actions',
            // custom: [
            //     {
            //         name: 'buy_product_route',
            //         title: `<i title=" Buy " class="fa fa-inr"></i>`,
            //     },
            // ],
        },
        columns: {
            date: {
                title: 'Date',
            },
            quantity: {
                title: 'Quantity Used',
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
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Vendor"></i>',
            confirmDelete: true,
        },
    };

    constructor(private fb:FormBuilder,private pageServices: PaginationService,private routes: ActivatedRoute,private userUtility : Utility, private router:Router, private authentication:AuthenticationHelper, private appService:ApplicationAdminServices, public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Edit Item');
        this.numberMask = [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];
        this.gstMask = [/[0-9]/,/[0-9]/];
        this.placeHolderForTag = 'Add Categories';
        this.preDate = new Date().toISOString().slice(0, 10).split('-');
        this.date = this.preDate[2] + '-' + this.preDate[1] + '-' + this.preDate[0];
        this.dateNew = this.date;
        this.dateVendor = this.date;
        this.dateUsed = this.date;
    }

    ngOnInit() {
        this.somePlaceholder = 'price';
        this.id  = this.routes.snapshot.queryParams['id'];
        this.userBasicInfo();
        this.getVendorTags();
        this.getItemTagsById(this.id);
        this.getItemsQuantity();
        this.getUsedItemsQuantity();
        this.getAllVendorsNames();
        this.getItemVendorsById();
        this.getPurchaseOrdersByItem();
        this.getVendorsByItem();
        this.getItemLocation();

    }



    onSelectPurchase(event) {
        this.purchaseOrdersByItem.forEach(val => {
            if (val.purchase_id == event.target.value){
                this.itemQuantityForm.controls['vendor'].setValue(val.company_name);
                this.itemQuantityForm.controls['price'].setValue(val.price);
                this.vendorId = val.vendor_id;
            }
        });
    }

    onSelectVendor(event) {
        // this.vendorsByItem.forEach(val => {
        //     if (val.id_user == event.target.value){
        //         this.itemQuantityFormVendor.controls['price'].setValue(val.price);
        //     }
        // });
    }

    onDate1Changed(event) {
        this.dateNew = event.formatted;
        console.log(this.dateNew, 'this.dateNew');
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

    onRadioSelect(data) {
        if(data == 'PO'){
            this.showVendor = false;
            this.showPurchase = true;
        }
        else if(data == 'Vendor'){
            this.showVendor = true;
            this.showPurchase = false;
        }
    }

    goBack() {
        this.router.navigate(['/viewItems']);
    }

    getItemsById(data) {
        this._spinner.show();
        const itemData = { id: data };
        this.appService.viewItembyId(itemData).subscribe(
            data => this.setDataSuccess(data),
            error => this.setDataFail(error)
        );
    }

    setDataSuccess(res) {
        this.item = res.data[0][0];
        if (this.item.description) {
            this.form.controls['description'].setValue(this.item.description);
        }
        if (this.item.name) {
            this.form.controls['itemName'].setValue(this.item.name);
        }

        if (this.item.gst) {
            this.form.controls['gst'].setValue(this.item.gst);
        }

        if (this.item.location) {
            this.form.controls['location'].setValue(this.item.location);
        }

        if (this.item.quantity_available) {
            this.form.controls['available_quantity'].setValue(this.item.quantity_available);
        }
        this.quantityAvailable = (this.item.quantity_available) ? this.item.quantity_available : 0;
        this.quantityUsed = (this.item.quantity_used) ? this.item.quantity_used : 0;
        this._spinner.hide();
    }

    onCustom(data) {
        if(data.action == 'buy_product_route') {
            this.router.navigate(['editVendor'], { queryParams: { id: data.data.id_user, route: 'purchase' } });
        }
        // this.router.navigate(['editVendor'], { queryParams: { id: event.data.id, route: 'Buy' } });

    }

    deleteItemVendorButton(event) {
        this.deleteVendorItemId = event.data.id_user;
        this.deleteItemVendorModal.open();
    }

    getPurchaseOrdersByItem() {
        // console.log(event);
        const itemId = {
            'id_item' : this.id,
        };
        this.appService.getPurchaseOrdersByItem(itemId).subscribe(
            data => this.getPurchaseOrdersByItemSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    getPurchaseOrdersByItemSuccess(res){
        if (res.code < 0) {
        } else {
            this.purchaseOrdersByItem = [];
            res.data[0].forEach((item: any) => {
                this.purchaseOrdersByItem.push(item);
            });
            console.log(this.purchaseOrdersByItem,'this.purchaseOrdersByItem');
        }

    }

    addItemQuantityFinal(values) {
        // this.disbaleItemsQuantityButton = true;
            this._spinner.show();
            const data = {
                vendor_id: values.vendor,
                date: values.date.formatted,
                // purchase_id: values.purchaseId,
                id_item: this.id,
                quantity: values.quantity,
                price: values.price,
            };
            console.log(data);
            this.appService.onAddItemQuantityDetails(data).subscribe(
                data => this.onAddPaymentDetailsSuccess(data),
                error => this.deleteVendorItemsFail(error),
            );
        // this.showMeButton = false;
        // this.deleteVendorModal.close();

    }

    onAddPaymentDetailsSuccess(res) {
        this._spinner.hide();
        if (res.code < 0) {
        } else {
            this.addItemQuantityModal.close();
            this.disbaleItemsQuantityButton = false;
            this.toastr.success("Items Quantity Added Successfully");
            this.getItemsQuantity();
            this.getItemsById(this.id);
            this.getUsedItemsQuantity();
            this.dateVendor = this.date;
            this.itemQuantityFormVendor.controls['vendor'].setValue('');
            this.itemQuantityFormVendor.controls['price'].setValue('');
            this.itemQuantityFormVendor.controls['quantity'].setValue('');
            this.itemQuantityFormVendor.controls['date'].setValue('');
        }

    }

    addItemUsedFinal(values) {
        if (values.quantity > this.quantityAvailable) {
            this.toastr.error('Please enter quantity less than available quantity');
        } else {
            this.disbaleUsedQuantityButton = true;
            this._spinner.show();
            const data = {
                date: values.date.formatted,
                // purchase_id: values.purchaseId,
                id_item: this.id,
                quantity: values.quantity,
            };
            this.appService.onAddItemQuantityUsedDetails(data).subscribe(
                data => this.onUsedItemSuccess(data),
                error => this.deleteVendorItemsFail(error),
            );
        }
    }

    onUsedItemSuccess(res) {
        this._spinner.hide();
        if (res.code < 0) {
        } else {
            this.toastr.success("Used Quantity Added Successfully");
            this.disbaleUsedQuantityButton = false;
            this.getItemsQuantity();
            this.getItemsById(this.id);
            this.getUsedItemsQuantity();
            this.dateUsed = this.date;
            this.itemUsedFormVendor.controls['quantity'].setValue('');
            this.itemUsedFormVendor.controls['date'].setValue('');
            this.addUsedItemQuantityModal.close();
        }
    }

    getVendorsByItem() {
        // console.log(event);
        const itemId = {
            'id_item' : this.id,
        };
        this.appService.getVendorsByItem(itemId).subscribe(
            data => this.getVendorsByItemSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    getVendorsByItemSuccess(res) {
        if (res.code < 0) {
        } else {
            this.vendorsByItem = [];
            res.data[0].forEach((item: any) => {
                this.vendorsByItem.push(item);
            });
            this.vendorsByItem.sort(function (a, b) {
                return (a.company_name).toString().toLowerCase() > (b.company_name).toString().toLowerCase();
            });
        }

    }

    resetItemQuantity(){
        this.addItemQuantityModal.close();
        this.itemQuantityFormVendor.controls['vendor'].setValue('');
        this.itemQuantityFormVendor.controls['price'].setValue('');
        this.itemQuantityFormVendor.get('quantity').setValue('');
        this.itemQuantityFormVendor.controls['date'].setValue('');
    }

    resetUsedQuantity(){
        this.addUsedItemQuantityModal.close();
        this.itemUsedFormVendor.controls['quantity'].setValue('');
        this.itemUsedFormVendor.controls['date'].setValue('');
    }

    getItemsQuantity() {
        // console.log(event);
        const itemId = {
            'id_item' : this.id,
        };
        this.pageServices.getItemQuantityDetails(itemId, this.currentPage).subscribe(
            data => this.getItemQuantityDetailsSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    getItemQuantityDetailsSuccess(res) {
        if (res.code < 0) {
        } else {
            this.itemQuantityList = [];
            this.itemQuantitysource.reset();
            this.itemQuantitysource.load(res.data[0].data);
            this.itemQuantityList = res.data[0].data;
            this.totalCount = res.data[0].total;
        }
    }

    getUsedItemsQuantity() {
        // console.log(event);
        const itemId = {
            'id_item' : this.id,
        };
        this.pageServices.getItemQuantityUsedDetails(itemId, this.currentPageUsed).subscribe(
            data => this.getItemQuantityUsedDetailsSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    getItemQuantityUsedDetailsSuccess(res) {
        if (res.code < 0) {
        } else {
            // console.log(res.data[0]);
            this.itemUsedsource.reset();
            this.itemUsedsource.load(res.data[0].data);
            this.itemUsedList = res.data[0].data;
            this.totalCountUsed = res.data[0].total;
        }
    }

    deleteVendorItems() {
        // console.log(event);
        const deleteId = {
            'id' : this.id,
            'vendor_id' : this.deleteVendorItemId,
        };
        this.appService.deleteVendorItem(deleteId).subscribe(
            data => this.deleteVendorItemsSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    deleteVendorItemsSuccess(res){
        if (res.code < 0) {
        } else {
            this.deleteItemVendorModal.close();
            this._spinner.hide();
            this.toastr.success(this.userUtility.successMessages['DELETE_VENDOR_ITEM_SUCCESS']);
            this.getItemVendorsById();
        }
    }

    deleteVendorItemsFail(err){
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    deleteItemQuantity(event) {
        this.itemQuantityLog = event.data.log_id;
        this.deleteItemQuantityModal.open();
    }

    deleteItemUsed(event) {
        this.itemUsedLog = event.data.log_id;
        this.deleteItemUsedModal.open();
    }

    onDeleteItemQuantity() {
        // console.log(event);
        const deleteId = {
            'item_id' : this.id,
            'log_id' : this.itemQuantityLog,
        };
        console.log(deleteId,'-----00-----');
        this.appService.deleteItemQuantity(deleteId).subscribe(
            data => this.deleteItemQuantitySuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    deleteItemQuantitySuccess(res){
        if (res.code < 0) {
        } else {
            this.deleteItemQuantityModal.close();
            this._spinner.hide();
            this.itemQuantityLog = '';
            this.toastr.success(this.userUtility.successMessages['DELETE_ITEM_QUANTITY_SUCCESS']);
            this.getItemsQuantity();
            this.getItemsById(this.id);
            this.getUsedItemsQuantity();
        }
    }

    onDeleteItemUsed() {
        // console.log(event);
        const deleteId = {
            'item_id' : this.id,
            'log_id' : this.itemUsedLog,
        };
        console.log(deleteId,'-----00-----');
            this.appService.deleteItemUsed(deleteId).subscribe(
            data => this.deleteItemUsedSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    deleteItemUsedSuccess(res){
        if (res.code < 0) {
        } else {
            this.deleteItemUsedModal.close();
            this._spinner.hide();
            this.itemUsedLog = '';
            this.toastr.success(this.userUtility.successMessages['DELETE_ITEM_USED_SUCCESS']);
            this.getItemsQuantity();
            this.getUsedItemsQuantity();
            this.getItemsById(this.id);
        }
    }

    // removeCandidatetags(event){
    //     this.tagData.forEach((item: any) => {
    //         if (item.tag_name == event) {
    //             this.deletetaglist.push(item.tag_id);
    //         }
    //     });
    // }

    getAllVendorsNames() {
        const data: any = {
            id_item : this.id,
        };
        this.appService.getVendorsForItem(data).subscribe(
            data => this.getVendorNamesSuccess(data),
            error => this.getVendorNamesFail(error),
        );
    }

    getVendorNamesSuccess(res) {
        this.vendorNamesData = [];
        res.data[0].forEach((item: any) => {
            this.vendorNamesData.push(item);
        });
    }

    getVendorNamesFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    addVendorItems() {
        const vendorItemData = {
            'id' : this.vendorSelected,
            'item_id' : this.id,
            'price' : this.itemPrice,
        };
        this.appService.addNewVendorItems(vendorItemData).subscribe(
            data => this.addNewVendorItemSuccess(data),
            error => this.addNewVendorFail(error)
        );
    }

    addNewVendorItemSuccess(result) {
        if(result.status < 0) {
            this.toastr.error("Item's Vendor is Already Exist");
            this.itemPrice = null;
        } else {
            this._spinner.hide();
            this.itemPrice = null;
            this.vendorSelected = 0;
            // console.log();
            this.toastr.success("Item's Vendor" + result.data.message);
            this.getItemVendorsById();
        }
    }

    getPageData(page) {
        this.currentPage = page;
        this.getItemsQuantity();
    }

    getPageDataUsed(page) {
        this.currentPageUsed = page;
        this.getUsedItemsQuantity();
    }

    getItemVendorsById() {
        this._spinner.show();
        const vendorData = {
            id: this.id,
        };
        this.appService.getAllVendorsForItemById(vendorData).subscribe(
            data => this.getVendorItemsByIdSuccess(data),
            error => this.setDataFail(error)
        );
    }

    getVendorItemsByIdSuccess(res) {
        this.source.reset();
        this.source.load(res.data[0]);
    }

    selectVendor(event) {
        this.vendorSelected = event.target.value;
    }

    selectLocation(event) {
        this.vendorSelected = event.target.value;
    }

    getItemLocation() {
        this._spinner.show();

        // Api call to get categories, if success getDataSuccess(data) and if error getDataFail(error)
        this.appService.getAllLocations().subscribe(
            data => this.getAllLocationsSuccess(data),
            error => this.getDataFail(error)
        );
    }

    // getVendorTags - Success
    getAllLocationsSuccess(res) {
        this._spinner.hide();
        if (res.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['LOCTION_NOT_FOUND']);
        } else {
            this.locationArray = []; // Array is flushed before use.
            res.data[0].forEach((item: any) => {
                this.locationArray.push(item); // Array used to show all categories.
            });
        }
    }


    setDataFail(error) {
    }

    getItemTagsById(data) {
        this._spinner.show();
        const vendorData = { id: data };
        this.appService.getItemTagById(vendorData).subscribe(
            data => this.setTags(data),
            error => this.setDataFail(error)
        );
    }

    changeTab(id) {
        const toggleName: any = id;
        switch (toggleName) {
            case 'item_info' : {
                this.purchaseTab = false;
                this.contactTab = true;
                this.financeTab = false;
                this.paymentTab = false;
                break;
            }
            case 'item_vendors' : {
                this.purchaseTab = false;
                this.contactTab = false;
                this.financeTab = true;
                this.paymentTab = false;
                break;
            }
            case 'purchase' : {
                this.purchaseTab = true;
                this.contactTab = false;
                this.financeTab = false;
                this.paymentTab = false;
                break;
            }
            case 'payment' : {
                this.purchaseTab = false;
                this.contactTab = false;
                this.financeTab = false;
                this.paymentTab = true;
                break;
            }
        }
    }


    setTags(res) {
        this.tagData = [];
        this.assignTagsArray = [];
        this.tagData = res.data[0];
        res.data[0].forEach((item: any) => {
            this.assignTagsArray.push(item.tag_id.toString());
        });
        this.categoryData = this.assignTagsArray;
        this.form.controls['categories'].setValue(this.assignTagsArray);
    }

    checkValue() {
        this.deletetaglist = [];
        this.assignTagsArray.forEach(val => {
            if (this.categoryData.indexOf(val) === -1) {
                this.deletetaglist.push(val);
            }
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
        this._spinner.hide();
        this.tagsArray = [];
        res.data[0].forEach((item: any ) => {
            this.tagsArray.push(item);
        });
    }

    getDataFail(res) {
        console.log(res);
    }

    ngAfterViewInit() {
        this.getItemsById(this.id);
    }

    // set up form.
    userBasicInfo() {
        this.form = this.fb.group({
            'itemName': this.fb.control('', Validators.compose([Validators.required])),
            'gst': this.fb.control('', Validators.compose([Validators.pattern('^(?!0+$)[A-Z0-9][0-9]{0,1}$')])),
            'categories': this.fb.control([], Validators.compose([Validators.required])),
            'description': this.fb.control('', Validators.compose([Validators.required])),
            'available_quantity': this.fb.control(''),
            'location': this.fb.control(''),
        });

        this.itemQuantityForm = this.fb.group({
            'purchaseId': this.fb.control('', Validators.compose([Validators.required])),
            'vendor': this.fb.control(''),
            'price': this.fb.control([Validators.pattern('^\d+$')]),
            'quantity': this.fb.control('', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),
            'date': this.fb.control(''),
        });


        this.itemQuantityFormVendor = this.fb.group({
            'date': this.fb.control('', Validators.compose([Validators.required])),
            'vendor': this.fb.control('', Validators.compose([Validators.required])),
            'price': this.fb.control('', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),
            'quantity': this.fb.control('', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),
        });

        this.itemUsedFormVendor = this.fb.group({
            'date': this.fb.control('', Validators.compose([Validators.required])),
            'quantity': this.fb.control('', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),
        });
    }
    addCandidatetags(event) {
    }

    // userBasicInfo() {
    //     this.form = this.fb.group({
    //         'vendorName': this.fb.control('', Validators.compose([Validators.required])),
    //         'companyName': this.fb.control('', Validators.compose([Validators.required])),
    //         'AddressOne': this.fb.control(''),
    //         'AddressTwo': this.fb.control(''),
    //         'phoneNumber': this.fb.control(''),
    //         'city': this.fb.control(''),
    //         'pin_code': this.fb.control(''),
    //         'email': this.fb.control('', Validators.compose([Validators.required, EmailValidator.validate])),
    //     });
    // }

    // submission of add user form.
    onSubmit(value: any): void {
        this._spinner.show();
        let itemName = value.itemName.trim();
        itemName = itemName.replace(/^\w/, function (chr) {
            return chr.toUpperCase();
        });
        console.log(itemName,'itemName');
        this.categoriesMessage = (value.categories.length == 0) ? true : false;

        const userData = {
            'item_name': itemName,
            'categories': value.categories,
            'gst': value.gst,
            'location': value.location,
            'delete_categories': this.deletetaglist,
            'description': value.description.trim(),
            'id': this.id,
            // 'email': value.email,
            // 'address_one': value.AddressOne,
            // 'address_two': value.AddressTwo,
            // 'city': value.city.trim(),
            // 'state': value.state .trim(),
            // 'pin_code': value.pin_code,
            // 'tag' : []
        };

        // Api call to edit profile, if success editUserProfile(data) and if error editUserProfileFail(error)
        this.appService.editItemById(userData).subscribe(
            data => this.editItemByIdSuccess(data),
            error => this.addNewVendorFail(error),
        );
    }

    //if edit profile success
    editItemByIdSuccess(result) {
        this._spinner.hide();
        if (result.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['ITEM_ALREADY_EXIST']);
        } else {
            this.deletetaglist = [];
            this.toastr.success(this.userUtility.successMessages['EDIT_ITEM_SUCCESS']);
            // console.log("result", result);
            this.router.navigate(['/viewItems']);
        }

    }

    onDate2Changed(event) {
        this.disableItemDate = this.dateCompare(event.formatted, this.date);
        this.crondate1Avail();
    }

    // returns true if smallDate <= bigDate
    dateCompare(smallDate, bigDate) {
        let response = false;
        let bigDateFormatted: any;
        let smallDateFormatted: any;
        let smallDateString: any;
        let bigDateString: any;
        smallDateFormatted = smallDate.split('-', 3);
        bigDateFormatted = bigDate.split('-', 3);
        smallDateString = smallDateFormatted[2] + smallDateFormatted[1] + smallDateFormatted[0];
        bigDateString = bigDateFormatted[2] + bigDateFormatted[1] + bigDateFormatted[0];
        if (bigDateString >= smallDateString) {
            response = true;
        }
        return response;
    }

    onUsedDateChanged(event) {
        this.disableUsedItemDate = this.dateCompare(event.formatted, this.date);
        this.crondate1Avail();
    }

    //if edit profile fail
    addNewVendorFail(Error) {
        this._spinner.hide();
        if (Error.error && Error.error.message) {
            this.toastr.error(Error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

}
