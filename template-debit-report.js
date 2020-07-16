export const templateDebitReport = `
{{#records}}
<div class="a4">
    <div class="debit-report">
        <div class="report-number">증 제           호</div>
        <div class="outer-box">
            <div class="report-title">지 출 결 의 서</div>
            <table class="row-2">
                <tbody>
                    <tr>
                        <td>담당</td>
                        <td>실장</td>
                        <td>지출명령자<br>(학교장)</td>
                        <td rowspan="2">{{fiscalYear}} 회계년도</br>학교회계</td>
                        <td>담당</td>
                        <td>지출원</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div class="row-3">
                <table>
                    <tbody>
                        <tr>
                            <td>계   약<br>(주   문)</td>
                            <td>년   월   일 </td>
                            <td>인 </td>
                        </tr>
                        <tr>
                            <td>지출원인<br>행위동기</td>
                            <td>년   월   일 </td>
                            <td>인 </td>
                        </tr>
                        <tr>
                            <td>납   품<br>(준공.운반)</td>
                            <td>년   월   일 </td>
                            <td>인 </td>
                        </tr>
                        <tr>
                            <td>검   사<br>(검   수)</td>
                            <td>년   월   일 </td>
                            <td>인 </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td>관</td>
                            <td>{{category.category1}}</td>
                        </tr>
                        <tr>
                            <td>항</td>
                            <td>{{category.category2}}</td>
                        </tr>
                        <tr>
                            <td>목</td>
                            <td>{{category.category3}}</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td>청구</td>
                            <td>년    월    일 </td>
                            <td>인 </td>
                        </tr>
                        <tr>
                            <td>지출</td>
                            <td>{{year}}년 {{month}}월 {{dayOfMonth}}일 </td>
                            <td>인 </td>
                        </tr>
                        <tr>
                            <td>지출부<br>등기</td>
                            <td>{{year}}년 {{month}}월 {{dayOfMonth}}일 </td>
                            <td>인 </td>
                        </tr>
                        <tr>
                            <td>물품(계산)<br>대장등기</td>
                            <td>년    월    일 </td>
                            <td>인 </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="description">
                <div>적요</div>
                <div>{{description}}</div>
            </div>
            <div class="row-5">
                <div class="row-5-left">
                    <div>승낙사항<br>본 계약에 있어서는 이면의 사항을 승락합니다.<br>      년     월     일</div>
                    <div>공급자</div>
                    <div>상호<br>사업자번호<br>성명<br>주민등록번호<br>주소<br>계좌번호</div>
                </div>
                <table class="row-5-right">
                    <tbody>
                        <tr>
                            <td>공급가액</td>
                            <td>{{amount}} </td>
                        </tr>
                        <tr>
                            <td>부 가 세</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>합     계</td>
                            <td>{{amount}} </td>
                        </tr>
                        <tr>
                            <td>소 득 세</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>주 민 세</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>기타공제</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>공제합계</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>지 급 액</td>
                            <td>{{amount}} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="row-6">
                <div>(인지) 첨부란이 부족할 경우 뒷쪽에 붙임.</div>
                <div>위 금액을 영수합니다.<br>         년     월     일<br>성명                 (인)</div>
            </div>
            <div class="row-7"></div>
        </div>
    </div>
</div>
{{/records}}
`;