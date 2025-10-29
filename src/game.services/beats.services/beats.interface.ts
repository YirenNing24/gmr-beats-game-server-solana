


export interface BeatsStatus {
    status: string;
    activity: string;
}


export interface BeatsActivity {
    activity: string;
}


export interface MutualStatus {
    username: string;
    status: BeatsStatus;
}