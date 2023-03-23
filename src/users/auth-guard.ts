import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class MutationGuard implements CanActivate {

    constructor(private readonly redisService : RedisService){}
    
 async canActivate(context: ExecutionContext): Promise<boolean> {

    

    const redisClient = this.redisService.getClient();

    const mail = await redisClient.get('id');
   
    const data = await redisClient.hmget(mail,'email','access_token')
   
    if(data[0] && data[1])
    {
        return true;
    }
    

    
    return false; 
  }
}