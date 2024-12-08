export interface UserNotifyPayload {
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  userId: string;
  oldFirstname?: string | null | undefined;
  newFirstname?: string | null | undefined;
  oldLastname?: string | null | undefined;
  newLastname?: string | null | undefined;
  oldRewardPoint?: string | null | undefined;
  newRewardPoint?: string | null | undefined;
}
