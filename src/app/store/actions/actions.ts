import { createAction, props } from '@ngrx/store';
import {SubjectSearchRequest, SubjectSearchResponse} from "../models/model";

export const SearchAction = {
  SEARCH_SUBJECT: '[RedditSearch] Search for a subject',
  SAVE_SEARCH_REQUEST : '[RedditSearch] Save Search for a subject',
  SEARCH_SUCCESSFUL: '[RedditSearch] Subject search successful',
  SEARCH_FAIL: '[RedditSearch] Subject Search failed'

};

export const searchSubject = createAction(
  SearchAction.SEARCH_SUBJECT,
  props<SubjectSearchRequest>()
);

export const saveSearch = createAction(
  SearchAction.SAVE_SEARCH_REQUEST,
  props<SubjectSearchRequest>()
);

export const searchSuccess = createAction(
  SearchAction.SEARCH_SUCCESSFUL,
  props<SubjectSearchResponse>()
);

export const searchFail = createAction(
  SearchAction.SEARCH_FAIL,
  props<{ message: string }>()
);
