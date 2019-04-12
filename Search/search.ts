// 基于数组列表搜索，多字段匹配

import FuzzySearch = require('./node_modules/fuse.js.js');
import GraphemeSplitter = require('./node_modules/libs/grapheme-splitter');
import { Observable } from "./node_modules/rxjs";


export function createUserSearchingStream(option: UserSearchingViewStreamOptions): Observable<IUserSearchResultMap> {
    let maxSearchingPatternLength = 32;
    let graphemeSplitter = new GraphemeSplitter();

    if (option.maxSearchingPatternLength > 0) {
        maxSearchingPatternLength = option.maxSearchingPatternLength;
    }

    return Observable.combineLatest(
        option.keyword$,
        option.userIdList$,
        (keyword: string, userIdList: ServiceState.UserId[]) => {
            if (!keyword) return {};
            if (!userIdList || !userIdList.length) return {};

            if (keyword.length > option.maxSearchingPatternLength) {
                return {};
            }

            let contactService = getContactService();
            let userService = getUserInfoService();

            let contactInfoMap = contactService.contactMap;
            let matchUserMap: IUserSearchResultMap = {};

            let wasUserNameMatched = false;
            let wasRemarkMatched = false;

            let fuzzySearch;

            let contactList = userIdList.map(id => contactInfoMap[id]).filter(info => info != null);

            fuzzySearch = new FuzzySearch(contactList, {
                includeScore: true,
                shouldSort: false,
                findAllMatches: false,
                threshold: 0.1,
                location: 1,
                distance: 100,
                maxPatternLength: maxSearchingPatternLength,
                minMatchCharLength: keyword.length,
                includeMatches: true,
                keys: ['remark', 'remarkPinyin']
            });

            fuzzySearch.search(keyword).forEach(({item, matches, score}) => {
                score = Math.floor(score * 100) / 100;

                let contact: ServiceState.Contact = item;
                let contactId = contact.userId;

                if (!hasOwn(matchUserMap, contactId)) {
                    matchUserMap[contactId] = {
                        contact,
                        userInfo: userService.getUserInfo(contactId),

                        minSearchScore: score,
                        sortCriteriaMeta: {
                            raw: contact.remark,
                            pinyin: contact.remarkPinyin,
                            pinyinBoundaries: contact.remarkPinyinBoundaries,
                        }
                    }
                } else if (matchUserMap[contactId].minSearchScore > score) {
                    matchUserMap[contactId].minSearchScore = score;
                    matchUserMap[contactId].sortCriteriaMeta = {
                        raw: contact.remark,
                        pinyin: contact.remarkPinyin,
                        pinyinBoundaries: contact.remarkPinyinBoundaries,
                    };
                    matchUserMap[contactId].matchedUserPhone = matchUserMap[contactId].matchedUserPhone = null;
                } else {
                    return;
                }

                matchUserMap[contactId].matchedRemarkName = [];

                let splitterRemarkCharArray = graphemeSplitter.splitGraphemes(contact.remark);

                matches.forEach(match => {
                    let { indices, key } = match;

                    let [startIndex, endIndex] = indices[0];

                    if (key === 'remark') {
                        wasRemarkMatched = true;
                        splitterRemarkCharArray.forEach((char, index) => {
                            matchUserMap[contactId].matchedRemarkName.push({
                                char,
                                highlight: index >= startIndex && index <= endIndex,
                            });
                        })
                    } else if (key === 'remarkPinyin' && !wasRemarkMatched) {
                        let pinyinBoundaries = contact.remarkPinyinBoundaries;

                        // FIXME: 对于`ainiyou`，当搜索`ni` 时会匹配到`ini`，导致boundary 会出错，可能，我们不需要fuzzysearch
                        // if (pinyinBoundaries.indexOf(startIndex) === -1) return;

                        pinyinBoundaries.forEach((boundaryIndex, charIndex) => {
                            let char = splitterRemarkCharArray[charIndex];
                            matchUserMap[contactId].matchedRemarkName.push({
                                char,
                                highlight: boundaryIndex >= startIndex && boundaryIndex <= endIndex,
                            });
                        });

                        wasRemarkMatched = true;
                    }
                });
            });

            let userListToSearch = userService.getUserInfoList(userIdList);

            fuzzySearch = new FuzzySearch(userListToSearch, {
                includeScore: true,
                shouldSort: true,
                threshold: 0.1,
                location: 1,
                distance: 100,
                maxPatternLength: maxSearchingPatternLength,
                minMatchCharLength: keyword.length,
                includeMatches: true,
                keys: ['userName', 'pinyin']
            });

            fuzzySearch.search(keyword).forEach(({item, matches, score}) => {
                score = Math.floor(score * 100) / 100;

                let userInfo: ServiceState.UserInfo = item;
                let contactId = userInfo.userId;

                if (!hasOwn(matchUserMap, contactId)) {
                    matchUserMap[contactId] = {
                        contact: contactService.getContactInfo(contactId),
                        userInfo: userInfo,

                        minSearchScore: score,
                        sortCriteriaMeta: {
                            raw: userInfo.userName,
                            pinyin: userInfo.pinyin,
                            pinyinBoundaries: userInfo.pinyinBoundaries,
                        }
                    }
                } else if (matchUserMap[contactId].minSearchScore > score) {
                    matchUserMap[contactId].minSearchScore = score;
                    matchUserMap[contactId].sortCriteriaMeta = {
                        raw: userInfo.userName,
                        pinyin: userInfo.pinyin,
                        pinyinBoundaries: userInfo.pinyinBoundaries,
                    };
                    matchUserMap[contactId].matchedUserPhone = matchUserMap[contactId].matchedRemarkName = null;
                } else {
                    return;
                }

                matchUserMap[contactId].matchedUserName = [];

                let splitterUserNameCharArray = graphemeSplitter.splitGraphemes(userInfo.userName);

                matches.forEach(match => {
                    let { indices, key } = match;

                    let [startIndex, endIndex] = indices[0];

                    if (key === 'userName') {
                        wasUserNameMatched = true;
                        splitterUserNameCharArray.forEach((char, index) => {
                            matchUserMap[contactId].matchedUserName.push({
                                char,
                                highlight: index >= startIndex && index <= endIndex,
                            });
                        })
                    } else if (key === 'pinyin' && !wasUserNameMatched) {
                        let pinyinBoundaries = userInfo.pinyinBoundaries;

                        if (pinyinBoundaries.indexOf(startIndex) === -1) return;

                        pinyinBoundaries.forEach((boundaryIndex, charIndex) => {
                            let char = splitterUserNameCharArray[charIndex];
                            matchUserMap[contactId].matchedUserName.push({
                                char,
                                highlight: boundaryIndex >= startIndex && boundaryIndex <= endIndex,
                            });
                        })

                    }
                });
            });

            fuzzySearch = new FuzzySearch(userListToSearch, {
                includeScore: true,
                shouldSort: true,
                threshold: 0.1,
                location: 1,
                distance: 100,
                maxPatternLength: maxSearchingPatternLength,
                minMatchCharLength: keyword.length,
                includeMatches: true,
                keys: ['phone']
            });

            fuzzySearch.search(keyword).forEach(({item, matches, score}) => {
                score = Math.floor(score * 100) / 100;

                let userInfo: ServiceState.UserInfo = item;
                let contactId = userInfo.userId;

                if (!hasOwn(matchUserMap, contactId)) {
                    matchUserMap[contactId] = {
                        contact: contactService.getContactInfo(contactId),
                        userInfo: userInfo,

                        minSearchScore: score,
                        sortCriteriaMeta: {
                            raw: userInfo.phone,
                        }
                    }
                } else if (matchUserMap[contactId].minSearchScore > score) {
                    matchUserMap[contactId].minSearchScore = score;
                    matchUserMap[contactId].sortCriteriaMeta = {
                        raw: userInfo.phone,
                    };
                    matchUserMap[contactId].matchedUserName = matchUserMap[contactId].matchedRemarkName = null;
                } else {
                    return;
                }

                matchUserMap[contactId].matchedUserPhone = [];

                matches.forEach(match => {
                    let { indices, key } = match;

                    let [startIndex, endIndex] = indices[0];

                    if (key === 'phone') {
                        userInfo.phone.split('').forEach((number, index) => {
                            matchUserMap[contactId].matchedUserPhone.push({
                                char: number,
                                highlight: index >= startIndex && index <= endIndex,
                            });
                        })
                    }
                });
            });

            return matchUserMap;
        }
    )
}