/**
 * Created by cghislai on 14/08/15.
 */
import {Component} from 'angular2/core';
import {NgIf, FORM_DIRECTIVES} from 'angular2/common';
import {Router, RouterLink} from 'angular2/router';

import {CompanyRef} from '../../../client/domain/company';
import {Language} from '../../../client/utils/lang';

import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';
import {CompanyService} from '../../../services/company';


@Component({
    selector: 'import-items',
    templateUrl: './routes/items/import/importView.html',
    styleUrls: ['./routes/items/import/importView.css'],
    directives: [NgIf, FORM_DIRECTIVES, RouterLink]
})
export class ItemsImportView {
    errorService:ErrorService;
    authService:AuthService;
    router:Router;
    language:Language;
    companyService:CompanyService;

    toUploadFile:File;
    toUploadFileSizeLabel:string;
    toUploadData:ArrayBuffer;

    uploadInProgress:boolean;
    uploadPercentage:number;

    constructor(errorService:ErrorService, authService:AuthService,
                companyService: CompanyService, router:Router) {
        this.router = router;
        this.errorService = errorService;
        this.authService = authService;
        this.companyService = companyService;
        this.language = authService.getEmployeeLanguage();

        this.toUploadFile = null;
        this.toUploadData = null;
        this.toUploadFileSizeLabel = null;
        this.uploadInProgress = false;
        this.uploadPercentage = 0;
    }


    onFileSelectClick(fileInput) {
        fileInput.click();
    }

    onFileSelected(form, event) {
        var files = event.target.files;
        if (files.length !== 1) {
            return;
        }
        this.toUploadFile = files[0];
        var size = this.toUploadFile.size;

        this.toUploadFileSizeLabel = size + ' bytes';
        // optional code for multiples approximation
        for (var aMultiples = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'], nMultiple = 0, nApprox = size / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            this.toUploadFileSizeLabel = nApprox.toFixed(3) + ' ' + aMultiples[nMultiple];// + ' (' + size + ' bytes)';
        }

        new Promise<ArrayBuffer>((resolve, reject)=> {
            var reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.readAsArrayBuffer(this.toUploadFile);
        }).then((data: ArrayBuffer)=> {
                this.toUploadData = data;
            });
    }


    onSubmit() {
        var thisView = this;
        this.uploadInProgress = true;
        var authToken = this.authService.authToken;
        var companyRef = new CompanyRef(this.authService.auth.employee.company.id);
        this.companyService
            .uploadImportDataFile(this.toUploadData, companyRef, authToken,
            (percentage:number)=> {
                thisView.uploadPercentage = percentage;
            })
            .then(()=> {
                thisView.uploadInProgress = false;
                thisView.router.navigate(['/Items/List']);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

}
