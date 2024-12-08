import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class ValidateEnvDto {
  @IsString()
  API_ENDPOINT: string;

  @IsString()
  API_PORT: string;

  @IsString()
  API_ENV_MODE: string;

  @IsString()
  PG_DB_HOST: string;

  @IsString()
  PG_DB_PORT: string;

  @IsString()
  PG_DB_NAME: string;

  @IsString()
  PG_DB_USERNAME: string;

  @IsString()
  PG_DB_PASSWORD: string;
}

export function validateEnv(config: Record<string, unknown>): ValidateEnvDto {
  const validatedConfig = plainToInstance(ValidateEnvDto, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
