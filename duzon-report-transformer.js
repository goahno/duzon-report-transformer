import renderer from './templates.js';
import {
    numberToHangul
} from './number-to-hangul.js';
import {
    toPadString
} from './commons.js';
import {
    debitPresetList,
    creditPresetList
} from './category-preset.js';

const DURATION_DATE_FORMAT = 'YYYY.MM.DD';
const RECORD_DATE_FORMAT = 'MM월 DD일';

const ID_DEBIT_CATEGORIES = 'debitCategories';
const ID_DEBIT_CATEGORY_PRESET = 'debitCategoryPreset'
const ID_CREDIT_CATEGORIES = 'creditCategories';
const ID_CREDIT_CATEGORY_PRESET = 'creditCategoryPreset'

const DEFAULT_PAGE_COUNT = 50;

let startDate;
let endDate;
let baseMonth = 0;
let companyName;
let fiscalYear;
let currentCategory = '';
const debitCategories = {}; // 지출(차변) 과목
const creditCategories = {}; // 수입(대변) 과목
const debitRecords = []; // 지출(차변) 내역
const creditRecords = []; // 수입(대변) 내역

document.getElementById('btnReadFile').addEventListener('click', (event) => {
    const file = document.getElementById('srcFile').files[0];
    if (!file) {
        alert('선택된 파일이 없습니다.');
        return;
    }

    const fileEncoding = document.getElementById('fileEncoding').value

    Papa.parse(file, {
        encoding: fileEncoding,
        skipEmptyLines: 'greedy',
        complete: onCompleteReadFile,
    });
});

function onCompleteReadFile(csv) {
    csv.data.forEach(element => parseLine(element));
    debitRecords.sort((a, b) => a.date - b.date);
    creditRecords.sort((a, b) => a.date - b.date);
    renderInputArea();
}

function parseLine(line) {
    if (!line[0]) {
        if (line[3].includes(' ~ ')) {
            setDuration(line[3]);
            return;
        }
    }

    if (line[0].startsWith('회사명:')) {
        setCompanyName(line[0]);
        setCurrentCategory(line[6]);
        return;
    }

    if (line[0] && (line[0] !== '날짜')) {
        addRecord(line);
    }
}

function setDuration(str) {
    if (startDate && endDate) {
        return;
    }
    const arr = str.split(' ~ ');
    startDate = moment(arr[0], DURATION_DATE_FORMAT);
    endDate = moment(arr[1], DURATION_DATE_FORMAT);
    if (startDate.month() > endDate.month()) {
        baseMonth = startDate.month();
    }
    fiscalYear = startDate.year();
}

function setCompanyName(str) {
    if (companyName) {
        return;
    }
    companyName = str.split(':')[1].trim();
}

function setCurrentCategory(str) {
    currentCategory = str.split(':')[1].trim();
}

function createRecordDate(dateString) {
    const date = moment(dateString, RECORD_DATE_FORMAT);
    if (date.month() < baseMonth) {
        date.year(endDate.year());
    } else {
        date.year(startDate.year());
    }
    return date;
}

function addRecord(line) {
    const record = {};
    record.date = createRecordDate(line[0]);
    record.year = record.date.year();
    record.month = toPadString(record.date.month() + 1, 2, '0');
    record.dayOfMonth = toPadString(record.date.date(), 2, '0');
    record.description = line[1]; // 적요
    record.customer = line[3]; // 거래처

    // 금액
    if (line[4]) {
        record.amount = line[4];
        record.category = getCategory(debitCategories, currentCategory);
        debitRecords.push(record);
    } else if (line[5]) {
        record.amount = line[5];
        record.category = getCategory(creditCategories, currentCategory);
        creditRecords.push(record);
    }

    record.amountHangul = numberToHangul(record.amount);
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

function renderInputArea() {
    const inputArea = document.getElementById('inputArea');
    inputArea.innerHTML = '';

    inputArea.appendChild(renderer.createCategoryGroupDivider());
    inputArea.appendChild(renderer.createCompnayInfoAndFiscalYearInputs(companyName, startDate.year()));
    inputArea.appendChild(renderer.createCategoryGroupDivider());

    appendCategoryList(inputArea, ID_DEBIT_CATEGORIES, '지출(차변)',
        Object.values(debitCategories), ID_DEBIT_CATEGORY_PRESET, debitPresetList);
    inputArea.appendChild(renderer.createCategoryGroupDivider());

    appendCategoryList(inputArea, ID_CREDIT_CATEGORIES, '수입(대변)',
        Object.values(creditCategories), ID_CREDIT_CATEGORY_PRESET, creditPresetList);
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
    companyName = document.getElementById('inputCompanyName').value;
    fiscalYear = document.getElementById('inputFiscalYear').value;
    setCategoryValues(ID_DEBIT_CATEGORIES, debitCategories);
    setCategoryValues(ID_CREDIT_CATEGORIES, creditCategories);

    const printPageCountArea = document.getElementById('printPageCountArea');
    printPageCountArea.innerHTML = "";
    printPageCountArea.appendChild(renderer.createPageCountSelect(DEFAULT_PAGE_COUNT));
    const pageCountSelect = printPageCountArea.querySelector('#pageCount')
    pageCountSelect.addEventListener('change', event => {
        renderPageButtons(event.target.value);
    });

    renderPageButtons(pageCountSelect.value);
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

function renderPageButtons(pageCount) {
    if (!pageCount) {
        pageCount = DEFAULT_PAGE_COUNT;
    }

    document.getElementById('printArea').innerHTML = "";

    const printPageButtonsArea = document.getElementById('printPageButtonsArea');
    printPageButtonsArea.innerHTML = "";

    const debitButtonsDiv = renderer.createPageButtons(pageCount, "지출(차변)", debitRecords.length);
    printPageButtonsArea.appendChild(debitButtonsDiv);
    debitButtonsDiv.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', event => showReports('debit', debitRecords, button.value, pageCount));
    });

    const creditButtonsDiv = renderer.createPageButtons(pageCount, "수입(대변)", creditRecords.length);
    printPageButtonsArea.appendChild(creditButtonsDiv);
    creditButtonsDiv.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', event => showReports('credit', creditRecords, button.value, pageCount));
    });
}

function showReports(reportType, records, startIndex, pageCount) {
    if (!Number.isInteger(startIndex)) {
        startIndex = parseInt(startIndex);
    }

    if (!Number.isInteger(pageCount)) {
        pageCount = parseInt(pageCount);
    }
    const end = startIndex + pageCount;

    const subRecords = records.slice(startIndex, end);

    const printArea = document.getElementById('printArea');
    let html = "";
    switch (reportType) {
        case 'debit':
            html = renderer.createDebitReport(companyName, fiscalYear, subRecords);
            break;

        case 'credit':
            html = renderer.createCreditReport(companyName, fiscalYear, subRecords);
            break;
    }
    printArea.innerHTML = html;

    document.getElementById('currentPages').innerHTML = `현재 표시 중 : ${startIndex + 1} ~ ${startIndex + subRecords.length}`;
}