export abstract class AuthCacheRepository {
  abstract saveTempPassword(
    email: string,
    hashedPassword: string,
  ): Promise<void>;

  abstract getTempPassword(email: string): Promise<string | null>;

  abstract deleteTempPassword(email: string): Promise<void>;

  abstract getSendOtpAttempts(email: string): Promise<number>;

  abstract incrementSendOtpAttempts(email: string): Promise<void>;

  abstract getVerifyOtpAttempts(email: string): Promise<number>;

  abstract incrementVerifyOtpAttempts(email: string): Promise<void>;

  abstract clearVerifyOtpAttempts(email: string): Promise<void>;
}
