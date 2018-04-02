import {Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren} from '@angular/core';
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
import {Utility} from "../../utilityServices/app.utility";

@Component({
    selector: 'purchaseOrder',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./purchaseOrder.scss'],
    templateUrl: './purchaseOrder.html',
    providers: [Utility],
})

export class purchaseOrder {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChild('sendPurchaseModal') sendPurchaseModal: Modal;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    tagId: any;
    tagName: any;
    vendorId: any;
    route: any;
    poStatus: any;
    numberMask: any;
    purchaseId: any;
    totalAmount: any = 0;
    vendorItemData: any;
    vendorTermsData: any;
    isDraftExist: any = true;
    vendorData: any;
    selectAll: any;
    allTagsName = [];
    allDeleteTags = [];
    itemsArray = [];
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
                private routes: ActivatedRoute,
                private adminServices: ApplicationAdminServices,
                private fb: FormBuilder,
                private userUtility: Utility,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Purchase Order');
    }

    ngOnInit() {
        this.numberMask = [/[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
        this.vendorId = this.routes.snapshot.queryParams['id'];
        this.route = this.routes.snapshot.queryParams['route'];
        this.purchaseId = this.routes.snapshot.queryParams['purchase_id'];
        this.getVendorById(this.vendorId);
    }

    ngAfterViewInit() {
        this.getVendorItemsById(this.vendorId);
    }

    loadVendorsItem() {
        let itemArray = localStorage.getItem('item_array');
        this.vendorItemData = JSON.parse(itemArray).id_item_array;
        console.log(this.itemsArray,'array');
    }

    addPayment() {
        this.router.navigate(['paymentDetails'],
            { queryParams: { id: this.vendorId, purchaseId: this.purchaseId } });
    }

    getSummation() {
        // let total: any;
        this.totalAmount = 0;
        this.vendorItemData.forEach(val => {
            const quant: any = (val.quantity) ? Number(val.quantity) : 0;
            const price: any = (val.price) ? Number(val.price) : 0;
            let gst = val.gst ? val.gst : 0;
            let total: any = 0;
            val.total = total = +(price * quant).toFixed(2);
            val.gst_price = +(total * (gst / 100 )).toFixed(2);
            val.total_amount = +(val.gst_price + total);
            console.log(total,'total');
            this.totalAmount = +(this.totalAmount).toFixed(2) + val.total_amount;
            console.log(this.totalAmount,'this.totalAmount');
        });
    }

    onSendToVendor() {
        this.sendPurchaseModal.open();
    }

    sendToVendor () {
        const data: any = {
            purchase_id: this.purchaseId,
            vendor_id: this.vendorId,
        };
        this.appService.sendPurchaseOrderToVendor(data).subscribe(
            data => this.sendPurchaseOrderSuccess(data),
            error => this.setDataFail(error),
        );
    }

    sendPurchaseOrderSuccess(data) {
        if (data.status < 0) {
            this.toastr.error(this.userUtility.successMessages['SEND_PURCHASE_ORDER_FAIL']);
        } else {
            this.isDraftExist = true;

            this.sendPurchaseModal.close();
            this._spinner.hide();

            this.toastr.success(this.userUtility.successMessages['SEND_PURCHASE_ORDER_SUCCESS']);
        }
    }

    cancelPurchaseOrders() {
        if (this.route == 'purchase_page') {
            this.router.navigate(['createPurchaseOrder'],{queryParams: { id: this.vendorId, route: 'Buy'}});
        } else {
            this.router.navigate(['editVendor'],{queryParams: { id: this.vendorId, route: 'purchase' }});
        }
    }

    setDataSuccess(res) {
        this._spinner.hide();
        this.vendorData = res.data[0];
        this.vendorTermsData = res.data[0][0].terms;
        this.isDraftExist = res.data[1].isDraftExist;
        this.poStatus = res.data[1].isDraftExist ? 'Draft' : 'Sent';
    }


    getVendorById(data) {
        this._spinner.show();
        const vendorData = {id: data};
        this.appService.viewVendorbyId(vendorData).subscribe(
            data => this.setDataSuccess(data),
            error => this.setDataFail(error)
        );
    }

    getVendorItemsById(data) {
        this._spinner.show();
        const vendorData = {id: data};
        this.appService.getVendorItemsById(vendorData).subscribe(
            data => this.getVendorItemsByIdSuccess(data),
            error => this.setDataFail(error),
        );
    }

    getVendorItemsByIdSuccess(res) {
        this._spinner.hide();
        this.vendorItemData = Array.from(res.data[0]);
        // this.vendorTermsData =
    }

    setDataFail(error) {
        this._spinner.hide();
        if (error.error && error.error.message) {
            this.toastr.error(error.error.message);
        } else {
            this.toastr.error('Server error');
        }
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

    addPurchaseTab() {
        this._spinner.show();
        const data = {
            'purchase_id' : this.purchaseId,
            'purchase_data' : this.vendorItemData,
            'vendor_id' : this.vendorId,
            'total_amount' : this.totalAmount,
            'terms_data' : this.vendorTermsData,
            'status' : 'Draft',
        };
        this.appService.editPurchaseOrder(data).subscribe(
            data => this.addPurchaseOrderSuccess(data),
            error => this.addPurchaseOrderFail(error),
        );
    }

    addPurchaseOrderSuccess(result) {
        this._spinner.hide();
        if (result.status < 0) {
            this.toastr.error('Purchase Order Added Failed');
        } else {
            localStorage.removeItem('item_array');
            this.toastr.success('Purchase Order Added successfully');
            // this.router.navigate(['']);
            if (this.route == 'purchase_page') {
                this.router.navigate(['createPurchaseOrder'],{queryParams: { id: this.vendorId, route: 'Buy'}});
            } else {
                this.router.navigate(['editVendor'],{queryParams: { id: this.vendorId, route: 'purchase'}});
            }
        }
    }

    addPurchaseOrderFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    ngOnDestroy(): void {
        localStorage.removeItem('item_array');
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
        // this.disableDeleteButton = (this.allDeleteTags.length == 0) ? true : false;
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

    addTag() {
        if(this.tagName.trim().length != 0){
            this._spinner.show();
            const data = {
                tag : this.tagName.trim(),
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

    deleteTagSuccess(data) {
        if (data.code < 0) {
            // toastr.error(data.message);
            this.deleteVendorModal.close();
        } else {
            this._spinner.hide();
            this.toastr.success('Categories deleted successfully');
            this.disableDeleteButton = true;
            this.allDeleteTags = [];
            this.deleteVendorModal.close();
            this.getAllTags();
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
