import {Component, ViewContainerRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms'
import {Router}  from '@angular/router';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";


@Component({
    selector: 'browseOfferings',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./browseOfferings.scss'],
    templateUrl: './browseOfferings.html'
})

export class BrowseOfferings {
    viewAllPage:boolean = true;
    newOfferingPage:boolean = false;
    recentlyAddedPage:boolean = false;
    endingSoonPage:boolean = false;
    successfulPage:boolean = false;
    offeringsList:any = [];

    offeringList = [{
        type: 'Active Equity Offering',
        location: 'Equity Calgary, Alberta CA',
        raised: '$1,00,000',
        daysLeft: '98',
        annualReturn: '5%',
        propType: '20',
        offerType: 'Equity',
        term: '5 years',
        progress: '80',
        imgSrc: '../../../assets/img/offering1.jpg',
        progressDollarValue: '$80,000'
    },
        {
            type: 'Active Equity Offering',
            location: 'Equity Calgary, Alberta, CA',
            raised: '$1,00,000',
            daysLeft: '100',
            annualReturn: '6%',
            propType: '20',
            offerType: 'Equity',
            term: '3 years',
            progress: '40',
            imgSrc: '../../../assets/img/offering1.jpg',
            progressDollarValue: '$40,000'
        },
        {
            type: 'Active Equity Offering',
            location: 'Equity Calgary, Alberta CA',
            raised: '$1,00,000',
            daysLeft: '98',
            annualReturn: '7%',
            propType: '20',
            offerType: 'Equity',
            term: '2 years',
            progress: '50',
            imgSrc: '../../../assets/img/offering1.jpg',
            progressDollarValue: '$50,000'
        },
        {
            type: 'Active Equity Offering',
            location: 'Equity Calgary, Alberta CA',
            raised: '$1,00,000',
            daysLeft: '98',
            annualReturn: '3%',
            propType: '20',
            offerType: 'Equity',
            term: '3 years',
            progress: '90',
            imgSrc: '../../../assets/img/offering1.jpg',
            progressDollarValue: '$90,000'
        },
        {
            type: 'Active Equity Offering',
            location: 'Equity Calgary, Alberta CA',
            raised: '$1,00,000',
            daysLeft: '98',
            annualReturn: '5%',
            propType: '30',
            offerType: 'Equity',
            term: '5 years',
            progress: '50',
            imgSrc: '../../../assets/img/offering1.jpg',
            progressDollarValue: '$50,000'
        },];


    constructor(private router:Router, private adminServices:ApplicationAdminServices, private spinner:BaThemeSpinner, private fb:FormBuilder, private authentication:AuthenticationHelper, private appService:ApplicationAdminServices, public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.spinner.hide();
        this.getAllOfferings();
        this.authentication.setChangedContentTopText('Browse Offerings');
    }

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    getAllOfferings() {
        this.spinner.show();
        let searchValue = '?status=' + 'active';
        this.adminServices.getOfferings(searchValue).subscribe(
            data => this.getAllOfferingsSuccess(data),
            error => this.geAllOfferingsFail(error)
        );
    }


    /**
     * If get all offerings success
     * @param data
     */
    getAllOfferingsSuccess(data) {
        this.spinner.hide();
        if (data.success.status === 1) {
            this.offeringsList = [];
            data.success.data.deals.forEach(offeringInfo => {
                let dataObject = {
                    id: offeringInfo._id,
                    type: offeringInfo.type,
                    daysLeft: '98',
                    location: 'Equity Calgary, Alberta CA',
                    goal: offeringInfo.offeringAmount,
                    annualReturn: '5%',
                    progress: '50',
                    propType: 'New Build',
                    offerType: offeringInfo.issueType,
                    term: '5 years',
                    imgSrc: '../../../assets/img/offering1.jpg',
                    progressDollarValue: '$50,000'
                };
                this.offeringsList.push(dataObject);
            });
        }
    }

    /**
     * if get all offerings fail
     * @param Error
     */
    geAllOfferingsFail(Error) {
        this.spinner.hide();
        if (Error.error && Error.error.message) {
            this.toastr.error(Error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }


    // Function to make selected tab active and other's inactive.
    changeTab(id) {
        if (id === "newOffering") {
            this.newOfferingPage = true;
            this.viewAllPage = false;
            this.recentlyAddedPage = false;
            this.endingSoonPage = false;
            this.successfulPage = false
        } else if (id === "recentlyAdded") {
            this.recentlyAddedPage = true;
            this.viewAllPage = false;
            this.newOfferingPage = false;
            this.endingSoonPage = false;
            this.successfulPage = false
        } else if (id === "endingSoon") {
            this.endingSoonPage = true;
            this.viewAllPage = false;
            this.newOfferingPage = false;
            this.recentlyAddedPage = false;
            this.successfulPage = false;
        } else if (id === "successfull") {
            this.endingSoonPage = false;
            this.viewAllPage = false;
            this.newOfferingPage = false;
            this.recentlyAddedPage = false;
            this.successfulPage = true
        } else {
            this.viewAllPage = true;
            this.endingSoonPage = false;
            this.newOfferingPage = false;
            this.recentlyAddedPage = false;
            this.successfulPage = false;
        }
    }

    navigateToOffering() {
        this.router.navigate(['offering']);
    }
}
