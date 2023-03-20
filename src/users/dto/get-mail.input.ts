import { Field, InputType, Int } from "@nestjs/graphql"
import { IsEmail } from "class-validator"

@InputType()
export class GetMails{
    
    @Field(()=>Int)
    limit:Number

   
}