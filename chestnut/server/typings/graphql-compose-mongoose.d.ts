declare var composeWithMongoose: (model:any,options:any)=> any ;

declare module 'graphql-compose-mongoose' {
    export = composeWithMongoose; //: (model:any,options:any)=> any;
}