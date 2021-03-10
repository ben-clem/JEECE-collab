import { User } from "../entities/User";
import { ObjectType, Field } from "type-graphql";
import { Conversation } from "../entities/Conversation";

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class ConvResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Conversation, { nullable: true })
  conv?: Conversation;
}

@ObjectType()
export class ConvsResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [Conversation], { nullable: true })
  convs?: Conversation[];
}
