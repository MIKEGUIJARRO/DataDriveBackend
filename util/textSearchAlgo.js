const ErrorResponse = require("./errorResponse");

const textSearchAlgo = (strText) => {
    const txt = strText.replace(/(\r\n|\n|\r)/gm, "");
    console.log(txt);
    const keywords = [];
    let keyword = '';
    let isReadingKeyword = false;
    let i = 0;
    while (i < txt.length) {
        if (isReadingKeyword === true && txt[i] !== '}') {
            const regExpr = /^[a-zA-Z0-9_]*$/;
            // https://stackoverflow.com/questions/336210/regular-expression-for-alphanumeric-and-underscores
            if (txt[0] === ' ' || !regExpr.test(txt[i])) {
                console.log('Char: ', txt[0])
                console.log('Keyword', keyword);
                throw new ErrorResponse('Invalid keywords', 422);
            }
            keyword = keyword.concat(txt[i]);
        }

        if (txt[i] === '{' && txt[i + 1] === '{' && isReadingKeyword === false) {
            i++;
            isReadingKeyword = true;
        }
        if (txt[i] === '}' && txt[i + 1] === '}' && isReadingKeyword === true) {
            i++;
            isReadingKeyword = false;
            keywords.push(keyword);
            keyword = '';
        }

        i++;
    }

    const reducedKeywords = removeDuplicates(keywords);
    return reducedKeywords;
}

const removeDuplicates = (arrayStr) => {
    const arrayStrDuplicate = [];
    for (const str of arrayStr) {
        if (!arrayStrDuplicate.includes(str)) {
            arrayStrDuplicate.push(str);
        }
    }
    return arrayStrDuplicate;
}

const hasDuplicates = (arrayOfStr) => {
    const arrayOfStrDuplicate = {};
    for (let i = 0; i < arrayOfStr.length; i++) {
        const value = arrayOfStr[i];
        if (value in arrayOfStrDuplicate) {
            return true;
        }
        arrayOfStrDuplicate[value] = true;
    }
    return false;
}

module.exports = textSearchAlgo;