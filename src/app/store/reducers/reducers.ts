import {Action, createReducer, on} from '@ngrx/store';
import {initialRedditState, SubjectSearch} from '../models/model';
import {searchFail, searchSubject, searchSuccess} from '../actions/actions';
import {DEFAULT_LIMIT} from "../../components/list-view/list-view.constants";


export const reducer = createReducer(
  initialRedditState.subjectSearch as SubjectSearch,
  on(searchSubject, (state, searchRequest) => ({
    ...state,
    subjectSearchRequest: {...searchRequest, limit: searchRequest.limit || DEFAULT_LIMIT},
    error: null,
    isLoading: true
  })),
  on(searchSuccess, (state, searchResponse) => ({
    ...state,
    subjectSearchResponse: searchResponse,
    error: null,
    isLoading: false
  })),
  on(searchFail, (state, {error}) => ({
    ...state,
    subjectSearchResponse: {},
    error: error,
    isLoading: false
  }))
);

export function RedditReducer(state: SubjectSearch, action: Action): SubjectSearch {
  return reducer(state as SubjectSearch, action as Action);
}
