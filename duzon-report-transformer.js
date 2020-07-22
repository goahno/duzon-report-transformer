import { clearInnerHtmlById } from './commons.js';
import {
    parseDuzonReport
} from './duzon-report-parser.js';
import {
    renderCreditDebitReportInputArea
} from './credit-debit-report.js';
import {
    renderCategoryReportInputArea
} from './category-report.js';

document.querySelectorAll('#readButtonArea >button').forEach(elem => {
    elem.addEventListener('click', onClickReportButton);
});

function onClickReportButton(event) {
    clearInputAndReport();

    const file = document.getElementById('srcFile').files[0];
    if (!file) {
        alert('선택된 파일이 없습니다.');
        return;
    }

    const fileEncoding = document.getElementById('fileEncoding').value
    parseDuzonReport(file, fileEncoding,
        data => onCompleteParse(event.target.value, data));
}

function onCompleteParse(type, data) {
    switch (type) {
        case 'creditDebitReport':
            renderCreditDebitReportInputArea(data)
            break;

        case 'categoryReport':
            renderCategoryReportInputArea(data)
            break;
    }
}

function clearInputAndReport() {
    clearInnerHtmlById('inputArea');
    clearInnerHtmlById('printPageCountArea');
    clearInnerHtmlById('printPageButtonsArea');
    clearInnerHtmlById('currentPages');
    clearInnerHtmlById('printArea');
}
