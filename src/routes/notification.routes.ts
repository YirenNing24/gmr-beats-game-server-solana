//** ELYSIA IMPORT
import Elysia from 'elysia'

//** SERVICE IMPORT
import NotificationService from '../game.services/notification.services/notification.service'

//** TYPE INTERFACE IMPORT
import { NotificationData } from '../game.services/notification.services/notification.interface';
import { authorizationBearerSchema } from './route.schema/schema.auth';



const notification = (app: Elysia): void => {
    app.get('/api/notification', async ({ headers }): Promise<NotificationData[]> => {
      try {
        const authorizationHeader: string | null = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const notificationService: NotificationService = new NotificationService();
        const output: NotificationData[] = await notificationService.getNotification(jwtToken);

        return output;
      } catch (error: any) {
        throw error
         }
        }, authorizationBearerSchema
    ) 
    
}
  
export default notification