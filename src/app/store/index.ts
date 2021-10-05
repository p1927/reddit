import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {RedditReducer} from './reducers/reducers';
import {RedditState} from "./models/model";
import {environment} from "../../environments/environment";

export const reducers: ActionReducerMap<RedditState> = {
  subjectSearch: RedditReducer,
};

export const metaReducers: MetaReducer<RedditState>[] = !environment.production ? [] : [];
