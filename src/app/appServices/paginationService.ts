import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientHelper } from '../app.httpClient';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()

export class PaginationService {

    private loginUrl: string = '/addVendor';
    private getAllTagsUrl: string = '/addVendor';
    private viewPurchaseOrderUrl: string = '/viewPurchaseOrders';
    private getVendorsUrl: string = '/getVendors';
    private getItemQuantityUrl: string = '/getItemQuantity';
    private getItemQuantityUsedUrl: string = '/getUsedItemQuantity';
    private getItemsUrl: string = '/viewItems';
    private getItemLocationsUrl: string = '/viewItemLocations';
    private getPaymentsUrl: string = '/getPaymentDetails';
    private getItemsReceivedUrl: string = '/getItemsReceived';
    private getVendorItemsByIdUrl: string = '/getVendorItems';
    private getVendorsBySearchUrl: string = '/getVendorsByFilters';
    private getItemsBySearchUrl: string = '/viewItemsBySearch';


    private httpClient: HttpClientHelper;

    constructor(httpClient: HttpClientHelper, private router: Router, public toastr: ToastsManager) {
        this.httpClient = httpClient;
    }

    userLogin(data): Observable<any> {
        return this.httpClient.post(this.loginUrl, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    viewPurchaseOrderbyId(data, page): Observable<any> {
        return this.httpClient.post(this.viewPurchaseOrderUrl + '?page=' + page, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    getItemQuantityDetails(data, page): Observable<any> {
        return this.httpClient.post(this.getItemQuantityUrl + '?page=' + page, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    getItemQuantityUsedDetails(data, page): Observable<any> {
        return this.httpClient.post(this.getItemQuantityUsedUrl + '?page=' + page, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    /**
     * To get call for show Vendors by Id.
     * @returns {Observable<any>}
     */

    getVendors(page): Observable<any> {
        return this.httpClient.get(this.getVendorsUrl + '?page=' + page)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    getVendorsBySearch(data, page): Observable<any> {
        return this.httpClient.post(this.getVendorsBySearchUrl + '?page=' + page, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    getItemsBySearch(data, page): Observable<any> {
        return this.httpClient.post(this.getItemsBySearchUrl + '?page=' + page, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    /**
     * To get call for show Vendors by Id.
     * @returns {Observable<any>}
     * */
    getVendorItemsById(data, page): Observable<any> {
        return this.httpClient.post(this.getVendorItemsByIdUrl + '?page=' + page, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    getItems(page): Observable<any> {
        return this.httpClient.get(this.getItemsUrl + '?page=' + page)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    getItemLocation(page): Observable<any> {
        return this.httpClient.get(this.getItemLocationsUrl + '?page=' + page)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }


    getPaymentDetails(page, data): Observable<any> {
        return this.httpClient.post(this.getPaymentsUrl + '?page=' + page, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    getItemsReceivedDetails(page, data): Observable<any> {
        return this.httpClient.post(this.getItemsReceivedUrl + '?page=' + page, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    getAllTags(): Observable<any> {
        return this.httpClient.get(this.getAllTagsUrl)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    // editUserProfile(data): Observable<any> {
    //     return this.httpClient.put(this.editUserProfileUrl, data)
    //         .map(this.extractResponse)
    //         .catch(this.handleError.bind(this));
    // }

    extractResponse(res) {
        return res;
    }

    private handleError(error) {
        let errorCode = error.error.code;
        // if invalid token or token expired
        if (errorCode == '-114' || errorCode == -114 || errorCode == '-102' || errorCode == -102 || errorCode == '-132'
            || errorCode == -132) {
            // if the user is inactivated by the admin
            if (errorCode == '-132' || errorCode == -132) {
                localStorage.clear();
                this.toastr.error(error.error.message);
                setTimeout(() => {
                    this.router.navigate(['login']);
                }, 3000);
            } else {
                localStorage.clear();
                this.router.navigate(['login']);
            }
        } else {
            return Observable.throw(error);
        }
    }
}
