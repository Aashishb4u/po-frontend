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
    selector: 'addTermsAndCondition',
    styleUrls: ['./addT&C.scss'],
    templateUrl: './addT&C.html',
    providers: [Utility],
})

export class addTermsAndCondition {
    imageUrl: string;
    financeTab: boolean = false;
    contactTab: boolean = true;
    purchaseTab: boolean = false;
    paymentTab: boolean = false;
    tagsArray: any = [];
    numberMask: any;
    description: any = '';
    categoryData: any = [];
    configurationCkEditor: any;
    placeHolderForTag: string;
    pinMask: any;
    @ViewChildren('vendorName') firstField;

    constructor(private fb: FormBuilder,
                private userUtility: Utility,
                private router: Router,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Add Terms And Conditions');

        // number mask is used to accept only 11 digit numeric value.
        this.numberMask = [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];

        // pin mask is used to accept 6 digit pin value.
        this.pinMask = [/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];

        // for setting up the Title of the page.
        this.placeHolderForTag = 'Add T&C';
    }

    // Initiating Angular
    ngOnInit() {
        this.getVendorTags();
    }

    // function called after cancelbutton is clicked.
    goBack() {
        this.router.navigate(['/viewTermsAndConditions']);
    }

    // function called when add Terms button is clicked.
    addTerms() {
        const termsData: any = {
            'categories' : this.categoryData,
            'terms' : this.description,
        };

        // Api call to add terms and conditions
        // if success addTermsConditionSuccess(data) and if error addTermsConditionFail(error)
        this.appService.addTermsCondition(termsData).subscribe(
            data => this.addTermsConditionSuccess(data),
            error => this.addTermsConditionFail(error)
        );
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
        this._spinner.hide();
        this.tagsArray = []; // Array is flushed before use.
        res.data[0].forEach((item: any ) => {
            this.tagsArray.push(item);  // Array used to show all categories.
        });
    }

    // getVendorTags - Fail
    getDataFail(res) {
        this._spinner.hide();
        if (res.error && res.error.message) {
            this.toastr.error(res.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    // if edit profile success
    addTermsConditionSuccess(result) {
        if (result.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['ITEM_ALREADY_EXIST']);
        } else {
            this.toastr.success(this.userUtility.successMessages['ADD_TERMS_SUCCESS']);
            this.router.navigate(['/viewTermsAndConditions']);
        }
        this._spinner.hide();

    }

    // if edit profile fail
    addTermsConditionFail(error) {
        this._spinner.hide();
        if (error.error && error.error.message) {
            this.toastr.error(error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

}
