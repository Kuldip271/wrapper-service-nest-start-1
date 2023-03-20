import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MailOutput{
    @Field()
    hi : String

    
}