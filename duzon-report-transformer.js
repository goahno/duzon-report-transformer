import {
    parseDuzonReport
} from './duzon-report-parser.js';
import {
    renderCreditDebitReportInputArea
} from './credit-debit-report.js';

document.getElementById('btnReadFile').addEventListener('click', (event) => {
    const file = document.getElementById('srcFile').files[0];
    if (!file) {
        alert('선택된 파일이 없습니다.');
        return;
    }

    const fileEncoding = document.getElementById('fileEncoding').value
    parseDuzonReport(file, fileEncoding, onCompleteParse);
});

function onCompleteParse(data) {
    renderCreditDebitReportInputArea(data);
}