import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Redirect, Req, Res } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { firstValueFrom } from 'rxjs';
import { AppService } from './app.service';
import { Response } from 'express';
import { LoginUserInput } from './users/dto/login-user.input';
import { UsersService } from './users/users.service';
@Controller()
export class AppController {

  private token : any;
private loginEmail ;
  constructor(
    private readonly appService: AppService,private readonly redisService : RedisService,private readonly userService :UsersService,private readonly httpService : HttpService)
     {}

  @Get('ji')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async gettoken(@Req() req, @Res() res:Response ){

  
     
    if(req.body.token){

      console.log(req.body.token);

      this.token = req.body.token

      const redisClient = this.redisService.getClient();

      const userKey = req.body.token.emailAddress ;
    
       const mail = await redisClient.get('id');
     //const mail =await this.userService.getEmail()
      //console.log(mail.e)

      if(mail===userKey){

        await redisClient.hmset(userKey, {

              access_token : req.body.token.accessToken
        })

        //   console.log(res)
        // try{
      
        //   const url = 'https://f9eb-27-109-3-34.in.ngrok.io';
        //   const value = this.token;

        //   const response =  await this.httpService.post(url, {value});

        //     await firstValueFrom(response);
        //     // console.log(res1);
        //    }
      
        //    catch(error)
        //    {
        //         console.log(error);
        //    } 
        // console.log('user found in redis')
        
      }
      else{

         console.log('User not found in redis')
      }

    }
    else{
      console.log(req.body.msg)
    }
  }


    @Post('getmessage')
    getmessage(@Req() req, @Res() res:Response ){
          
    console.log({message : req.body.message})

    }

    @Post('getsubarr')
    getsubarr(@Req() req, @Res() res:Response ){
          
    console.log({message :req.body.message})
    for (let email of req.body.arr) {
      console.log(email);
    }
    }

    @Post('getdraftmsg')
    getdraftmsg(@Req() req, @Res() res:Response ){
          
    console.log({message : req.body.message})

    }

  }

   
 
