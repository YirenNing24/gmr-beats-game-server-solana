import { getDriver } from "../../db/memgraph";
import WalletService from "../../user.services/wallet.services/wallet.service";
import { ClassicScoreStats } from "../leaderboard.services/leaderboard.interface";
import RewardService from "./mission.rewards.service";


class SongRewardService {

	public async classicSongReward(score: ClassicScoreStats): Promise<number> {
		try {
			// Base reward and difficulty multiplier
			const baseReward = 0.005;
			let multiplier = 1;

			switch (score.difficulty.toLowerCase()) {
				case "easy":
					multiplier = 1;
					break;
				case "medium":
					multiplier = 1.5;
					break;
				case "hard":
					multiplier = 2;
					break;
				case "ultra hard":
					multiplier = 3;
					break;
				default:
					multiplier = 1;
			}

			// Compute reward
			const reward = baseReward * score.accuracy * multiplier;

			// Round to 4 decimal places
			const roundedReward = parseFloat(reward.toFixed(4));
			if (roundedReward === 0) {
				return 0
			}
			// Send reward
			await this.sendSolReward(score.username, roundedReward);

			return roundedReward;
		} catch (error: any) {
			console.error("Error calculating song reward:", error);
			throw error;
		}
	}



	public async sendSolReward(username: string, beatsAmount: number) {
		const driver = getDriver();
		const walletService: WalletService = new WalletService(driver);
		const rewardService: RewardService = new RewardService(driver);
		try {

			console.log(username, `" receives ${beatsAmount} reward`)
			const smartWalletAddress: string = await walletService.getSmartWalletAddress(username);
			await rewardService.sendSolReward(smartWalletAddress, beatsAmount.toString());

		} catch(error: any) {
		  console.log(error)
		  throw error
		 
		}
	}
    }


export default SongRewardService


