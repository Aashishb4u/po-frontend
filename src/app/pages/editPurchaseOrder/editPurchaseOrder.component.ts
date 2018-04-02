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
import {HttpClientHelper} from "../../app.httpClient";
declare let require;

let html2canvas = require('../../../assets/html2canvas.min.js');
let jspdf = require('../../../assets/jsPdf.js');
let promiseJs = require('../../../assets/promise.js');


@Component({
    selector: 'editPurchaseOrder',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./editPurchaseOrder.scss'],
    templateUrl: './editPurchaseOrder.html',
    providers: [Utility],
})

export class editPurchaseOrder {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChild('sendPurchaseModal') sendPurchaseModal: Modal;
    @ViewChild('sendTestPurchaseModal') sendTestPurchaseModal: Modal;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    tagId: any;
    tagName: any;
    poStatus: any;
    vendorId: any;
    isDraftExist: any = true;
    numberMask: any;
    purchaseId: any;
    route: any;
    emailSubject: any;
    emailTemplate: any;
    pdfBase64: any;
    totalAmount: any = 0;
    vendorItemData: any = [];
    vendorItemDeleteList: any = [];
    vendorTermsData: any;
    vendorData: any;
    selectAll: any;
    allTagsName = [];
    allDeleteTags = [];
    imageUrl: string;
    showError: boolean = false;
    settingComponent: boolean = true;
    passwordComponent: boolean = false;
    notificationComponent: boolean = false;
    accreditionComponent: boolean = false;
    disableTagButton: boolean = true;
    isStatusSent: boolean = false;
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
                public httpClientHelper: HttpClientHelper,
                private userUtility: Utility,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Edit Purchase Order');
    }

    ngOnInit () {
        this.numberMask = [/[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
        this.vendorId = this.routes.snapshot.queryParams['id'];
        this.purchaseId =  this.routes.snapshot.queryParams['purchaseId'];
        this.route = this.routes.snapshot.queryParams['route'];
        // this.purchaseId =  'NA';
        this.getVendorItemsById(this.vendorId);
        this.getVendorById(this.vendorId);
        this.emailTemplate = this.userUtility.poTemplate;
        this.emailSubject = this.userUtility.poSubject;
    }

    ngAfterViewInit() {
    this.viewPurchasebyId(this.purchaseId);
    }

    getCalculations() {
        this.totalAmount = 0;
        this.vendorItemData.map(val => {
            let price = val.price ? val.price : 0;
            let quantity = val.quantity ? val.quantity : 0;
            let gst = val.gst ? val.gst : 0;
            val.gst_price = 0;
            let total = 0;
            let globalAmount = 0;
            val.total = total = +(price * quantity).toFixed(2);
            val.gst_price = +(total * (gst / 100 )).toFixed(2);
            val.total_amount = +(val.gst_price + total);
            this.totalAmount = this.totalAmount + val.total_amount;
        });
    }

    getSummation() {
        this.totalAmount = 0;
        this.vendorItemData.forEach(val => {
            const quant: any = (val.quantity) ? +(val.quantity) : 0;
            const price: any = (val.price) ? +(val.price) : 0;
            let gst = val.gst ? val.gst : 0;
            const gstPrice: any = (val.gst_price) ? +(val.gst_price) : 0;
            let total: any = 0;
            val.total = total = +(price * quant).toFixed(2);
            val.gst_price = +(total * (gst / 100 )).toFixed(2);
            console.log(total,'total');
            val.total_amount = +(val.gst_price + total);
            this.totalAmount = +(this.totalAmount).toFixed(2) + val.total_amount;
            console.log(this.totalAmount,'this.totalAmount');
        });
    }

    addPayment() {
        this.router.navigate(['paymentDetails'],
            { queryParams: { id: this.vendorId, purchaseId: this.purchaseId } });
    }

    addReceivedItems() {
        this.router.navigate(['receivedItems'],
            { queryParams: { id: this.vendorId, purchaseId: this.purchaseId } });
    }


    cancelPurchaseOrders() {
        if (this.route == 'purchase_page') {
            this.router.navigate(['createPurchaseOrder'],{queryParams: { id: this.vendorId}});
        } else {
            this.router.navigate(['editVendor'],{queryParams: { id: this.vendorId, route: 'purchase' }});
            // this.router.navigate(['editVendor'],{queryParams: { id: this.vendorId, route: 'Purchase'}});
        }
    }

    setDataSuccess(res) {
        this._spinner.hide();
        this.vendorData = res.data[0];
        // this.isDraftExist = res.data[1].isDraftExist;
        // this.vendorTermsData = res.data[0][0].terms;
    }


    setPurchaseDataSuccess(res) {
        this._spinner.hide();
        let itemArray: any;
        this.vendorItemData = Array.from(res.data[0]);
        this.poStatus = this.vendorItemData[0].status;
        this.isStatusSent = (this.vendorItemData[0].status == 'Sent') ? true : false;
        this.totalAmount = res.data[1].total_amount;
        this.vendorTermsData = res.data[2].terms;
        let unique: any = [];
        itemArray = JSON.parse(localStorage.getItem('item_array'));
        if (itemArray) {
            this.vendorItemData.forEach((val) => {
                itemArray.id_item_array.forEach(res => {
                    if(res.id_item != val.id_item ) {
                        res.purchase_id = this.purchaseId;
                        this.vendorItemData.push(res);
                    }
                });
            });
        }

        this.vendorItemData.filter(function(item){
            let i = unique.findIndex(x => x.id_item == item.id_item);
            if(i <= -1){
                unique.push(item);
            }
            return null;
        });
        this.vendorItemData = [];
        this.vendorItemData = Array.from(unique);
        this.getCalculations();
    }

   ngOnDestroy(): void {
        localStorage.removeItem('item_array');
    }

    getBase64(pdf, testStatus) {
        this.pdfBase64 = pdf;
        $('.hideAction').removeClass('hideElement');
        this.sendToVendor(testStatus);
    }

    sendMail(status) {
        let testStatus: any;
        testStatus = status ? true : false;
        $('.hideAction').addClass('hideElement');
        this._spinner.show();
        let pdfBase64 : any;
        html2canvas(document.getElementById("wrap"), {
            imageTimeout: 2000,
            removeContainer: true,
            background:'#FFFFFF',
            scale: 2,
            dpi: 500,
            letterRendering: 1,
            allowTaint : false,
            logging: true,
        }).then((canvas) => {
            let ctx = canvas.getContext('2d');
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            pdfBase64 = canvas.toDataURL();
            this.getBase64(pdfBase64, testStatus);
        });
    }

    sendToVendor (testStatus) {
        let email: string;
        email = testStatus ? 'shital.mahajan@tudip.com' : this.vendorData[0].email;
        const data: any = {
            purchase_id: this.purchaseId,
            vendor_id: this.vendorId,
            pdf: this.pdfBase64,
            subject: this.emailSubject,
            template: this.emailTemplate,
            email: email,
        };
        // console.log(this.vendorData[0].email,'vendorData');
        this.appService.sendPurchaseOrderToVendor(data).subscribe(
            data => this.sendPurchaseOrderSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    downloadPO() {
        const data: any = {
            purchase_id: this.purchaseId,
            vendor_id: this.vendorId,
        };
        this.appService.downloadPurchaseOrder(data).subscribe(
            data => this.downloadPurchaseOrderSuccess(data),
            error => this.deleteVendorItemsFail(error),
        );
    }

    downloadPurchaseOrderSuccess(res){
        console.log(res.data[0].pdf_name);
        // view_Attachments(data): any {
            let resume : any = res.data[0].pdf_name + '.pdf';
            // if
        if (resume) {
            window.open(this.httpClientHelper.publicUrl + '/purchase_orders/' + resume, '_blank');
            } else {
                this.toastr.error("Failed to open Purchase Order");
            }
        // }
    }

    sendPurchaseOrderSuccess(data) {
        if (data.status < 0) {
            this.toastr.error(this.userUtility.successMessages['SEND_PURCHASE_ORDER_FAIL']);
        } else {
            this.sendPurchaseModal.close();
            this.viewPurchasebyId(this.purchaseId);
            this.toastr.success(this.userUtility.successMessages['SEND_PURCHASE_ORDER_SUCCESS']);
        }
        this._spinner.hide();
    }

    deleteVendorItemsFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error(this.userUtility.successMessages['DELETE_VENDOR_ITEM_FAIL']);
        }
    }

    getVendorById(data) {
        this._spinner.show();
        const vendorData = {id: data};
        this.appService.viewVendorbyId(vendorData).subscribe(
            data => this.setDataSuccess(data),
            error => this.setDataFail(error)
        );
    }

    viewPurchasebyId(data) {
        this._spinner.show();
        const vendorData = {purchase_id: data};
        this.appService.viewPurchasebyId(vendorData).subscribe(
            data => this.setPurchaseDataSuccess(data),
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
        console.log(res);
        // this.vendorItemData = Array.from(res.data[0]);

        // this.vendorItemData = Array.from(res.data[0]);
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
        const data = {
            'purchase_data' : this.vendorItemData,
            'delete_data' : this.vendorItemDeleteList,
            'vendor_id' : this.vendorId,
            'total_amount' : this.totalAmount,
            'terms_data' : this.vendorTermsData,
            'status' : 'Draft',
            'purchase_id' : this.purchaseId,
        };
        this.appService.editPurchaseOrder(data).subscribe(
            data => this.editPurchaseOrderSuccess(data),
            error => this.addPurchaseOrderFail(error),
        );
    }

    removeItemFromPurchase(data,index) {
        if (this.vendorItemData.length == 1) {
            this.toastr.error('Atleast one item is required in purchase order');
        } else {
            this.vendorItemData.splice(index,1);
            this.vendorItemDeleteList.push(data);
            console.log(this.vendorItemDeleteList,'this.vendorItemDeleteList');
            console.log(this.vendorItemData,'this.vendorItemData');
        }
    }


    sendPurchaseTabBackend(status) {
        let email: string;
        const emailStatus: any = status;
        email = (status == 'Test') ? 'shital.mahajan@tudip.com' : this.vendorData[0].email;
        const data = {
            purchase_data : this.vendorItemData,
            vendor_id : this.vendorId,
            total_amount : this.totalAmount,
            terms_data : this.vendorTermsData,
            purchase_id : this.purchaseId,
            vendor_data : this.vendorData,
            subject: this.emailSubject,
            template: this.emailTemplate,
            email: email,
            status: emailStatus,
        };
        this.appService.sendPurchaseOrderBackend(data).subscribe(
            data => this.sendPurchaseOrderSuccess(data),
            error => this.addPurchaseOrderFail(error),
        );
    }

    editPurchaseOrderSuccess(result) {
        if (result.status < 0) {
            this.toastr.error('Purchase Order Edited Failed');
        } else {
            this.getVendorById(this.vendorId);
            this.toastr.success('Purchase Order Edited Successfully');
            // this.router.navigate(['']);
            if (this.route == 'purchase_page') {
                this.router.navigate(['createPurchaseOrder'],{queryParams: { id: this.vendorId }});
            } else {
                this.router.navigate(['editVendor'],{queryParams: { id: this.vendorId, route: 'purchase' }});
            }
            // this.router.navigate(['editVendor'], { queryParams: { id: this.vendorId, route: 'Buy' } });

        }
    }

    addPurchaseOrderFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
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
            this.toastr.success(this.userUtility.successMessages['EDIT_TAG_SUCCESS']);
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
