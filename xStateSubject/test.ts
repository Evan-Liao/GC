import XStateSubject from './xStateSubject';

export enum actions {
    mergeList = 'mergeList',
}

const reducers = {
    [actions.mergeList](state, action) {
        return state;
    },
};

export default class TestStateSubject extends XStateSubject<any> {
    constructor() {
        super({});
    }

    public created() {
        // @ts-ignored
        this.addReducers(reducers);
    }

    public mergeList(list) {
        if (!list || !list.length) return;
        this.dispatch({
            type: actions.mergeList,
            payload: list,
        })
    }

}