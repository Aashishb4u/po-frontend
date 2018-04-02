import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class Utility {
    states = [];
    successMessages: any;
    poSubject: any;
    poTemplate: any;
    // tudipLogoBase64: any;
    errorMessages: any;
    configurationCkEditor: any;
    constructor() {
        this.poSubject = 'Test Email';
        this.poTemplate = '<b> Hello, </b> <p> Greetings,</p> <p>This is Test Mail</p>'
        this.states = [
            'Andaman and Nicobar Islands',
            'Andra Pradesh',
            'Arunachal Pradesh',
            'Assam',
            'Bihar',
            'Chandigarh',
            'Chhattisgarh',
            'Dadar and Nagar Haveli',
            'Daman and Diu',
            'Delhi',
            'Goa',
            'Gujarat',
            'Haryana',
            'Himachal Pradesh',
            'Jammu and Kashmir',
            'Jharkhand',
            'Karnataka',
            'Kerala',
            'Lakshadeep',
            'Madya Pradesh',
            'Maharashtra',
            'Manipur',
            'Meghalaya',
            'Mizoram',
            'Nagaland',
            'Orissa',
            'Pondicherry',
            'Punjab',
            'Rajasthan',
            'Sikkim',
            'Tamil Nadu',
            'Telangana',
            'Tripura',
            'Uttaranchal',
            'Uttar Pradesh',
            'West Bengal',
        ];

        this.successMessages = {
            'ADD_VENDOR_SUCCESS': 'Vendor Added Successfully',
            'EDIT_VENDOR_FINANCE_SUCCESS': 'Financial Information Updated Successfully',
            'EDIT_VENDOR_CONTACT_SUCCESS': 'Contact Information Updated Successfully',
            'DELETE_VENDOR_SUCCESS': 'Vendor Deleted Successfully',
            'ADD_TAG_SUCCESS': 'Category Added Successfully',
            'ADD_TERMS_SUCCESS': 'Terms and Conditions Added Successfully',
            'EDIT_TAG_SUCCESS': 'Category Updated Successfully',
            'DELETE_TAG_SUCCESS': 'Category Deleted Successfully',
            'ADD_ITEM_SUCCESS': 'Item Added Successfully',
            'EDIT_ITEM_SUCCESS': 'Item Updated Successfully',
            'DELETE_ITEM_SUCCESS': 'Item Deleted Successfully',
            'ADD_VENDOR_ITEM_SUCCESS': "Vendor's Item Added Successfully",
            'EDIT_VENDOR_ITEM_SUCCESS': "Vendor's Item Updated Successfully",
            'DELETE_VENDOR_ITEM_SUCCESS': "Vendor's Item Deleted Successfully",
            'DELETE_ITEM_QUANTITY_SUCCESS': "Item Quantity Deleted Successfully",
            'DELETE_ITEM_USED_SUCCESS': "Item Used Deleted Successfully",
            'DELETE_PURCHASE_ORDER_SUCCESS': "Purchase Order Deleted Successfully",
            'SEND_PURCHASE_ORDER_SUCCESS': "Purchase Order sent to Vendor Successfully",
            'ADD_PURCHASE_ORDER_SUCCESS': "Purchase Order Added Successfully",
        };

        this.errorMessages = {
            'EXCEPTION': 'Something Went Wrong',
            'ADD_VENDOR_FAIL': 'Vendor Added Failed',
            'EDIT_VENDOR_FAIL': 'Vendor Updated Failed',
            'DELETE_VENDOR_FAIL': 'Vendor Deleted Failed',
            'ADD_TAG_FAIL': 'Category Added Failed',
            'EDIT_TAG_FAIL': 'Category Updated Failed',
            'DELETE_TAG_FAIL': 'Category Deleted Failed',
            'TAG_EXIST': 'Category Already Exist',
            'TAG_INVALID_ENTRY': 'Please Enter Category First',
            'ADD_ITEM_FAIL': 'Item Added Failed',
            'EDIT_ITEM_FAIL': 'Item Updated Failed',
            'DELETE_ITEM_FAIL': 'Item Deleted Failed',
            'ITEM_ALREADY_EXIST': 'Item Already Exist',
            'ADD_VENDOR_ITEM_FAIL': "Vendor's Item Added Failed",
            'EDIT_VENDOR_ITEM_FAIL': "Vendor's Item Updated Failed",
            'DELETE_VENDOR_ITEM_FAIL': "Vendor's Item Deleted Failed",
            'NO_VENDOR_ITEMS': "Vendor's Item should not be empty",
            'DELETE_PURCHASE_ORDER_FAIL': 'Purchase Order Deleted Failed',
            'SEND_PURCHASE_ORDER_FAIL': 'Purchase Order sending to Vendor Failed',
            'ADD_PURCHASE_ORDER_FAIL': 'Purchase Order Added Failed',
            'FILL_PURCHASE_ORDER_DETAILS': 'Please fill item details in purchase order first',
            'GET_TAGS_FAILED': 'Failed to get categories',
            'LOCTION_NOT_FOUND': 'Failed to get item locations',
        };

    this.configurationCkEditor = {
            // fullPage: true,
            toolbar: [
                {name: 'document', items: ['Source', '-', 'Preview', 'Print', '-', 'Templates']},
                {name: 'links', items: ['Anchor', 'Link', 'Unlink']},
                {name: 'insert', items: ['SpecialChar', 'Iframe', 'HorizontalRule', 'Smiley', '-', 'Image']},
                {name: 'tools', items: ['About', 'Maximize', 'ShowBlocks']}, '/',
                {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript']},
                {
                    name: 'paragraph',
                    items: ['BulletedList', 'NumberedList', '-', 'JustifyCenter', 'Outdent', 'Indent', 'JustifyLeft', 'JustifyRight', 'JustifyBlock']
                }, '/',
                {name: 'colors', items: ['TextColor', 'BGColor']},
                {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt']},
                {name: 'clipboard', items: ['Cut', 'Copy', 'Undo', 'Redo']},
                {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']}
            ]
        };
    }

}