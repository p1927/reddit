import {Action, createReducer, on} from '@ngrx/store';
import {initialRedditState, SubjectSearch} from '../models/model';
import {searchFail, searchSubject, searchSuccess} from '../actions/actions';
import {DEFAULT_LIMIT} from "../../components/list-view/list-view.constants";


export const reducer = createReducer(
  initialRedditState.subjectSearch as SubjectSearch,
  on(searchSubject, (state, searchRequest) => ({
    ...state,
    subjectSearchRequest: {...searchRequest, limit: searchRequest.limit || DEFAULT_LIMIT},
    message: null,
    isLoading: true
  })),
  on(searchSuccess, (state, searchResponse) => ({
    ...state,
    subjectSearchResponse: searchResponse,
    message: null,
    isLoading: false
  })),
  on(searchFail, (state, {message}) => ({
    ...state,
    subjectSearchResponse: {},
    message: message,
    isLoading: false
  }))
);

export function RedditReducer(state: SubjectSearch, action: Action): SubjectSearch {
  return reducer(state as SubjectSearch, action as Action);
}
