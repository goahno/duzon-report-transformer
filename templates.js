import {
    createElementFromHtmlString
} from './commons.js';
import {
    templateDebitReport
} from './template-debit-report.js';
import {
    templateCreditReport
} from './template-credit-report.js';

const templates = {

    coampanyInfoAndFiscalYear: `
        <div>
            회사명: <input type="text" id="inputCompanyName" value="{{companyName}}">
            회계년도: <input type="text" id="inputFiscalYear" maxlength="4" value="{{fiscalYear}}">
        </div>
    `.removeWhitespaces(),

    categoryList: `
        <div id="{{groupId}}" class="category-container">
            {{groupName}} 계정과목
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>계정과목</th>
                        <th>관</th>
                        <th>항</th>
                        <th>목</th>
                    </tr>
                </thead>
                <tbody class="category-list-container">
                    {{#categories}}
                    <tr class="category-list-item">
                        <td><input type="checkbox"></td>
                        <td>{{title}}</td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                    </tr>
                    {{/categories}}
                </tbody>
            </table>
            <datalist id="{{presetId}}">
                {{#presetList}}
                <option value="{{.}}">
                {{/presetList}}
            </datalist>
            <div class="category-input-container">
                <label><input type="radio" name="{{groupId}}InputMode" value="search" checked> 검색</label>
                <input type="text" class="category-search-input" list="{{presetId}}">
                <label><input type="radio" name="{{groupId}}InputMode" value="directInput"> 직접입력</label>
                <div>
                    <label>관: <input type="text" class="category-input" disabled></label>
                    <label>항: <input type="text" class="category-input" disabled></label>
                    <label>목: <input type="text" class="category-input" disabled></label>
                </div>
                <button class='btn-apply'>적용하기</button>
            </div>
        </div>
    `.removeWhitespaces(),

    categoryGroupDivider: '<hr class="category-group-divider">',

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

    createCategoryList(groupId, groupName, categories, presetId, presetList) {
        const rendered = Mustache.render(templates.categoryList, {
            groupId: groupId,
            groupName: groupName,
            categories: categories,
            presetId: presetId,
            presetList: presetList,
        });
        return createElementFromHtmlString(rendered);
    }

    createCategoryGroupDivider() {
        return createElementFromHtmlString(templates.categoryGroupDivider);
    }

    createBtnTransform() {
        return createElementFromHtmlString(templates.btnTransform);
    }

    createOption(text, value, isSelected) {
        const option = document.createElement('option');
        option.text = text;
        option.value = value;
        option.selected = isSelected;
        return option;
    }

    createPageCountSelect(selectedPageCount) {
        const pageCountDiv = document.createElement('div');
        pageCountDiv.innerHTML = '출력 페이지 수: <select id="pageCount"></select>'
        const pageCountSelect = pageCountDiv.querySelector('#pageCount');
        for (let i = 25; i <= 100; i += 25) {
            const option = this.createOption(i, i, i == selectedPageCount);
            pageCountSelect.appendChild(option);
        }
        const allOption = this.createOption('전체', -1, false);
        pageCountSelect.appendChild(allOption);
        return pageCountDiv;
    }

    createPageButtons(pageCount, title, size) {
        if (!Number.isInteger(pageCount)) {
            pageCount = parseInt(pageCount);
        }

        if (pageCount < 0) {
            pageCount = size;
        }

        const div = document.createElement('div');
        div.innerHTML = `${title} : `;
        for (let i = 0; i < size; i += pageCount) {
            const button = document.createElement('button');
            button.value = i;
            button.innerHTML = `${i + 1} ~ ${Math.min(i + pageCount, size)}`;
            div.appendChild(button);
        }
        return div;
    }

    createDebitReport(companyName, fiscalYear, records) {
        return Mustache.render(templateDebitReport, {
            companyName: companyName,
            fiscalYear: fiscalYear,
            records: records,
        });
    }

    createCreditReport(companyName, fiscalYear, records) {
        return Mustache.render(templateCreditReport, {
            companyName: companyName,
            fiscalYear: fiscalYear,
            records: records,
        });
    }
}

const renderer = new TemplateRenderer();
export {
    templates,
    renderer as
    default
};