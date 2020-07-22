export const templateCreditReport = `
{{#records}}
<div class="a4">
    <div class="credit-report">
        <div class="report-title">징수(수입)결의서</div>
        <div class="report-year-and-number">
            <span>{{fiscalYear}} 회계년도</span>
            <span>증 제             호 </span>
        </div>
        <div class="outer-box">
            <table class="top-table">
                <tbody>
                    <tr>
                        <td rowspan="2">세입징수자<br>(학교장)</td>
                        <td rowspan="2" class="column2">인  </td>
                        <td>발의일자</td>
                        <td>{{year}}년 {{month}}월 {{dayOfMonth}}일 </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>고지서발행</td>
                        <td>년    월    일 </td>
                        <td>인 </td>
                    </tr>
                    <tr>
                        <td rowspan="2">수   입   원</td>
                        <td rowspan="2" class="column2">인  </td>
                        <td>납입기한</td>
                        <td>년    월    일 </td>
                        <td>인 </td>
                    </tr>
                    <tr>
                        <td>징수부등기</td>
                        <td>{{year}}년 {{month}}월 {{dayOfMonth}}일 </td>
                        <td>인 </td>
                    </tr>
                    <tr>
                        <td rowspan="2">담         당</td>
                        <td rowspan="2" class="column2">인  </td>
                        <td>고지서번호</td>
                        <td>년    월    일 </td>
                        <td>인 </td>
                    </tr>
                    <tr>
                        <td>{{category.category1}}</td>
                        <td>{{category.category2}}</td>
                        <td>{{category.category3}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="amount-box">
                <div>금 {{amountHangul}}원 정  </div>
                <div>{{#formattedNumber}}{{amount}}{{/formattedNumber}}  </div>
            </div>
            <div class="payer-name-box">
                <div>납부자 주소 성명(상호)</div>
                <div></div>
            </div>
            <div class="description-box">
                <div>적요<br>산출근거</div>
                <div>{{description}}</div>
            </div>
        </div>
    </div>
</div>
{{/records}}
`;