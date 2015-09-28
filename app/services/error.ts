/**
 * Created by cghislai on 31/08/15.
 */

import {ComptoirError} from 'client/utils/request';

export class ErrorService {
    hasError:boolean = false;
    errorContent:string;
    errorHeader:string;
    errorFooter:string;

    handleRequestError(error:ComptoirError) {
        if (error == ComptoirError.DISCARDED_ERROR) {
            return;
        }
        this.hasError = true;
        console.log(error);

        switch (error.code) {
            case 0: {
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
        if (error.request != null) {
            this.errorContent = "Request: " + error.request.getDebugString();
        }
        this.errorContent = "Response code:" + error.code + "\n";
        this.errorContent += "Message: " + error.text;
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