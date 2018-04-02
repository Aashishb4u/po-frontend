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
    selector: 'editTermsAndCondition',
    styleUrls: ['./editT&C.scss'],
    templateUrl: './editT&C.html',
    providers: [Utility],
})

export class editTermsAndCondition {
    imageUrl:string;
    financeTab: boolean = false;
    contactTab: boolean = true;
    purchaseTab: boolean = false;
    paymentTab: boolean = false;
    tagsArray: any = [];
    numberMask: any;
    description: any = '';
    categoryData: any =[];
    preTagsData: any =[];
    deleteArray: any =[];
    configurationCkEditor: any;
    placeHolderForTag: string;
    pinMask: any;
    termId: any;
    categoriesMessage: boolean;
    pinMessage: boolean;
    @ViewChildren('vendorName') firstField;

    constructor(private fb:FormBuilder,private userUtility: Utility, private router:Router,private routes: ActivatedRoute, private authentication:AuthenticationHelper, private appService:ApplicationAdminServices, public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Edit Terms And Conditions');
        this.numberMask = [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];
        this.pinMask = [/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];
    this.placeHolderForTag = 'Add T&C';
    this.termId  = this.routes.snapshot.queryParams['id'];
    }

    ngOnInit() {
        this.getVendorTags();
    }

    ngAfterViewInit(){
        this.getTermsById();
    }

    goBack() {
        this.router.navigate(['/viewTermsAndConditions']);
    }

    editTerms() {
        const termsData: any = {
            'categories' : this.categoryData,
            'delete_categories' : this.deleteArray,
            'terms' : this.description,
            'term_id' : this.termId,
        };

        this.appService.editTermsCondition(termsData).subscribe(
            data => this.addNewVendorSuccess(data),
            error => this.addNewVendorFail(error)
        );
    }

    getVendorTags() {
        this._spinner.show();
        this.appService.getAllTags().subscribe(
            data => this.getDataSuccess(data),
            error => this.getDataFail(error)
        );
    }

    getTermsById() {
        this._spinner.show();
        let data: any = {
            id_term : this.termId
        };
        this.appService.getTermsById(data).subscribe(
            data => this.getTermsByIdSuccess(data),
            error => this.getTermsByIdFail(error)
        );
    }

    getDataSuccess(res) {
        this._spinner.hide();
        this.tagsArray = [];
        res.data[0].forEach((item: any ) => {
            this.tagsArray.push(item);
        });
    }

    getTermsByIdSuccess(res) {
        this.preTagsData = [];
        this._spinner.hide();
        res.data[0][0].forEach(val => {
            this.preTagsData.push(val.id.toString());
        });
        this.description = res.data[0][1][0].terms;
        this.categoryData = Array.from(this.preTagsData);
    }

    checkValue(data) {
        this.deleteArray = [];
        this.preTagsData.forEach(val => {
            if (this.categoryData.indexOf(val) === -1) {
                this.deleteArray.push(val);
            }
        });
    }

    getDataFail(res) {
        this._spinner.hide();
        if (res.error && res.error.message) {
            this.toastr.error(res.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    getTermsByIdFail(res) {
        this._spinner.hide();
        if (res.error && res.error.message) {
            this.toastr.error(res.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }


    // ngAfterViewInit() {
    //     this.firstField.first.nativeElement.focus();
    // }

    // set up form.
    addCandidatetags(event) {
    }
    removeCandidatetags(event: any) {

    }

    // if edit profile success
    addNewVendorSuccess(result) {
        if (result.status < 0) {
            this.toastr.error(this.userUtility.errorMessages['ITEM_ALREADY_EXIST']);
        } else {
            this.toastr.success("Terms and conditions edited successfully");
            this.router.navigate(['/viewTermsAndConditions']);
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
