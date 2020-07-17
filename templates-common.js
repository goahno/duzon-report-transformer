import {
    createElementFromHtmlString
} from './commons.js';

const templates = {

    reportTypeButtons: `
        <div>
            <button id="btnCreditDebitReport">징수(수입), 지출 결의서</button>
            <button id="btnCategoryReport">징수부, 지출부</button>
        </div>
    `.removeWhitespaces(),

    coampanyInfoAndFiscalYear: `
        <div>
            회사명: <input type="text" id="inputCompanyName" value="{{companyName}}">
            회계년도: <input type="text" id="inputFiscalYear" maxlength="4" value="{{fiscalYear}}">
        </div>
    `.removeWhitespaces(),

    categoryGroupDivider: '<hr class="category-group-divider">',

    btnTransform: '<button id="btnTransform">변환하기</button>',
}

class TemplateRenderer {
    createReportTypeButtons() {
        return createElementFromHtmlString(templates.reportTypeButtons);
    }

    createCompnayInfoAndFiscalYearInputs(companyName, fiscalYear) {
        const rendered = Mustache.render(templates.coampanyInfoAndFiscalYear, {
            companyName: companyName,
            fiscalYear: fiscalYear,
        });
        return createElementFromHtmlString(rendered);
    }

    createCategoryGroupDivider() {
        return createElementFromHtmlString(templates.categoryGroupDivider);
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