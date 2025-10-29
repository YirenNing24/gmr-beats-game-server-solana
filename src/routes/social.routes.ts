//** ELYSIA AND PLUGINS IMPORT
import Elysia from 'elysia'
import { ip } from "elysia-ip";

//* MEMGRAPH DRIVER AND ETC
import { Driver } from 'neo4j-driver';
import { getDriver } from '../db/memgraph';

//* SOCIAL & CHAT SERVICE
import SocialService from '../social.services/social.service';
import ChatService from '../chat.services/chat.socket.service';

//* TYPES IMPORTS
import { FollowResponse, MutualData, PlayerStatus, PostFanMoment, ViewProfileData } from '../social.services/social.services.interface';
import { PrivateMessage } from '../chat.services/chat.interface';
import { SuccessMessage } from '../outputs/success.message';

//** VALIDATION SCHEMA IMPORT
import { followResponseSchema, getMutualConversationSchema, setOnlineStatusSchema, unFollowResponseSchema, viewProfileSchema } from './route.schema/schema.social';
import { authorizationBearerSchema } from './route.schema/schema.auth';
import { cardGiftSchema, commentFanMomentSchema, getBeatsClientStatusSchema, getFanMomentSchema, getFollowersFollowingSchema, likeFanMomentSchema, postFanMomentSchema, saveStalkerSchema } from '../social.services/social.schema';
import BeatsService from '../game.services/beats.services/beats.service';
import { MutualStatus } from '../game.services/beats.services/beats.interface';



  

