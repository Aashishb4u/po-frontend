import {Routes, RouterModule}  from '@angular/router';
import {Pages} from './pages.component';
import {ModuleWithProviders} from '@angular/core';
import {LoginGuard} from "../filter/app.guard";
import {AdminGuard} from "../filter/app.adminGuard";

export const routes:Routes = [
    {
        path: 'login',
        loadChildren: 'app/pages/login/login.module#LoginModule',
    },
    {
        path: '',
        loadChildren: 'app/pages/login/login.module#LoginModule'
    },
    {
        path: 'forgot-password',
        loadChildren: 'app/pages/forgotPassword/forgotPassword.module#ForgotPasswordModule'
    },
    {
        path: 'signup',
        loadChildren: 'app/pages/signUp/signUp.module#SignUpModule'
    },
    {
        path: 'reset-password',
        loadChildren: 'app/pages/resetPassword/resetPassword.module#ResetPasswordModule'
    },
    {
        path: 'set-password',
        loadChildren: 'app/pages/setPassword/setPassword.module#SetPasswordModule'
    },
    {
        path: 'email-verification',
        loadChildren: 'app/pages/emailVerificationConfirmation/emailVerificationConfirmation.module#EmailVerificationModule'
    },
    {
        path: '',
        component: Pages,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'user',
                loadChildren: './user/user.module#UserModule',
                canActivate: [LoginGuard, AdminGuard]
            },
            {
                path: 'addVendor',
                loadChildren: './addVendor/addVendor.module#addVendorModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'editVendor',
                loadChildren: './editVendor/editVendor.module#editVendorModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'viewVendors',
                loadChildren: './vendor/vendor.module#VendorModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'viewTermsAndConditions',
                loadChildren: './viewTermsAndConditions/viewTermsAndConditions.module#viewTermsAndConditionsModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'viewItems',
                loadChildren: './item/item.module#itemModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'paymentDetails',
                loadChildren: './paymentDetails/paymentDetails.module#paymentDetailsModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'receivedItems',
                loadChildren: './receivedItems/receivedItems.module#receivedItemsDetailsModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'addItem',
                loadChildren: './addItem/addItem.module#addItemModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'addTermsAndCondition',
                loadChildren: './addT&C/addT&C.module#addTermsAndConditionModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'editTermsAndCondition',
                loadChildren: './editT&C/editT&C.module#editTermsAndConditionModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'editItem',
                loadChildren: './editItem/editItem.module#editItemModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'purchaseOrder',
                loadChildren: './purchaseOrder/purchaseOrder.module#purchaseOrderModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'createPurchaseOrder',
                loadChildren: './createPurchaseOrder/createPurchaseOrder.module#createPurchaseOrderModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'editPurchaseOrder',
                loadChildren: './editPurchaseOrder/editPurchaseOrder.module#editPurchaseOrderModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'settings',
                loadChildren: './settings/settings.module#SettingsModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'viewCategories',
                loadChildren: './viewTags/viewTags.module#ViewTagsModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'almirah',
                loadChildren: './almirah/almirah.module#almirahModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'addAlmirah',
                loadChildren: './addAlmirah/addAlmirah.module#addAlmirahModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'editAlmirah',
                loadChildren: './editAlmirah/editAlmirah.module#editAlmirahModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'profile',
                loadChildren: './Profile/profile.module#ProfileModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'inactive-user',
                loadChildren: './InActiveUser/inActiveUser.module#inActiveUserModule',
                canActivate: [LoginGuard, AdminGuard]
            },
            {
                path: 'email',
                loadChildren: './email/email.module#EmailModule',
                canActivate: [LoginGuard, AdminGuard]
            },
            {
                path: 'add-user',
                loadChildren: './addUser/addUser.module#AddUserModule',
                canActivate: [LoginGuard, AdminGuard]
            },
            {
                path: 'investor',
                loadChildren: './investor/investor.module#InvestorModule',
                canActivate: [LoginGuard, AdminGuard]
            },
            {
                path: 'investor-profile',
                loadChildren: './investorProfile/investorProfile.module#InvestorProfileModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'manage-offering',
                loadChildren: './manageOfferings/offerings.module#OfferingsModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'add-offering',
                loadChildren: './addOffering/addOffering.module#AddOfferingModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'browse-offering',
                loadChildren: './browseOfferings/browseOfferings.module#BrowseOfferingsModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'edit-offering',
                loadChildren: './editOffering/editOffering.module#EditOfferingModule',
                canActivate: [LoginGuard]
            },
            {
                path: 'offering',
                loadChildren: './offering/offering.module#OfferingModule',
                canActivate: [LoginGuard]},

        ]
    }
];

export const routing:ModuleWithProviders = RouterModule.forChild(routes);
