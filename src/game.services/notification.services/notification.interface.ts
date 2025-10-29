  /**
   * Represents a notification sent to a user.
   *
   * @interface NotificationData
   * @property {string} id - The unique identifier for the notification.
   * @property {string} recipient - The username of the person receiving the notification.
   * @property {string} sender - The username of the person who triggered the notification.
   * @property {boolean} read - Whether the notification has been read by the recipient.
   * @property {"followed" | "followed back"} type - The type of the notification (e.g., "followed" or "followed back").
   * @property {Date} date - The date when the notification was created.
   */
  export interface NotificationData {
    id: string;
    recipient: string;
    sender: string;
    read: boolean;
    type: "followed" | "followed back";
    date: Date;
  }
  