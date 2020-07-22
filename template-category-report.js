export const templateCategoryReport = `
{{#categories}}
<div class="a4">
    <div class="category-report">
        <div class="report-title ws-pre">{{reportTitle}}</div>
        <div class="report-duration">{{startDate}} ~ {{endDate}}</div>
        <div class="report-company-name-and-category-name">
            <span>{{companyLabelAndName}}</span>
            <span>{{title}}</span>
        </div>
        <table>
            <thead>
                <th>날짜</th>
                <th class="ws-pre">적    요    란</th>
                <th>거래처</th>
                <th>예산액</th>
                <th>{{column5Title}}</th>
                <th>{{column6Title}}</th>
            </thead>
            <tbody>
                {{#records}}
                    {{#isTotalAmountRecord}}
                        <tr>
                            <td></td>
                            <td class="ta-c">예산액</td>
                            <td></td>
                            <td>{{#formattedNumber}}{{totalAmount}}{{/formattedNumber}}</td>
                            <td></td>
                            <td>{{#formattedNumber}}{{totalAmount}}{{/formattedNumber}}</td>
                        </tr>
                    {{/isTotalAmountRecord}}
                    {{^isTotalAmountRecord}}
                        {{^isMonthlySumRecord}}
                            <tr>
                                <td>{{month}}-{{dayOfMonth}}</td>
                                <td><div class="description">{{description}}</div></td>
                                <td><div class="customer">{{customer}}</div></td>
                                <td></td>
                                <td>{{#formattedNumber}}{{amount}}{{/formattedNumber}}</td>
                                <td>{{#formattedNumber}}{{leftAmount}}{{/formattedNumber}}</td>
                            </tr>
                        {{/isMonthlySumRecord}}
                    {{/isTotalAmountRecord}}
                    {{#isMonthlySumRecord}}
                        <tr class="monthly-sum-record border-top-normal">
                            <td></td>
                            <td class="ws-pre indent-5">[ 월         계 ]</td>
                            <td></td>
                            <td></td>
                            <td>{{#formattedNumber}}{{monthlySum}}{{/formattedNumber}}</td>
                            <td></td>
                        </tr>
                        <tr class="monthly-sum-record border-bottom-normal">
                            <td></td>
                            <td class="ws-pre indent-5">[ 누         계 ]</td>
                            <td></td>
                            <td></td>
                            <td>{{#formattedNumber}}{{sum}}{{/formattedNumber}}</td>
                            <td></td>
                        </tr>
                    {{/isMonthlySumRecord}}
                {{/records}}
            </tbody>
        </table>
    </div>
</div>
{{/categories}}
`;