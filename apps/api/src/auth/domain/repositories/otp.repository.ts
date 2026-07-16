export abstract class OtpRepository {
  abstract save(email: string, otp: string): Promise<void>;

  abstract find(email: string): Promise<string | null>;

  abstract delete(email: string): Promise<void>;
}
