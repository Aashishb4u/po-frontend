import {Component, OnInit} from '@angular/core';
import {AuthenticationHelper} from "../../app.authentication";
import {Router, ActivatedRoute}  from '@angular/router';
import {NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation} from 'ngx-gallery';
import {ApplicationAdminServices} from "../../appServices/application";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'offering',
    styleUrls: ['./offering.scss'],
    templateUrl: './offering.html'
})
export class Offering implements OnInit {
    overviewPage:boolean = true;
    updatesPage:boolean = false;
    questionsPage:boolean = false;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    offeringId: string = '';
    offeringData: any = {};

    constructor(private authentication:AuthenticationHelper, private router:Router, public toastr: ToastsManager,
                private appService: ApplicationAdminServices, private routes: ActivatedRoute) {
        // this.offeringId = this.routes.snapshot.queryParams['id'];
        this.offeringId = '5a097ea13543ed07ba8fb0e0';
        this.authentication.setChangedContentTopText('Offering');
    }

    ngOnInit() {
        this.galleryOptions = [
            {
                width: '100%',
                height: '400px',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];

        this.galleryImages = [
            {
                small: 'assets/img/offering.png',
                medium: 'assets/img/offering.png',
                big: 'assets/img/offering.png'
            },
            {
                small: 'assets/img/offering1.jpg',
                medium: 'assets/img/offering1.jpg',
                big: 'assets/img/offering1.jpg'
            },
            {
                small: 'assets/img/offering.png',
                medium: 'assets/img/offering.png',
                big: 'assets/img/offering.png'
            }
        ];
        this.getOfferingsDetails();
    }

    // Api call to get specific offering, if success getSpecificOfferingSuccess(data) and if error getSpecificOfferingFail(error)
    getOfferingsDetails() {
        this.appService.getSpecificOffering(this.offeringId).subscribe(
            data => this.getOfferingsDetailsSuccess(data),
            error => this.getOfferingsDetailsFail(error)
        );
    }

    //if get specific offering success
    getOfferingsDetailsSuccess(fetchedOfferingData) {
        this.offeringData = fetchedOfferingData.success.data;
        let date1 = this.offeringData.startDate;
        let date2 = this.offeringData.endDate;
        let diffInMs = Date.parse(date2) - Date.parse(date1);
        let diffInYears = Math.floor(diffInMs / 1000 / 60 / 60 / 24 / 365);
        this.offeringData.term = diffInYears;
    }

    //if get specific offering fail
    getOfferingsDetailsFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    // Function to make selected tab active and other's inactive.
    changeTab(id) {
        if (id === "updates") {
            this.overviewPage = false;
            this.updatesPage = true;
            this.questionsPage = false;

        } else if (id === "questions") {
            this.overviewPage = false;
            this.updatesPage = false;
            this.questionsPage = true;
        } else {
            this.overviewPage = true;
            this.updatesPage = false;
            this.questionsPage = false;
        }
    }
}
