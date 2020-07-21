import rendererCommon from './templates-common.js';
import rendererCategoryReport from './templates-category-report.js';
import {
    toInt
} from './commons.js';

const ID_DEBIT_CATEGORIES = 'debitCategories';
const ID_CREDIT_CATEGORIES = 'creditCategories';

let data;

export function renderCategoryReportInputArea(parsedData) {
    data = parsedData;
    groupByCategory(data.debitRecords);
    groupByCategory(data.creditRecords);
    renderInputArea();
}

function groupByCategory(records) {
    records.forEach(record => {
        const category = record.category;

        const totalAmount = category.totalAmount || 0;
        category.totalAmount = totalAmount + toInt(record.amount);

        if (!category.records) {
            category.records = [];
        }
        category.records.push(record);
    });
}

function renderInputArea() {
    const inputArea = document.getElementById('inputArea');
    inputArea.innerHTML = '';

    inputArea.appendChild(rendererCommon.createDivider());
    inputArea.appendChild(
        rendererCategoryReport.createReportInfo(data.companyName));
    inputArea.appendChild(rendererCommon.createDivider());

    appendCategoryList(inputArea, ID_DEBIT_CATEGORIES, '지출(차변)',
        Object.values(data.debitCategories));

    appendCategoryList(inputArea, ID_CREDIT_CATEGORIES, '수입(대변)',
        Object.values(data.creditCategories));

    inputArea.appendChild(rendererCommon.createBtnTransform());
    inputArea.querySelector('#btnTransform').addEventListener('click',
        event => transform());
}

function appendCategoryList(parentElement, groupId, groupName, categories) {
    const categoryList = rendererCategoryReport.createCategoryList(groupId,
        groupName, categories);
    parentElement.appendChild(categoryList);

    parentElement.appendChild(rendererCommon.createDivider());
}

function transform() {
    const companyLabelAndName =
        document.getElementById('inputCompanyLabelAndName').value;
    createReportData(ID_DEBIT_CATEGORIES, data.debitCategories);
    createReportData(ID_CREDIT_CATEGORIES, data.creditCategories);

    document.getElementById('printArea').innerHTML = '';

    const printPageButtonsArea = document.getElementById('printPageButtonsArea');
    printPageButtonsArea.innerHTML = '';
    printPageButtonsArea.appendChild(rendererCategoryReport.createReportButtons());
    document.querySelectorAll('#printPageButtonsArea button').forEach(
        button => {
            button.addEventListener('click', event =>
                showReports(companyLabelAndName, button.value));
        });
}

function createReportData(groupId, categories) {
    document.querySelectorAll(`#${groupId} .category-list-container tr`)
        .forEach(elem => {
            const key = elem.querySelector('.column-category-name').innerHTML;
            const amount = elem.querySelector('input[type="text"]').value;
            categories[key].totalAmount = toInt(amount);
        });
}

function showReports(companyLabelAndName, type) {
    const printArea = document.getElementById('printArea');
    let categories;
    switch (type) {
        case 'debitReport':
            categories = data.debitCategories;
            break;

        case 'creditReport':
            categories = data.creditCategories;
            break;
    }
    printArea.innerHTML = rendererCategoryReport.createReport(
        type, companyLabelAndName, data.startDate, data.endDate,
        categories);
}