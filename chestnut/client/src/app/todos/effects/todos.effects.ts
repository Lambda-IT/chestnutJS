import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { delay, flatMap, tap, map } from 'rxjs/operators';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import * as todos from '../actions/todos.actions';

const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:9000/graphql' }),
    cache: new InMemoryCache(),
});

@Injectable()
export class TodosEffects {
    constructor(private actions$: Actions) {}

    @Effect()
    loadTodos$ = this.actions$.ofType<todos.LoadTodos>(todos.LOAD_TODOS).pipe(
        flatMap(() =>
            client.query({
                query: gql`
                    query Todos {
                        todos {
                            id
                            description
                            completed
                        }
                    }
                `,
            })
        ),
        map(x => new todos.LoadTodosSuccess(x.data['todos']))
    );

    @Effect()
    setCompleted$ = this.actions$.ofType<todos.SetCompleted>(todos.SET_COMPLETED).pipe(
        map(({ payload }) => payload),
        flatMap(({ id, completed }) =>
            client.mutate({
                mutation: gql`
                    mutation setCompleted($id: ID!, $completed: Boolean!) {
                        setCompleted(id: $id, completed: $completed) {
                            id
                            description
                            completed
                        }
                    }
                `,
                variables: {
                    id,
                    completed,
                },
            })
        ),
        map(x => new todos.SetCompletedSucccess(x.data['setCompleted']))
    );
}
