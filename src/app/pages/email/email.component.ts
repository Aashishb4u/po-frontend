import {Component} from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
    selector: 'email',
    styleUrls: ['./email.scss'],
    templateUrl: './email.html'
})
export class Email {
    content: any;
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = fb.group({
            'select': ['']
        });
    }

    saveTemplate(value) {
        let data = {
            selectedTemplate: value,
            templateContent: this.content,
        };
    }

    disableSubmit() {
        if (!this.form.controls['select'].value || !this.content) {
            return true;
        } else {
            return false;
        }
    }

}
