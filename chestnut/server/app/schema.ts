import * as composeWithMongoose from "graphql-compose-mongoose";
import { GQC } from "graphql-compose";

const customizationOptions = {}; // left it empty for simplicity, described below

export function initGraphQLSchema(models: any) {
  const UserTC = composeWithMongoose(UserModel, customizationOptions);

  GQC.rootQuery().addFields({
    userById: UserTC.getResolver("findById"),
    userByIds: UserTC.getResolver("findByIds"),
    userOne: UserTC.getResolver("findOne"),
    userMany: UserTC.getResolver("findMany"),
    userCount: UserTC.getResolver("count"),
    userConnection: UserTC.getResolver("connection"),
    userPagination: UserTC.getResolver("pagination")
  });

  GQC.rootMutation().addFields({
    userCreate: UserTC.getResolver("createOne"),
    userUpdateById: UserTC.getResolver("updateById"),
    userUpdateOne: UserTC.getResolver("updateOne"),
    userUpdateMany: UserTC.getResolver("updateMany"),
    userRemoveById: UserTC.getResolver("removeById"),
    userRemoveOne: UserTC.getResolver("removeOne"),
    userRemoveMany: UserTC.getResolver("removeMany")
  });

  const graphqlSchema = GQC.buildSchema();
  return graphqlSchema;
}
