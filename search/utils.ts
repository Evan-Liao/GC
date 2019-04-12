
import pinyin = require('libs/web-pinyin/web-pinyin');
import GraphemeSplitter = require('libs/grapheme-splitter');

const splitter = new GraphemeSplitter();

export default function getStringPinyinMeta(source: string) {
    let py = '', indexChar = '#', pinyinBoundary = [];

    if (source) {
        try {
            let splittedCharArray = splitter.splitGraphemes(source);
            let charPyList = [];

            if (splittedCharArray) {
                splittedCharArray.forEach((char, index) => {
                    let result = pinyin.convert(char);
                    if (Array.isArray(result)) {
                        result = result.join('');
                    }

                    charPyList.push(result);
                });
            }

            if (charPyList.length) {
                py = charPyList.join('');
                indexChar = py[0].toUpperCase();
                charPyList.reduce((index, pinyin) => {
                    pinyinBoundary.push(index);
                    return index + pinyin.length;
                }, 0);
            }
        } catch (e) {
            log(e);
        }
    }

    if (!indexChar || indexChar < 'A' || indexChar > 'z') {
        indexChar = '#';
    }

    return {
        pinyin: py,
        indexChar,
        boundaries: pinyinBoundary,
    };
}