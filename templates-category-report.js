import {
    createElementFromHtmlString,
    mustacheFormattedNumber,
    toNumber,
} from './commons.js';
import {
    templateCategoryReport
} from './template-category-report.js';

const DATE_FORMAT = "YYYY.MM.DD";
const RECORD_PER_PAGE = 35;

const templates = {
    reportInfo: `
        <div>
            회사명: <input type="text" id="inputCompanyLabelAndName" value="유치원명:{{companyName}}">
        </div>
    `.removeWhitespaces(),

    categoryList: `
        <div id="{{groupId}}" class="category-container">
            {{groupName}} 계정과목
            <table>
                <thead>
                    <tr>
                        <th class="column-category-name">계정과목</th>
                        <th class="column-total-amount">예산액</th>
                    </tr>
                </thead>
                <tbody class="category-list-container">
                    {{#categories}}
                    <tr class="category-list-item">
                        <td class="column-category-name">{{title}}</td>
                        <td class="column-total-amount"><input type="text" value="{{#formattedNumber}}{{totalAmount}}{{/formattedNumber}}"></td>
                    </tr>
                    {{/categories}}
                </tbody>
            </table>
        </div>
    `.removeWhitespaces(),

    reportButtons: `
        <div>
            <button value="creditReport">징수부</button>
            <button value="debitReport">지출부</button>
        </div>
    `.removeWhitespaces(),
}

class TemplateRenderer {
    createReportInfo(companyName) {
        const rendered = Mustache.render(templates.reportInfo, {
            companyName: companyName,
        });
        return createElementFromHtmlString(rendered);
    }

    createCategoryList(groupId, groupName, categories) {
        const rendered = Mustache.render(templates.categoryList, {
            groupId: groupId,
            groupName: groupName,
            categories: categories,
            formattedNumber: mustacheFormattedNumber,
        });
        return createElementFromHtmlString(rendered);
    }

    createReportButtons() {
        return createElementFromHtmlString(templates.reportButtons);
    }

    createReport(type, companyLabelAndName, startDate, endDate, categories) {
        const reportCategories = [];

        Object.values(categories).forEach(category => {
            let sum = 0;
            let monthlySum = 0;

            const reportCategory = newReportCategory(category.title);
            reportCategory.records.push({
                isTotalAmountRecord: true,
                totalAmount: category.totalAmount,
            });
            for (let i = 0; i < category.records.length; i++) {
                const record = category.records[i];

                const amount = toNumber(record.amount);
                sum += amount;
                monthlySum += amount;

                reportCategory.records.push({
                    year: record.year,
                    month: record.month,
                    dayOfMonth: record.dayOfMonth,
                    description: record.description,
                    customer: record.customer,
                    amount: record.amount,
                    leftAmount: category.totalAmount - sum,
                });

                const nextRecord = category.records[i + 1];
                if (!nextRecord || record.month !== nextRecord.month) {
                    reportCategory.records.push({
                        isMonthlySumRecord: true,
                        monthlySum: monthlySum,
                    });
                    reportCategory.records.push({
                        isSumRecord: true,
                        sum: sum,
                    });
                    monthlySum = 0;
                }
            }

            pushReportCategory(reportCategories, reportCategory);
        });

        const reportData = {
            companyLabelAndName: companyLabelAndName,
            startDate: startDate.format(DATE_FORMAT),
            endDate: endDate.format(DATE_FORMAT),
            categories: reportCategories,
            formattedNumber: mustacheFormattedNumber,
        }

        if (type === 'debitReport') {
            reportData.reportTitle = '지      출      부';
            reportData.column5Title = '지출액';
            reportData.column6Title = '잔액';
        } else {
            reportData.reportTitle = '징      수      부';
            reportData.column5Title = '수납액';
            reportData.column6Title = '미수납액';
        }

        return Mustache.render(templateCategoryReport, reportData);
    }
}

function pushReportCategory(categories, sourceCategory) {
    const records = sourceCategory.records;
    if (records.length <= RECORD_PER_PAGE) {
        categories.push(sourceCategory);
        return;
    }

    for (let i = 0; i < records.length; i += RECORD_PER_PAGE) {
        const recordPart = records.slice(i, i + RECORD_PER_PAGE);
        const category = newReportCategory(sourceCategory.title);
        category.records = recordPart;
        categories.push(category);
    }
}

function newReportCategory(title) {
    return {
        title: title,
        records: [],
    }
}

const renderer = new TemplateRenderer();
export {
    renderer as
    default
};