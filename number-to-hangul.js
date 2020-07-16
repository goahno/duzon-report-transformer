const HANGUL_NUMBER = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const HANGUL_NUMBER_SUB_UNIT = ["", "십", "백", "천"];
const HANGUL_NUMBER_UNIT = ["", "만", "억", "조", "경", "해", "자", "양", "구", "간", "정", "재", "극"]

export function numberToHangul(number) {
    if (!['number', 'bigint', 'string'].includes(typeof number)) {
        throw Error('not supported type');
    }

    if (typeof number !== 'string') {
        number = number.toString();
    }

    let result = '';

    const arr = number.split('.');
    result += createIntegerPart(arr[0]);
    if (arr.length > 1) {
        const decimalPart = createDecimalPart(arr[1]);
        if (decimalPart) {
            result += '.' + decimalPart;
        }
    }

    return result;
}

function createIntegerPart(src) {
    let result = '';

    if (src[0] === '-') {
        result += '-';
        src = src.substring(1);
    }

    src = removeNaN(src);

    if (!src) {
        return '영';
    }

    if (src.length === 1 && src[0] === '0') {
        return '영';
    }

    const length = src.length;
    let isAppendUnit = false;
    let unitIndex = Math.max(parseInt((length - 1) / 4), 0);
    let subUnitIndex = (length - 1) % 4;
    for (let i = 0; i < length; i++) {
        const n = parseInt(src[i]);
        if (n > 0) {
            result += HANGUL_NUMBER[n];
            result += HANGUL_NUMBER_SUB_UNIT[subUnitIndex];
            isAppendUnit = true
        }

        subUnitIndex--;
        if (subUnitIndex < 0) {
            subUnitIndex = 3;
            if (isAppendUnit) {
                result += HANGUL_NUMBER_UNIT[unitIndex];
                isAppendUnit = false;
            }
            unitIndex--;
        }
    }

    return result;
}

function createDecimalPart(src) {
    src = removeNaN(src);
    if (!src) {
        return '';
    }

    let result = '';
    for (let i = 0; i < src.length; i++) {
        const n = parseInt(src[i]);
        result += HANGUL_NUMBER[n];
    }
    return result;
}

function removeNaN(src) {
    return src.replace(/[^0-9]/g, '');
}

function assertEquals(a, b) {
    if (a != b) {
        throw Error("not equals: a: " + a + ", b: " + b);
    }
}

export function testNumberToHangul() {
    assertEquals(numberToHangul(0), "영");
    assertEquals(numberToHangul(-0), "영");
    assertEquals(numberToHangul("0"), "영");
    assertEquals(numberToHangul("-0"), "영");
    assertEquals(numberToHangul(""), "영");
    assertEquals(numberToHangul(1), "일");
    assertEquals(numberToHangul("1"), "일");
    assertEquals(numberToHangul(-1), "-일");
    assertEquals(numberToHangul("-1"), "-일");
    assertEquals(numberToHangul(1234), "일천이백삼십사");
    assertEquals(numberToHangul("1234"), "일천이백삼십사");
    assertEquals(numberToHangul("1,234"), "일천이백삼십사");
    assertEquals(numberToHangul("1_234"), "일천이백삼십사");
    assertEquals(numberToHangul(1000), "일천");
    assertEquals(numberToHangul("1000"), "일천");
    assertEquals(numberToHangul(12345678), "일천이백삼십사만오천육백칠십팔");
    assertEquals(numberToHangul("12345678"), "일천이백삼십사만오천육백칠십팔");
    assertEquals(numberToHangul("12,345,678"), "일천이백삼십사만오천육백칠십팔");
    assertEquals(numberToHangul("1_234_5678"), "일천이백삼십사만오천육백칠십팔");
    assertEquals(numberToHangul(12_345_678.123), "일천이백삼십사만오천육백칠십팔.일이삼");
    assertEquals(numberToHangul("12_345_678.123"), "일천이백삼십사만오천육백칠십팔.일이삼");
    assertEquals(numberToHangul(-12_345_678.123), "-일천이백삼십사만오천육백칠십팔.일이삼");
    assertEquals(numberToHangul("-12_345_678.123"), "-일천이백삼십사만오천육백칠십팔.일이삼");
    assertEquals(numberToHangul("-12_345_678.123_456"), "-일천이백삼십사만오천육백칠십팔.일이삼사오육");
    assertEquals(numberToHangul("-12_345_678.10002"), "-일천이백삼십사만오천육백칠십팔.일영영영이");
    assertEquals(numberToHangul("-12_345_678."), "-일천이백삼십사만오천육백칠십팔");
    assertEquals(numberToHangul(10000000), "일천만");
    assertEquals(numberToHangul("10000000"), "일천만");
    assertEquals(numberToHangul(10001001), "일천만일천일");
    assertEquals(numberToHangul("10001001"), "일천만일천일");
    assertEquals(numberToHangul("108,000"), "일십만팔천");
    assertEquals(numberToHangul("1000_1000_0000_1000"), "일천조일천억일천");
    // Number.MAX_SAFE_INTEGER
    assertEquals(numberToHangul(9007_1992_5474_0991), "구천칠조일천구백구십이억오천사백칠십사만구백구십일");
    assertEquals(numberToHangul("9007199254740991"), "구천칠조일천구백구십이억오천사백칠십사만구백구십일");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000"), "일천이백삼십사경");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000_0000"), "일천이백삼십사해");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000_0000_0000"), "일천이백삼십사자");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000_0000_0000_0000"), "일천이백삼십사양");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000_0000_0000_0000_0000"), "일천이백삼십사구");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000_0000_0000_0000_0000_0000"), "일천이백삼십사간");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000"), "일천이백삼십사정");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000"), "일천이백삼십사재");
    assertEquals(numberToHangul("1234_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000"), "일천이백삼십사극");
}