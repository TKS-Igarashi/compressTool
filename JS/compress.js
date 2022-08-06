document.getElementById('input').addEventListener('change', () => {
    const beforeCompressString = document.getElementById('input').value; //入力されたテキスト
    const beforeCompressArr = beforeCompressString.split('\n'); //入力されたテキストを改行で区切って配列に変換
    const compressStirngs = compress([...new Set(beforeCompressArr.filter(Boolean))]);
    document.getElementById('output').value = compressStirngs.join('\n');
});

function compress(targetCompressArr) {
    console.log(targetCompressArr);
    const arrOfSameLength = sameLengthOfCreateArr(targetCompressArr[0], targetCompressArr); // 同じ文字列の配列を作成
    const afterComparisonObj = oneToManyComparison(targetCompressArr[0], arrOfSameLength); // 比較したオブジェクトを生成
    const formattedObj = formatInsideTheObject(afterComparisonObj); //afterComparsionObj内のかぶったものを削除したオブジェクトを生成
    if (formattedObj.length) {
        const sameDiffPositon = arrWithmatchPosition(formattedObj); // 同じ位置のオブジェクトを生成
        if (!sameDiffPositon.length) {
            const leadString = targetCompressArr.shift();
            targetCompressArr.push(leadString);
            return compress(targetCompressArr);
        } else {
            targetCompressArr.push(createCompressString(targetCompressArr[0], sameDiffPositon));
            const sameDiffPositonArr = sameDiffPositon.map(item => {
                return item.diffString;
            });
            sameDiffPositonArr.push(targetCompressArr[0]); //配列の先頭を代入
            const DiffArr = targetCompressArr.filter(value => {
                return sameDiffPositonArr.indexOf(value) === -1;
            });
            if (DiffArr.length) {
                return compress(DiffArr);
            }
        }
    }

    return targetCompressArr.sort();
}

//同じ長さの文字列の配列を作成する
function sameLengthOfCreateArr(firstLineComparaString, beforeCompressArr) { //配列の0番目と配列を引数
    const sameLengthStringsArr = beforeCompressArr.filter((value) => {
        return value.length === firstLineComparaString.length;
    });
    return sameLengthStringsArr;
}

//1対配列で比較しオブジェクトを戻り値にする
function oneToManyComparison(targetForComparisonString, targetForComparisonArr) {
    let comparisonResults = [];
    for (let i in targetForComparisonArr) {
        comparisonResults.push(comparisonStrings(targetForComparisonString, targetForComparisonArr[i]));
    }

    return comparisonResults;
}

//1対1で比較し異なる文字,位置,文字が異なった回数,比較した文字列をもつオブジェクトを生成し戻り値として返す
function comparisonStrings(compareString, pairedComparisonString) {

    let diffPosition, diffMoji = "";
    let diffCount = 0;

    for (let i = 0; i < compareString.length; i++) {
        if (compareString[i] !== pairedComparisonString[i]) {
            diffMoji += pairedComparisonString[i];
            diffPosition = i;
            diffCount++;
        }
    }

    return { "diffMoji": diffMoji, "diffPosition": diffPosition, "diffCount": diffCount, "diffString": pairedComparisonString };
}

//同じ文字の結果を削除し,新しく生成したオブジェクトを返す
function formatInsideTheObject(afterComparisonObj) {
    const convertObj = afterComparisonObj.filter(convertValue => {
        if (convertValue.diffPosition !== undefined) {
            return convertValue.diffString;
        } else {
            return delete convertValue;
        }
    });
    return convertObj;
}

//異なった回数が1で先頭のdiffPositionのデータと同じデータをオブジェクトとして生成し戻り値として返す
function arrWithmatchPosition(beforeShapingObj) {
    const samePositonAsTheBeginning = beforeShapingObj.filter((value, index, Obj) => {
        return (value.diffCount === 1) && (value.diffPosition === Obj[0].diffPosition);
    });
    return samePositonAsTheBeginning;
}

//圧縮文字を生成する
function createCompressString(compressionTarget, compressObj) {
    if (compressObj.length) {
        const targetCompressedString = compressionTarget.slice(compressObj[0].diffPosition, compressObj[0].diffPosition + 1);
        const stringBeforeCompression = compressionTarget.slice(0, compressObj[0].diffPosition);
        const stringAfterCompression = compressionTarget.slice(compressObj[0].diffPosition + 1);
        const compressStrings = compressObj.map(compressMoji => {
            return compressMoji.diffMoji;
        }).join("");
        const omitString = omitCompressCharacter(targetCompressedString + compressStrings);
        return stringBeforeCompression + '[' + omitString + ']' + stringAfterCompression;
    } else {
        return compressionTarget;
    }
}

function omitCompressCharacter(omitString) {
    let omitResultStrings = "";
    let omitStringArr = [...omitString].sort();
    let omitStrings = omitStringArr[0];

    for (let i = 1; i < omitStringArr.length; i++) {
        if (~(omitStringArr[i - 1].charCodeAt(0) - omitStringArr[i].charCodeAt(0))) {
            omissionDecision(omitStrings);
            omitStrings = omitStringArr[i];
        } else {
            omitStrings += omitStringArr[i];
        }
    }

    omissionDecision(omitStrings);

    function omissionDecision(str) {
        if (str.length > 2) {
            omitResultStrings += str.slice(0, 1) + "-" + str.slice(-1);
        } else {
            omitResultStrings += str;
        }
    }
    return omitResultStrings;
}