import {Component, ViewContainerRef, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {ActivatedRoute, Router} from '@angular/router';
import {Utility} from "../../utilityServices/app.utility";

@Component({
    selector: 'editAlmirah',
    styleUrls: ['./editAlmirah.scss'],
    templateUrl: './editAlmirah.html',
    providers: [Utility],
})

export class editAlmirah {
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
    almirahId: any;
    locationSelected;
    placeHolderForTag: string;
    pinMask: any;
    categoriesMessage: boolean;
    @ViewChildren('vendorName') firstField;

    constructor(private fb:FormBuilder,private routes: ActivatedRoute,private userUtility: Utility, private router:Router, private authentication:AuthenticationHelper, private appService:ApplicationAdminServices, public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Edit Almirah');

        // number mask is used to accept only 11 digit numeric value.
        this.numberMask = [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];

        // pin mask is used to accept 6 digit pin value.
        this.gstMask = [/[0-9]/,/[0-9]/];

        // for setting up the Title of the page
        this.placeHolderForTag = 'Add Categories';
        this.almirahId  = this.routes.snapshot.queryParams['id'];
    }

    // Initiating Angular
    ngOnInit() {
        this.userBasicInfo();
        this.getItemLocation();
    }

    // function called after cancelbutton is clicked.
    goBack() {
        this.router.navigate(['/almirah']);
    }

    // get API to get all tags from tags table.
    getItemLocation() {
        let data: any = {
            id: this.almirahId,
        };
        this._spinner.show();

        // Api call to get categories, if success getDataSuccess(data) and if error getDataFail(error)
        this.appService.getItemLocationById(data).subscribe(
            data => this.getDataSuccess(data),
            error => this.getDataFail(error)
        );
    }

    // getVendorTags - Success
    addItemLocationSuccess(res) {
        if (res.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['GET_TAGS_FAILED']);
        } else {
            this._spinner.hide();
            this.toastr.success('Almirah edited successfully');
            this.router.navigate(['/almirah']);
        }
    }

    makeItCapital(data) {
        return data.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // get API to get all tags from tags table.
    editItemLocation(values) {
        const data: any = {
            id: this.almirahId,
            location_name: this.makeItCapital(values.almirahName.trim()),
            description: values.description,
        };
        this._spinner.show();
        // Api call to get categories, if success getDataSuccess(data) and if error getDataFail(error)
        this.appService.editItemLocation(data).subscribe(
            data => this.addItemLocationSuccess(data),
            error => this.getDataFail(error)
        );
    }

    // getVendorTags - Success
    getDataSuccess(res) {
        if (res.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['GET_TAGS_FAILED']);
        } else {
            const response: any = res.data[0][0];
            this._spinner.hide();
            if (response.description) {
                this.form.controls['description'].setValue(response.description);
            }
            if (response.name) {
                this.form.controls['almirahName'].setValue(response.name);
            }
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

    // set up form.
    userBasicInfo() {
        this.form = this.fb.group({
            'almirahName': this.fb.control('', Validators.compose([Validators.required])),
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
