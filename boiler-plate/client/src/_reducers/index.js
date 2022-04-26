// state의 변화 상태를 tracking하여 return하는 것이 reducer.
// combineReducers를 통해 store에 있는 여러 가지 redux를 rootReducer로 통합
import { combineReducers } from 'redux';
import user from './user_reducer';
// import comment from './comment_reducer';

const rootReducer = combineReducers({
  user,
  // comment
  // 이런 식으로 기능을 덧붙여 나가면서 state 관리
});

export default rootReducer;
