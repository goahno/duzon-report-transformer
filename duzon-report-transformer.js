import renderer from './templates-common.js';
import {
    parseDuzonReport
} from './duzon-report-parser.js';
import {
    renderCreditDebitReportInputArea
} from './credit-debit-report.js';
import {
    renderCategoryReportInputArea
} from './category-report.js';

document.getElementById('btnReadFile').addEventListener('click', (event) => {
    clearInputAndReport();

    const file = document.getElementById('srcFile').files[0];
    if (!file) {
        alert('선택된 파일이 없습니다.');
        return;
    }

    const fileEncoding = document.getElementById('fileEncoding').value
    parseDuzonReport(file, fileEncoding, onCompleteParse);
});

function onCompleteParse(data) {
    document.getElementById('selectReportTypeArea')
        .appendChild(renderer.createReportTypeButtons());

    document.getElementById('btnCreditDebitReport').addEventListener('click',
        event => renderCreditDebitReportInputArea(data)
    );

    document.getElementById('btnCategoryReport').addEventListener('click',
        event => renderCategoryReportInputArea(data)
    );
}

function clearInputAndReport() {
    clearInnerHtmlById('selectReportTypeArea');
    clearInnerHtmlById('inputArea');
    clearInnerHtmlById('printPageCountArea');
    clearInnerHtmlById('printPageButtonsArea');
    clearInnerHtmlById('currentPages');
}

function clearInnerHtmlById(id) {
    document.getElementById(id).innerHTML = '';
}