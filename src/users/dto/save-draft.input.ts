import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SaveDraft{
    @Field()
    subject : string

    @Field()
    body : string

    
}