import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SendMail{
    @Field()
    subject : string

    @Field()
    body : string

    
}