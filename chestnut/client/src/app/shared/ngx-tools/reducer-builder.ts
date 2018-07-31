import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Type<T> extends Function {
  new(...args: any[]): T;
}

export class ReducerBuilder<State> {

  private subscribers: { [action: string]: (state: State, action: any) => State } = {};

  public handle<T extends Action>(actionType: Type<T>,
    handler: (state: State, action: T) => State): ReducerBuilder<State> {
    this.subscribers[new actionType().type] = handler;
    return this;
  }

  public build(initial: State): (state: State, action: Action) => State {
    return (state: State = initial, action: Action) =>
      this.subscribers[action.type] && this.subscribers[action.type](state, action) || state;
  }
}

export const instanceOf = <T extends Action>(actionType: Type<T>) =>
  (source: Observable<T>) => source.pipe(filter<T>(x => x instanceof actionType));
