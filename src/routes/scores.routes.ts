//** ELYSIA AND JWT MODULE IMPORT
import Elysia from 'elysia'


//** MEMGRAPH DRIVER AND TYPES
import { Driver } from 'neo4j-driver';
import { getDriver } from '../db/memgraph';

//** SERVICE IMPORTS
import ScoreService from '../game.services/scores.services/scores.service';
import { ClassicScoreStats } from '../game.services/leaderboard.services/leaderboard.interface';

//** VALIDATION SCHEMA IMPORT
import { authorizationBearerSchema } from './route.schema/schema.auth';
import { classicScoreStatsSchema, getClassicScoreStatsSingle } from '../game.services/leaderboard.services/leaderboard.schema';


//** TYPE INTERFACE IMPORTS
import { LevelUpResult } from '../game.services/experience.services/experience.interface';
import { getFollowersFollowingSchema } from '../social.services/social.schema';


const scores = (app: Elysia): void => {
    app.post('/api/save/score/classic', async ({ headers, body }): Promise<LevelUpResult> => {
        try {
          const authorizationHeader: string = headers.authorization;
          if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
          }
          const jwtToken: string = authorizationHeader.substring(7);

            const driver: Driver = getDriver();
            const scoreService: ScoreService = new ScoreService(driver);
            const result: LevelUpResult = await scoreService.saveScoreClassic(body, jwtToken);

            return result
        } catch (error: any) {
          throw error
        }
      }, classicScoreStatsSchema
    )

    .get('api/open/history/retrieve/:username', async ({ headers, params }): Promise<ClassicScoreStats[]> => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const driver: Driver = getDriver();
            const scoreService: ScoreService = new ScoreService(driver);
            const output: ClassicScoreStats[] = await scoreService.retrieveHistory(jwtToken, params.username);
            return output;
        } catch (error: any) {
            throw error
        }
      }, getFollowersFollowingSchema
    )



    .get('/api/open/highscore/classic/per-song/player', async ({ headers } ): Promise<ClassicScoreStats[]> => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);

            const driver: Driver = getDriver();
            const scoreService: ScoreService = new ScoreService(driver);
            const output: ClassicScoreStats[] = await scoreService.getPlayerHighScorePerSong(jwtToken);

          return output;
        } catch (error: any) {
          throw error
        }
      }, authorizationBearerSchema
    )

    .get('/api/open/highscore/classic/single/', async ({ headers, query }): Promise<ClassicScoreStats[]> => {
      try {
          const authorizationHeader = headers.authorization;
          if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
              throw new Error('Bearer token not found in Authorization header');
          }
          const jwtToken: string = authorizationHeader.substring(7);

          const driver: Driver = getDriver();
          const scoreService: ScoreService = new ScoreService(driver);
          const output: ClassicScoreStats[] = await scoreService.getHighScoreClassic(query, jwtToken);

        return output;
      } catch (error: any) {
        throw error
      }
    }, getClassicScoreStatsSingle
  )
};


export default scores;
