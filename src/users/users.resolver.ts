import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
// import { Request } from 'express';
import { Response } from './response';
import { SignupUserInput } from './dto/signup-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Post, Req, UseGuards, ValidationPipe, Request, Res } from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateTaskInput } from 'src/tasks/dto/create-task.input';
import { ResponseTask } from 'src/tasks/response-task';
import { UpdateTaskInput } from 'src/tasks/dto/update-task.input';
import { RedisService } from 'nestjs-redis';
import { HttpService } from '@nestjs/axios';
// import axios from 'axios';
// import * as WebSocket from 'ws';
// import { RedisService } from 'redis/redis.service';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import https from 'https'
import { SendMail } from './dto/send-mail.input';
import { MailOutput } from './dto/mail-output';
import { GetMails } from './dto/get-mail.input';
import { SaveDraft } from './dto/save-draft.input';
import { MutationGuard } from './auth-guard';



@Resolver(() => User)
export class UsersResolver {
  private testemail;
  constructor(private readonly usersService: UsersService, private taskService: TasksService, private readonly redisService: RedisService, private readonly httpService: HttpService) { }

  @Mutation(() => Response)
  async signup(@Args('signupUserInput') signupUserInput: SignupUserInput) {
    return this.usersService.signup(signupUserInput)

  }

  @Mutation(() => Response)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {

     const redisClient = this.redisService.getClient();

    this.testemail = loginUserInput.email;
    await redisClient.set('id',this.testemail);
   // await this.usersService.setEmail(this.testemail)
    // const userExists = await redisClient.exists(userKey);

    //  console.log(userExists)

    // if (!userExists) {
    //   console.time('dbtimer')

    //   const user = await this.usersService.login(loginUserInput);

    //   console.timeEnd('dbtimer')


    //   // Store the user's data in Redis
    //   await redisClient.hmset(userKey, {
    //     username: user.user.username,
    //     age: user.user.age,
    //     id : user.user.id,
    //     access_token : user.access_token

    //   });
    //   console.log(userKey)

    //   return user;
    // }
    // else{
    //   // console.log( userExists);
    //   console.time('redistimer')

    //   const userfromredis = await redisClient.hmget(userKey,'username','age', 'id', 'access_token');

    //   console.timeEnd('redistimer')

    //    console.log(userfromredis)


    //    const user = {

    //      username : userfromredis[0],
    //      email : userKey,
    //      age : userfromredis[1],
    //     //  id : userfromredis[2],
    //      access_token : userfromredis[3] 
    //    }

    //   return {user};

    //   // return {userfromredis};
    // }

    //////////////////////////////////////////////////////////////////
    // const redisClient = this.redisService.getClient();
    const userKey = loginUserInput.email;
    //  console.log(userKey)
    await redisClient.hmset(userKey, {
      email: loginUserInput.email

    })
    try {

      // console.log(response)

      const url = 'https://9ffa-61-12-85-170.in.ngrok.io';
      const response = await this.httpService.post(url, { data: loginUserInput.email });
      await firstValueFrom(response);
      // console.log(res1);
    }

    catch (error) {
      console.log(error);
    }



  }



  @UseGuards(MutationGuard)
  @Mutation(() => ResponseTask)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput, @Context() context) {
    // console.log({context})
    return this.taskService.create(createTaskInput, context?.req?.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseTask)
  updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.taskService.update(updateTaskInput.id, updateTaskInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseTask)
  removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.taskService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Response)
  removeUser(@Context() context) {

    return this.usersService.remove(context?.req?.user?.id);
  }

  // @UseGuards(JwtAuthGuard)
  @Query(() => [ResponseTask])
  findAllTask(@Context() context) {
    return this.taskService.findAll(context?.req?.user?.id);
  }


  @UseGuards(JwtAuthGuard)
  @Query(() => ResponseTask)
  findOneTask(@Args('id', { type: () => Int }) id: number) {
    return this.taskService.findOne(id);
  }


  @Mutation(() => MailOutput)
  async sendMail(@Args('sendMail') sendMail: SendMail,@Res() res : Response) {

    const redisClient = this.redisService.getClient();
    const userExists = await redisClient.exists(this.testemail);

    if (userExists) {

      const data = await redisClient.hmget(this.testemail,'email', 'access_token')

      if (data[1]) {
        const mailbody = {
          subject : sendMail.subject,
          body : sendMail.body,
          to : data[0]
        }

        const url = 'https://9ffa-61-12-85-170.in.ngrok.io/sendMail';
        
        const response = await this.httpService.post(url, { mailbody,token:data[1] });
        
         await firstValueFrom(response);

        
      }

      console.log({message : "Send email and access_token sent!!!" })
      
    }


    return { hi: "Send email and access_token sent!!!" }


  }


  @Mutation(() => MailOutput)
  async getEmails(@Args('getMails') getMails: GetMails,@Res() res : Response) {

    const redisClient = this.redisService.getClient();
    const userExists = await redisClient.exists(this.testemail);

    if (userExists) {

      const data = await redisClient.hmget(this.testemail,'email', 'access_token')

      if (data[1]) {

        const url = 'https://9ffa-61-12-85-170.in.ngrok.io/getMails';
        
        const response = await this.httpService.post(url, { limit:getMails.limit,token:data[1] });
        
         await firstValueFrom(response);

        
      }

      console.log({message : "Send limt and access_token sent!!!" })
      
    }


    return { hi: "Send limit and access_token sent!!!" }


  }


  @Mutation(() => MailOutput)
  async saveDraft(@Args('saveDraft') saveDraft: SaveDraft,@Res() res : Response) {

    const redisClient = this.redisService.getClient();
    const userExists = await redisClient.exists(this.testemail);

    if (userExists) {

      const data = await redisClient.hmget(this.testemail,'email', 'access_token')

      if (data[1]) {
        const mailbody = {
          subject : saveDraft.subject,
          body : saveDraft.body,
          to : data[0]
        }

        const url = 'https://9ffa-61-12-85-170.in.ngrok.io/saveDraft';
        
        const response = await this.httpService.post(url, { mailbody,token:data[1] });
        
         await firstValueFrom(response);

        
      }

      console.log({message : "Send email and access_token sent!!!" })
      
    }


    return { hi: "Send email and access_token sent!!!" }


  }

}
