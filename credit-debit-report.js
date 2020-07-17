import renderer from './templates.js';
import {
    debitPresetList,
    creditPresetList
} from './category-preset.js';

const ID_DEBIT_CATEGORIES = 'debitCategories';
const ID_DEBIT_CATEGORY_PRESET = 'debitCategoryPreset'
const ID_CREDIT_CATEGORIES = 'creditCategories';
const ID_CREDIT_CATEGORY_PRESET = 'creditCategoryPreset'

const DEFAULT_PAGE_COUNT = 50;

let data;

export function renderCreditDebitReportInputArea(parsedData) {
    data = parsedData;
    data.debitRecords.sort((a, b) => a.date - b.date);
    data.creditRecords.sort((a, b) => a.date - b.date);
    renderInputArea();
}

function renderInputArea() {
    const inputArea = document.getElementById('inputArea');
    inputArea.innerHTML = '';

    inputArea.appendChild(renderer.createCategoryGroupDivider());
    inputArea.appendChild(renderer.createCompnayInfoAndFiscalYearInputs(data.companyName, data.fiscalYear));
    inputArea.appendChild(renderer.createCategoryGroupDivider());

    appendCategoryList(inputArea, ID_DEBIT_CATEGORIES, '지출(차변)',
        Object.values(data.debitCategories), ID_DEBIT_CATEGORY_PRESET, debitPresetList);
    inputArea.appendChild(renderer.createCategoryGroupDivider());

    appendCategoryList(inputArea, ID_CREDIT_CATEGORIES, '수입(대변)',
        Object.values(data.creditCategories), ID_CREDIT_CATEGORY_PRESET, creditPresetList);
    inputArea.appendChild(renderer.createCategoryGroupDivider());

    inputArea.appendChild(renderer.createBtnTransform());
    inputArea.querySelector('#btnTransform').addEventListener('click', (event) => transform());
}

function appendCategoryList(parentElement, groupId, groupName, categories, presetId, presetList) {
    const categoryList = renderer.createCategoryList(groupId, groupName, categories, presetId, presetList);
    parentElement.appendChild(categoryList);
    parentElement.querySelectorAll(`#${groupId} input[type="radio"]`).forEach(elem => {
        elem.addEventListener('change', event => onChangeCategoryInputMode(groupId, event));
    })
    parentElement.querySelector(`#${groupId} .btn-apply`).addEventListener('click', (event) => onClickBtnApply(groupId));
}

function onChangeCategoryInputMode(groupId, event) {
    const directInputs = document.querySelectorAll(`#${groupId} .category-input`);
    const searchInput = document.querySelector(`#${groupId} .category-search-input`)

    switch (event.target.value) {
        case 'directInput':
            directInputs.forEach(elem => elem.disabled = false);
            searchInput.disabled = true;
            break;

        case 'search':
            directInputs.forEach(elem => elem.disabled = true);
            searchInput.disabled = false;
            break;
    }
}

function onClickBtnApply(groupId) {
    const isDirectInput = document.querySelector(`#${groupId} input[type="radio"][value="directInput"]`).checked;
    let inputValues = [];
    if (isDirectInput) {
        inputValues = getCategoryDirectInputValues(groupId);
    } else {
        inputValues = getCategorySearchValues(groupId);
    }
    setCategories(groupId, inputValues);
}

function getCategoryDirectInputValues(groupId) {
    const result = [];
    document.querySelectorAll(`#${groupId} .category-input`).forEach(elem => {
        result.push(elem.value);
        elem.value = '';
    });
    return result;
}

function getCategorySearchValues(groupId) {
    const searchInput = document.querySelector(`#${groupId} .category-search-input`)
    const inputValue = searchInput.value;
    if (!inputValue) {
        return [];
    }

    const result = inputValue.split('|');
    searchInput.value = '';
    return result;
}

function setCategories(groupId, inputValues) {
    const checked = document.querySelectorAll(`#${groupId} .category-list-item input[type="checkbox"]:checked`);
    checked.forEach(elem => {
        const textInputs = elem.closest('.category-list-item').querySelectorAll('input[type="text"]');
        for (let i = 0; i < textInputs.length; i++) {
            textInputs[i].value = inputValues[i] || '';
        }
        elem.checked = false;
    });
}

function transform() {
    data.companyName = document.getElementById('inputCompanyName').value;
    data.fiscalYear = document.getElementById('inputFiscalYear').value;
    setCategoryValues(ID_DEBIT_CATEGORIES, data.debitCategories);
    setCategoryValues(ID_CREDIT_CATEGORIES, data.creditCategories);

    const printPageCountArea = document.getElementById('printPageCountArea');
    printPageCountArea.innerHTML = "";
    printPageCountArea.appendChild(renderer.createPageCountSelect(DEFAULT_PAGE_COUNT));
    const pageCountSelect = printPageCountArea.querySelector('#pageCount')
    pageCountSelect.addEventListener('change', event => {
        renderPageButtons(event.target.value);
    });

    renderPageButtons(pageCountSelect.value);

    setCurrentPages('');
}

function setCategoryValues(elementId, categories) {
    document.querySelectorAll(`#${elementId} .category-list-container tr`).forEach(elem => {
        const key = elem.querySelector('td:nth-child(2)').innerHTML;
        const values = [];
        elem.querySelectorAll('input[type=text]').forEach(input => {
            values.push(input.value);
        });
        const category = getCategory(categories, key);
        category.category1 = values[0];
        category.category2 = values[1];
        category.category3 = values[2];
    });
}

function getCategory(categories, key) {
    let category = categories[key];
    if (!category) {
        category = {
            title: key
        };
        categories[key] = category;
    }
    return category;
}

function renderPageButtons(pageCount) {
    if (!pageCount) {
        pageCount = DEFAULT_PAGE_COUNT;
    }

    document.getElementById('printArea').innerHTML = "";

    const printPageButtonsArea = document.getElementById('printPageButtonsArea');
    printPageButtonsArea.innerHTML = "";

    const debitButtonsDiv = renderer.createPageButtons(pageCount, "지출(차변)", data.debitRecords.length);
    printPageButtonsArea.appendChild(debitButtonsDiv);
    debitButtonsDiv.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', event => showReports('debit', data.debitRecords, button.value, pageCount));
    });

    const creditButtonsDiv = renderer.createPageButtons(pageCount, "수입(대변)", data.creditRecords.length);
    printPageButtonsArea.appendChild(creditButtonsDiv);
    creditButtonsDiv.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', event => showReports('credit', data.creditRecords, button.value, pageCount));
    });
}

function showReports(reportType, records, startIndex, pageCount) {
    if (!Number.isInteger(startIndex)) {
        startIndex = parseInt(startIndex);
    }

    if (!Number.isInteger(pageCount)) {
        pageCount = parseInt(pageCount);
    }

    let end = startIndex + pageCount;
    if (pageCount <= 0) {
        end = records.length;
    }

    const subRecords = records.slice(startIndex, end);

    const printArea = document.getElementById('printArea');
    let html = "";
    switch (reportType) {
        case 'debit':
            html = renderer.createDebitReport(data.companyName, data.fiscalYear, subRecords);
            break;

        case 'credit':
            html = renderer.createCreditReport(data.companyName, data.fiscalYear, subRecords);
            break;
    }
    printArea.innerHTML = html;

    setCurrentPages(`현재 표시 중 : ${startIndex + 1} ~ ${startIndex + subRecords.length}`);
}

function setCurrentPages(str) {
    document.getElementById('currentPages').innerHTML = str;
}