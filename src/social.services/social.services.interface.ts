import { ProfilePicture } from "../game.services/profile.services/profile.interface";

export interface FollowResponse {
    status: string;
  }

export interface ViewedUserData {
  username: string
  playerStats: string
  signupDate: number
  }

export interface ViewProfileData {
  username: string
  playerStats: string
  followsUser: boolean
  followedByUser: boolean
  smartWalletAddress: string
  profilePics: ProfilePicture[]
  stalkers: Stalkers[]
  }

export interface MutualData {
    username: string;
    playerStats: string;
    profilePics: ProfilePicture[]
  }

export interface PlayerStatus {
    username: string
    status: boolean
    activity: string
    lastOnline: number
    userAgent: string
    osName: string
    ipAddress: string
    id: string
  }

export interface SetPlayerStatus {
    username: string
    status: boolean
    activity: string
    lastOnline: number
    userAgent: string
    osName: string
    ipAddress: string
  }

export interface CardGiftData {
  cardName: string
  id: string
  receiver: string
}

export interface CardGiftSending {

  senderWalletAddress: string
  receiverWalletAddress: string
}

export interface PostFanMoment {
  userName?: string
  postId?: string
  caption?: string
  image?: string
  posterImage?: string
  createdAt?: number
  likes?: PostLike[]
  shares?: PostShare[]
  comments?: PostComment[]
}

export interface PostLike {
  userName?: string;
  timestamp?: number;
  likeId?: string; 
}

export interface PostShare {
  userName?: string;
  timestamp?: number;
  shareId?: string; 
}

export interface PostComment {

  userName?: string;
  timestamp?: number;
  commentId?: string;
  comment?: string
}


export interface FanMomentId {
  id: string
}

export interface FanMomentComment {
  id: string;
  comment: string
}


export interface FollowersFollowing {
  following: { username: string, level: number, playerStats: any } []
  followers: { username: string, level: number, playerStats: any } []
}


export interface Stalkers {
  username: string
  displayPic: string
  timestamp: number
}