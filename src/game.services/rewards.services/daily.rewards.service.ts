//** SERVICE IMPORTS
import SongRewardService from "./song.rewards.service";


class DailyRewardService {
    public async dailyLoginReward(username: string) {
      const songRewardService: SongRewardService = new SongRewardService();

      try {
        songRewardService.sendBeatsReward(username, 500);


      } catch(error: any) {
        console.log(error);
        throw error
      }
    }
    

}

export default DailyRewardService;