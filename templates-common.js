import {
    createElementFromHtmlString
} from './commons.js';

const templates = {
    coampanyInfoAndFiscalYear: `
        <div>
            회사명: <input type="text" id="inputCompanyName" value="{{companyName}}">
            회계년도: <input type="text" id="inputFiscalYear" maxlength="4" value="{{fiscalYear}}">
        </div>
    `.removeWhitespaces(),

    divider: '<hr class="divider">',

    btnTransform: '<button id="btnTransform">변환하기</button>',
}

class TemplateRenderer {
    createCompnayInfoAndFiscalYearInputs(companyName, fiscalYear) {
        const rendered = Mustache.render(templates.coampanyInfoAndFiscalYear, {
            companyName: companyName,
            fiscalYear: fiscalYear,
        });
        return createElementFromHtmlString(rendered);
    }

    createDivider() {
        return createElementFromHtmlString(templates.divider);
    }

    createBtnTransform() {
        return createElementFromHtmlString(templates.btnTransform);
    }
}

const renderer = new TemplateRenderer();
export {
    renderer as
    default
};