import {Component, ViewContainerRef, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {Router} from '@angular/router';
import {Utility} from "../../utilityServices/app.utility";

@Component({
    selector: 'addItem',
    styleUrls: ['./addItem.scss'],
    templateUrl: './addItem.html',
    providers: [Utility],
})

export class addItem {
    form: FormGroup;
    imageUrl: string;
    financeTab: boolean = false;
    contactTab: boolean = true;
    purchaseTab: boolean = false;
    paymentTab: boolean = false;
    tagsArray: any = [];
    locationArray: any = [];
    numberMask: any;
    gstMask: any;
    locationSelected;
    placeHolderForTag: string;
    pinMask: any;
    categoriesMessage: boolean;
    @ViewChildren('vendorName') firstField;

    constructor(private fb:FormBuilder,private userUtility: Utility, private router:Router, private authentication:AuthenticationHelper, private appService:ApplicationAdminServices, public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Add Item');

        // number mask is used to accept only 11 digit numeric value.
        this.numberMask = [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];

        // pin mask is used to accept 6 digit pin value.
        this.gstMask = [/[0-9]/,/[0-9]/];

        // for setting up the Title of the page
        this.placeHolderForTag = 'Add Categories';
    }

    // Initiating Angular
    ngOnInit() {
        this.userBasicInfo();
        this.getVendorTags();
        this.getItemLocation();
        this.form.controls['location'].setValue('');
    }

    // function called after cancelbutton is clicked.
    goBack() {
        this.router.navigate(['/viewItems']);
    }

    // get API to get all tags from tags table.
    getVendorTags() {
        this._spinner.show();

        // Api call to get categories, if success getDataSuccess(data) and if error getDataFail(error)
        this.appService.getAllTags().subscribe(
            data => this.getDataSuccess(data),
            error => this.getDataFail(error)
        );
    }

    // getVendorTags - Success
    getDataSuccess(res) {
        if (res.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['GET_TAGS_FAILED']);
        } else {
            this._spinner.hide();
            this.tagsArray = []; // Array is flushed before use.
            res.data[0].forEach((item: any) => {
                this.tagsArray.push(item.name); // Array used to show all categories.
            });
        }
    }

    // getVendorTags - Fail
    getDataFail(error) {
        this._spinner.hide();
        if (error.error && error.error.message) {
            this.toastr.error(error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    // get API to get all tags from tags table.
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

    // This function is used to toggle tabs in addItem component.
    changeTab(id) {
        const toggleName: any = id;
        switch (toggleName) {

            // for contact Information
            case 'contact' : {
                this.purchaseTab = false;
                this.contactTab = true;
                this.financeTab = false;
                this.paymentTab = false;
                break;
            }

            // for finance Information
            case 'finance' : {
                this.purchaseTab = false;
                this.contactTab = false;
                this.financeTab = true;
                this.paymentTab = false;
                break;
            }

            // for purchase order Information
            case 'purchase' : {
                this.purchaseTab = true;
                this.contactTab = false;
                this.financeTab = false;
                this.paymentTab = false;
                break;
            }

            // for payment details Information
            case 'payment' : {
                this.purchaseTab = false;
                this.contactTab = false;
                this.financeTab = false;
                this.paymentTab = true;
                break;
            }
        }
    }

    // set up form.
    userBasicInfo() {
        this.form = this.fb.group({
            'vendorName': this.fb.control('', Validators.compose([Validators.required])),
            'gst': this.fb.control('', Validators.compose([Validators.pattern('^(?!0+$)[A-Z0-9][0-9]{0,1}$')])),
            'location': this.fb.control('', Validators.compose([])),
            'categories': this.fb.control([], Validators.compose([Validators.required])),
            'description': this.fb.control('', Validators.compose([Validators.required])),
        });
    }

    selectLocation(event) {
        this.locationSelected = event.target.value;
    }


    // submission of add user form.
    onSubmit(value: any): void {
        this._spinner.show();
        let itemName = value.vendorName.trim();
        itemName = itemName.replace(/^\w/, function (chr) {
            return chr.toUpperCase();
        });
        this.categoriesMessage = (value.categories.length == 0) ? true : false;
        const userData = {
            'item_name': itemName,
            'gst': value.gst,
            'location': value.location,
            'categories': value.categories,
            'description': value.description.trim(),
        };

        // Api call to edit profile, if success editUserProfile(data) and if error editUserProfileFail(error)
        this.appService.addNewItem(userData).subscribe(
            data => this.addNewVendorSuccess(data),
            error => this.addNewVendorFail(error)
        );
    }

    // if edit profile success
    addNewVendorSuccess(result) {
        if (result.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['ITEM_ALREADY_EXIST']);
        } else {
            this.toastr.success(this.userUtility.successMessages['ADD_ITEM_SUCCESS']);
            this.router.navigate(['/viewItems']);
        }
        this._spinner.hide();
    }

    // if edit profile fail
    addNewVendorFail(error) {
        this._spinner.hide();
        if (error.error && error.error.message) {
            this.toastr.error(error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

}
