/**
 * Created by cghislai on 31/08/15.
 */
import {Inject, Injectable,Injector} from 'angular2/core';
import {Response} from 'angular2/http';

import {ComptoirError} from '../client/utils/request';

@Injectable()
export class ErrorService {
    hasError:boolean = false;
    errorContent:string;
    errorHeader:string;
    errorFooter:string;

    handleRequestError(error:ComptoirError|Response) {
        if (error instanceof ComptoirError) {
            this.handleComptoirRequestError(error);
            return;
        } else if (error instanceof Response) {
            var response:Response = <Response>error;

            var requestInfo = response.type + ' ' + response.url + ' : ' + response.statusText;
            this.handleError(response.status, response.text(), requestInfo);
        } else {
            console.error(error);
            this.handleError(null, 'Erreur inconne', null);
        }
    }

    handleComptoirRequestError(error:ComptoirError) {
        if (error === ComptoirError.DISCARDED_ERROR) {
            return;
        }
        console.error(error);

        var requestInfo:string = null;
        if (error.request != null) {
            requestInfo = error.request.getDebugString();
        }
        this.handleError(error.code, error.text, requestInfo);
    }

    private handleError(code:number, text:string, requestInfo?:string) {
        this.hasError = true;

        switch (code) {
            case 0:
            {
                this.errorHeader = "Imposssible de contacter le server. <br/>";
                this.errorHeader += "Vérifiez que vous êtes bien connecté à internet.<br/>";
                this.errorFooter = "Si le problème persiste, contactez ";
                this.errorFooter += this.getMailtoSupportLink();
                this.errorFooter += ".";
                this.errorContent = null;
                return;
            }
        }
        this.errorHeader = "Une erreur est survenue lors de l'envoi d'une requete au server:";
        if (requestInfo != null) {
            this.errorContent = "Request: " + requestInfo;
        }
        this.errorContent = "Response code:" + code + "\n";
        this.errorContent += "Message: " + text;
        this.errorFooter = "Essayez de répéter l'action que vous venez de commettre.<br/>";
        this.errorFooter += "Si le probleme persiste, contactez ";
        this.errorFooter += this.getMailtoSupportLink();
        this.errorFooter += ".";
    }

    getMailtoSupportLink() {
        var string = "<a href='mailto:support@valuya.be'>le support</a>";
        return string;
    }

    showFatalError(error:Error) {
        this.hasError = true;
        this.errorHeader = "Une erreur fatale s'est produite.";
        this.errorContent = error.name;
        this.errorContent += ": " + error.message;
        this.errorFooter = "Veuillez contacter ";
        this.errorFooter += this.getMailtoSupportLink();
        this.errorFooter += ".";
    }

    dismissError() {
        this.hasError = false;
        this.errorContent = null;
        // refresh page
        //window.location.reload();
    }


}