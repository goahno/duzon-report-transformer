import {
    numberToHangul
} from './number-to-hangul.js';
import {
    toPadString
} from './commons.js';

const DURATION_DATE_FORMAT = 'YYYY.MM.DD';
const RECORD_DATE_FORMAT = 'MM월 DD일';
const RECORD_DATE_FORMAT2 = 'MM-DD';

let startDate;
let endDate;
let baseMonth = 0;
let companyName;
let fiscalYear;
let currentCategory = '';
let debitCategories = {}; // 지출(차변) 과목
let creditCategories = {}; // 수입(대변) 과목
let debitRecords = []; // 지출(차변) 내역
let creditRecords = []; // 수입(대변) 내역

let onCompleteListener;

export function parseDuzonReport(file, fileEncoding, onComplete) {
    clearData();
    onCompleteListener = onComplete;

    Papa.parse(file, {
        encoding: fileEncoding,
        skipEmptyLines: 'greedy',
        complete: onCompleteReadFile,
    });
}

function clearData() {
    startDate = null;
    endDate = null;
    baseMonth = 0;
    companyName = '';
    fiscalYear = 0;
    currentCategory = '';
    debitCategories = {};
    creditCategories = {};
    debitRecords = [];
    creditRecords = [];
}

function onCompleteReadFile(csv) {
    csv.data.forEach(element => parseLine(element));
    onCompleteListener(
        {
            companyName: companyName,
            fiscalYear: fiscalYear,
            startDate: startDate,
            endDate: endDate,
            debitCategories: debitCategories,
            creditCategories: creditCategories,
            debitRecords: debitRecords,
            creditRecords: creditRecords,
        }
    )
}

function parseLine(line) {
    if (!line[0]) {
        if (line[3].includes(' ~ ')) {
            setDuration(line[3]);
            return;
        }
    }

    if (line[6].startsWith('계정과목')) {
        setCompanyName(line[0]);
        setCurrentCategory(line[6]);
        return;
    }

    if (line[0] && (line[0] !== '날짜')) {
        addRecord(line);
        return;
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
    let dateFormat = RECORD_DATE_FORMAT;
    if (dateString.includes('-')) {
        dateFormat = RECORD_DATE_FORMAT2;
    }

    const date = moment(dateString, dateFormat);
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