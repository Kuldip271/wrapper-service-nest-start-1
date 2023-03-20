import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class MutationGuard implements CanActivate {

    constructor(private readonly redisService : RedisService){}
    
 async canActivate(context: ExecutionContext): Promise<boolean> {

    

    const redisClient = this.redisService.getClient();

    const mail = await redisClient.get('id');
    // const request = context.switchToHttp().getRequest();
    const data = redisClient.hmget(mail,'email','access_token')
    if(data[0] && data[1])
    {
        return true;
    }
    

    // Your guard logic here
    return false; // or false depending on the result of the guard logic
  }
}