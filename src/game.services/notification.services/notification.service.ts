//** MEMGRAPH IMPORT
import { Driver } from "neo4j-driver";


//** SERVICE IMPORT
import TokenService from "../../user.services/token.services/token.service";

//** TYPE INTERFACES
import { NotificationData } from "./notification.interface";



class NotificationService {
    driver?: Driver;
    constructor(driver?: Driver) {
      this.driver = driver;
    }



    // public async getNotification(token: string): Promise<NotificationData[]> {
    //     try {
    //       const tokenService: TokenService = new TokenService();
    //       const recipient: string | Error = await tokenService.verifyAccessToken(token);
    
    //       const connection: rt.Connection = await getRethinkDB();
            
    //       // Retrieve the latest note for the user
    //       const cursor: rt.Cursor = await rt
    //         .db('beats')
    //         .table('notifications')    // public async getNotification(token: string): Promise<NotificationData[]> {
    //     try {
    //       const tokenService: TokenService = new TokenService();
    //       const recipient: string | Error = await tokenService.verifyAccessToken(token);
    
    //       const connection: rt.Connection = await getRethinkDB();
                // public async getNotification(token: string): Promise<NotificationData[]> {
    //     try {
    //       const tokenService: TokenService = new TokenService();
    //       const recipient: string | Error = await tokenService.verifyAccessToken(token);
    
    //       const connection: rt.Connection = await getRethinkDB();
            
    //       // Retrieve the latest note for the user
    //       const cursor: rt.Cursor = await rt
    //         .db('beats')
    //         .table('notifications')
    //         .filter({ recipient })
    //         .orderBy(rt.desc('date'))
    //         .run(connection);
          
    //       const notificationsArray: NotificationData[] = await cursor.toArray();
    
    //       return notificationsArray;
    //     } catch(error: any) {
    //       console.log(error);
    //       throw error;
    //     }
    //   }
    
    //   public async createNotification(notificationData: NotificationData): Promise<void> {
    //     try {
    
    
    //       const connection: rt.Connection = await getRethinkDB();
          
    //       // Retrieve the latest note for the user
    //       await rt.db('beats')
    //         .table('notifications')
    //         .insert(notificationData)
    //         .run(connection);
          
    //     } catch(error: any) {
    //       console.log(error);
    //       throw error;
    //     }
    //   }
    //       // Retrieve the latest note for the user
    //       const cursor: rt.Cursor = await rt
    //         .db('beats')
    //         .table('notifications')
    //         .filter({ recipient })
    //         .orderBy(rt.desc('date'))
    //         .run(connection);
          
    //       const notificationsArray: NotificationData[] = await cursor.toArray();
    
    //       return notificationsArray;
    //     } catch(error: any) {
    //       console.log(error);
    //       throw error;
    //     }
    //   }
    
    //   public async createNotification(notificationData: NotificationData): Promise<void> {
    //     try {
    
    
    //       const connection: rt.Connection = await getRethinkDB();
          
    //       // Retrieve the latest note for the user
    //       await rt.db('beats')
    //         .table('notifications')
    //         .insert(notificationData)
    //         .run(connection);
          
    //     } catch(error: any) {
    //       console.log(error);
    //       throw error;
    //     }
    //   }
    //         .filter({ recipient })
    //         .orderBy(rt.desc('date'))
    //         .run(connection);
          
    //       const notificationsArray: NotificationData[] = await cursor.toArray();
    
    //       return notificationsArray;
    //     } catch(error: any) {
    //       console.log(error);
    //       throw error;
    //     }
    //   }
    
    //   public async createNotification(notificationData: NotificationData): Promise<void> {
    //     try {
    
    
    //       const connection: rt.Connection = await getRethinkDB();
          
    //       // Retrieve the latest note for the user
    //       await rt.db('beats')
    //         .table('notifications')
    //         .insert(notificationData)
    //         .run(connection);
          
    //     } catch(error: any) {
    //       console.log(error);
    //       throw error;
    //     }
    //   }
        
}


export default NotificationService