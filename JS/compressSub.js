//圧縮イベント発生
document.getElementById('input').addEventListener('change', () => {
    const beforeCompressString = document.getElementById('input').value;
    const beforeCompressArr = beforeCompressString.split('\n');
    let compressResult = compress(beforeCompressArr);
    console.log(typeof(compressResult));
    document.getElementById('output').value = compressResult.map(value => {
        return value;
    });
});

//圧縮するための関数を呼び出す。再帰関数
function compress(compressBeforeArr) {
    console.log("再帰" + compressBeforeArr);
    // let comparsionResults = [];
    let compressResults = [];
    let returnCompressResults = [];
    if (compressBeforeArr.length > 1) {
        comparsionResults = comparisonInArr(compressBeforeArr[0], compressBeforeArr);
        if (comparsionResults.length > 1) {
            const diffCountCheck = comparsionResults.filter((value, index, diffArr) => {
                return (value.diffCount === 1) && (diffArr[1].diffPosition === value.diffPosition)
            });
            compressResults += compressStrings(diffCountCheck, compressBeforeArr[0]);
            compressBeforeArr.push(compressResults);
            compressBeforeArr.shift();
            recursiveArrCreate = diffInArr(diffCountCheck, compressBeforeArr);
            console.log("圧縮しました!" + recursiveArrCreate);
            return compress(recursiveArrCreate);
        } else if (compressResults.length === 0) {
            returnCompressResults = compressBeforeArr;
            console.log(compressResults);
        } else {
            console.log(compressResults);
            returnCompressResults = compressBeforeArr;
            compressBeforeArr += comparisonResults.map(item => {
                return item.diffstring;
            });
        }
        console.log("抜けます!" + compressBeforeArr);
    }
    return compressBeforeArr;
}


//同じ長さかどうか比較後、配列の先頭と配列内を比較する。
function comparisonInArr(targetForComparison, comparisonArr) {
    const sameLengthStrings = comparisonArr.filter(value => {
        return value.length === targetForComparison.length;
    });

    let comparisonResult = [];
    for (let i = 0; i < sameLengthStrings.length; i++) {
        comparisonResult.push(comparisonStrings(targetForComparison, sameLengthStrings[i]));
    }

    let undefinedCheck = comparisonResult.filter(check => {
        return check.diffPosition !== undefined
    });

    return undefinedCheck;
}

//配列の先頭と配列内の文字列を1つずつ比較していく。
function comparisonStrings(targetString, comparisonString) {

    let diffPosition, diffMoji = "";
    let diffCount = 0;

    for (let i = 0; i < targetString.length; i++) {
        if (targetString[i] !== comparisonString[i]) {
            diffMoji += comparisonString[i];
            diffPosition = i;
            diffCount++;
        }
    }

    return { "diffMoji": diffMoji, "diffPosition": diffPosition, "diffCount": diffCount, "diffString": comparisonString };
}


//圧縮する文字を生成する。
function compressStrings(diffCountCheck, compressString) {
    const compressSlice1Moji = compressString.slice(diffCountCheck[0].diffPosition, diffCountCheck[0].diffPosition + 1)
    const frontStirng = compressString.slice(0, diffCountCheck[0].diffPosition);
    const backString = compressString.slice(diffCountCheck[0].diffPosition + 1);
    const compressMoji = diffCountCheck.map((obj) =>
        obj.diffMoji).join("");
    console.log(frontStirng + "[" + compressSlice1Moji + compressMoji + "]" + backString);
    return frontStirng + "[" + compressSlice1Moji + compressMoji + "]" + backString;
}


function diffInArr(compressObj, diffArr) {
    const fromObjToArr = compressObj.map((item) => {
        return item.diffString;
    });

    const recursiveArr = diffArr.filter(value => fromObjToArr.indexOf(value) === -1);

    return recursiveArr;
}