const social = (app: Elysia) => {
    
    app.get('/api/social/viewprofile/:username', async ({ headers, params }): Promise<ViewProfileData> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const followService: SocialService = new SocialService(driver);

        const output: ViewProfileData = await followService.viewProfile(params.username, jwtToken);

        return output as ViewProfileData
      } catch (error: any) {
        throw error
        }
      }, viewProfileSchema )


    .post('/api/social/follow', async ({ headers, body }): Promise<FollowResponse> => {
        try {

          const authorizationHeader: string = headers.authorization;
          if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
          }
          const jwtToken: string = authorizationHeader.substring(7);

          const driver: Driver = getDriver();
          const followService: SocialService = new SocialService(driver);
          const output: FollowResponse = await followService.follow(body, jwtToken);

          return output as FollowResponse
        } catch (error: any) {
          throw error
        }
      }, followResponseSchema
    )


    .post('/api/social/unfollow', async ({ headers, body }): Promise<FollowResponse> => {
      try {
          const authorizationHeader: string = headers.authorization;
          if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
          }
          const jwtToken: string = authorizationHeader.substring(7);

          const driver: Driver = getDriver();
          const followService: SocialService = new SocialService(driver);
  
        const output: FollowResponse = await followService.unfollow(body, jwtToken);

        return output as FollowResponse
      } catch (error: any) {
        throw new Error("Unauthorized")
        }
      }, unFollowResponseSchema
    )


    .post('api/social/save-stalkers', async ({ headers, body }): Promise<SuccessMessage> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: SuccessMessage = await socialService.saveStalker(jwtToken, body);
        return output
      } catch (error: any) {
        throw error
        }
      }, saveStalkerSchema
    )


    .get('api/social/get-stalkers/:username', async ({ headers, params }) => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const playerUsername: string = params.username || "";  // Fallback if no username is provided

        const output = await socialService.getStalkers(jwtToken, playerUsername);
        return output
      } catch (error: any) {
        throw error
        }
      }, getFollowersFollowingSchema
    )



    .get('/api/social/list/mutual/:username', async ({ headers, params }) => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        

        const output: MutualData[] = await socialService.getMutual(jwtToken, params.username);
        return output;
      } catch (error: any) {
        throw error
        }
      }, getFollowersFollowingSchema
    )


    .get('/api/social/follower-following/count/:username', async ({ headers, params }) => {  // Changed to handle path parameters
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
    
        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
    
        // Extract the username from the path parameters
        const playerUsername: string = params.username || "";  // Fallback if no username is provided
    
        const output = await socialService.getFollowersFollowingCount(jwtToken, playerUsername);
        return output;
      } catch (error: any) {
        throw error;
      }
    }, getFollowersFollowingSchema
    )
    

    .get('/api/social/follower-following/:username', async ({ headers, params }) => {
      try {
        // Extract the Authorization header and check for the Bearer token
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
    
        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
    
        // Extract the username from the path parameters (if provided)
        const playerUsername: string = params.username || "";  // Fallback if no username is provided
    
        // Call the getFollowersFollowing method with the token and username
        const output = await socialService.getFollowersFollowing(jwtToken, playerUsername);
        return output;
      } catch (error: any) {
        throw error;
      }
    }, getFollowersFollowingSchema
    )
    

    .get('/api/social/mutual/:conversingUsername', async ({ headers, params }): Promise<PrivateMessage[]> => {
      try {
        const authorizationHeader = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const conversingUsername: string = params.conversingUsername

        const chatService = new ChatService()
        const output: PrivateMessage[] = await chatService.privateInboxData(jwtToken, conversingUsername)

        return output as PrivateMessage[]
      } catch (error: any) {
        throw new Error("Unauthorized")
        }
      }, getMutualConversationSchema
    )


    .post('/api/social/status/online', async ({ headers, body }): Promise<void> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const { activity, userAgent, osName } = body
        const ipAddress: string = "toFollowlaterssss"
        
        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);

        await socialService.setStatusOnline(activity, userAgent, osName, ipAddress, jwtToken);
    
      } catch (error: any) {
        throw new Error("Unauthorized")
        }
      }, setOnlineStatusSchema
    )
    

    .get('/api/social/mutual/online', async ({ headers }): Promise<PlayerStatus[]> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: PlayerStatus[] = await socialService.mutualStatus(jwtToken)

        return output as PlayerStatus[]
      } catch (error: any) {
        throw new Error("Unauthorized")
        }
      }, authorizationBearerSchema
    )


    .post('/api/social/gift/card', async ({ headers, body }): Promise<SuccessMessage> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: SuccessMessage = await socialService.sendCardGift(jwtToken, body)

        return output as SuccessMessage
      } catch(error: any) {
        throw error
      }
      }, cardGiftSchema
    )


    .post('/api/social/fanmoments/post', async ({ headers, body }): Promise<SuccessMessage | Error> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: SuccessMessage | Error = await socialService.postFanMoments(jwtToken, body);

        return output as SuccessMessage
      } catch(error: any) {
        throw error
      }
      }, postFanMomentSchema
    )


    .get('/api/social/hot/fanmoments', async ({ headers, query }): Promise<PostFanMoment[]> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        // Extract limit and offset from query parameters with default values
        const limit: number = parseInt(query.limit as string) || 5;
        const offset: number = parseInt(query.offset as string) || 0;


        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: PostFanMoment[] = await socialService.getHotFanMomentPosts(jwtToken, limit, offset);

        return output
      } catch(error: any) {
        throw error
        }
      }, getFanMomentSchema
    )


    .get('/api/social/my/fanmoments', async ({ headers, query }): Promise<PostFanMoment[]> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        // Extract limit and offset from query parameters with default values
        const limit: number = parseInt(query.limit as string) || 5;
        const offset: number = parseInt(query.offset as string) || 0;

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: PostFanMoment[] = await socialService.getMyFanMomentPosts(jwtToken, limit, offset);

        return output as PostFanMoment[]
      } catch(error: any) {
        throw error
        }
      }, getFanMomentSchema
    )


    .get('/api/social/latest/fanmoments', async ({ headers, query }): Promise<PostFanMoment[]> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        // Extract limit and offset from query parameters with default values
        const limit: number = parseInt(query.limit as string) || 5;
        const offset: number = parseInt(query.offset as string) || 0;

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: PostFanMoment[] = await socialService.getLatestFanMomentPosts(jwtToken, limit, offset);

        return output as PostFanMoment[]
      } catch(error: any) {
        throw error
        }
      }, getFanMomentSchema
    )


    .get('/api/social/following/fanmoments', async ({ headers, query }): Promise<PostFanMoment[]> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        // Extract limit and offset from query parameters with default values
        const limit: number = parseInt(query.limit as string) || 5;
        const offset: number = parseInt(query.offset as string) || 0;

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: PostFanMoment[] = await socialService.getFollowingMomentPosts(jwtToken, limit, offset);

        return output as PostFanMoment[]
      } catch(error: any) {
        throw error
        }
      }, getFanMomentSchema
    )


    .post('/api/social/fanmoments/like', async ({ headers, body }): Promise<SuccessMessage | Error> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: SuccessMessage | Error = await socialService.likeFanMoment(jwtToken, body)

        return output as SuccessMessage
      } catch(error: any) {
        throw error
      }
      }, likeFanMomentSchema
    )


    .post('/api/social/fanmoments/unlike', async ({ headers, body }): Promise<SuccessMessage | Error> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);
        const output: SuccessMessage | Error = await socialService.unlikeFanMoment(jwtToken, body)

        return output as SuccessMessage
      } catch(error: any) {
        throw error
      }
      }, likeFanMomentSchema
    )


    .post('/api/social/fanmoments/comment', async ({ headers, body}): Promise<SuccessMessage>=> {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const socialService: SocialService = new SocialService(driver);

        const output: SuccessMessage = await socialService.commentFanMoment(jwtToken, body);

        return output as SuccessMessage
      } catch(error: any) {
        throw error
      }
    }, commentFanMomentSchema
    )

    .post('/api/mutuals/status', async ({ headers, body }): Promise<Error | MutualStatus[]> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);


        const driver: Driver = getDriver();
        const beatsService: BeatsService = new BeatsService(driver);
        const output: Error | MutualStatus[] = await beatsService.getBeatsClientStatus(jwtToken, body);

        return output
      } catch(error: any) {
        throw error
        }
      }, getBeatsClientStatusSchema
    )


  };

export default social;

