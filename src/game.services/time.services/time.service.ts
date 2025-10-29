//** ELYSIA IMPORTS
import { ElysiaWS } from "elysia/ws";


interface ServerTimeResponse {
  serverTime: string;
}

interface PongMessage {
  type: string;
  timestamp: number;
}

type Message = ServerTimeResponse | PongMessage;

class TimeService {

  websocket?: ElysiaWS<any>;

  constructor(websocket?: ElysiaWS<any>) {
    this.websocket = websocket;
  }


    public async getServerDateTime(message: any): Promise<void> {

        const { timestamp } = message
        const ws = this.websocket

        const currentDate = new Date();
        const year: number = currentDate.getFullYear();
        const month: number = currentDate.getMonth() + 1; // Months are zero-indexed
        const day: number = currentDate.getDate();
        const hours: number = currentDate.getHours();
        const minutes: number = currentDate.getMinutes();
        const seconds: number = currentDate.getSeconds();
      
        // Format the date and time
        const formattedDateTime: string = `${year}-${this.padZero(month)}-${this.padZero(day)} ${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
        const serverTimePing: Message[] = [{ serverTime: formattedDateTime }, {"type": "pong", "timestamp": timestamp }]

        const stringifyServerTime: string = JSON.stringify(serverTimePing)

        ws?.send(stringifyServerTime)
    }
      
    // Helper function to pad single-digit numbers with a leading zero
    private padZero(num: number): string {
        return num < 10 ? `0${num}` : num.toString();
    }
}

export default TimeService;
