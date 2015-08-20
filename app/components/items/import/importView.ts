/**
 * Created by cghislai on 14/08/15.
 */
import {Component, View, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';

import {CompanyClient} from 'client/company';
import {Language, LocaleTexts} from 'client/utils/lang';

import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';


@Component({
    selector: 'importItems'
})
@View({
    templateUrl: './components/items/import/importView.html',
    styleUrls: ['./components/items/import/importView.css'],
    directives: [NgIf, FORM_DIRECTIVES, RouterLink]
})
export class ImportProductView {
    applicationService:ApplicationService;
    authService:AuthService;
    router:Router;
    language:Language;
    companyClient:CompanyClient;

    toUploadFile:File;
    toUploadFileSizeLabel:string;
    toUploadData:ArrayBuffer;

    uploadInProgress:boolean;
    uploadPercentage:number;

    constructor(appService:ApplicationService, authService:AuthService, router:Router) {
        this.router = router;
        this.applicationService = appService;
        this.authService = authService;
        this.companyClient = new CompanyClient();
        this.language = appService.language;

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
        if (files.length != 1) {
            return;
        }
        this.toUploadFile = files[0];
        var size = this.toUploadFile.size;

        this.toUploadFileSizeLabel = size + " bytes";
        // optional code for multiples approximation
        for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = size / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            this.toUploadFileSizeLabel = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + size + " bytes)";
        }

        var reader = new FileReader();
        var thisView = this;
        reader.onload = function () {
            thisView.toUploadData = reader.result;
        };

        reader.readAsArrayBuffer(this.toUploadFile);
    }


    onSubmit() {
        var thisView = this;
        this.uploadInProgress = true;
        var authToken = this.authService.authToken;
        var companyRef = this.authService.loggedEmployee.companyRef;
        this.companyClient
            .uploadImportDataFile(this.toUploadData, companyRef, authToken,
            (percentage:number)=> {
                thisView.uploadPercentage = percentage;
            })
            .then(()=> {
                thisView.uploadInProgress = false;
                thisView.router.navigate('/items/list');
            });
    }

}