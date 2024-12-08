import { MigrationInterface, QueryRunner } from 'typeorm';
import { TableName } from '../table.enum';

export class CreateTableUser1729850055999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public.${TableName.USER} (
            user_id UUID DEFAULT gen_random_uuid(),
            firstname VARCHAR(200),
            lastname VARCHAR(200),
            email VARCHAR(200),
            phone_number VARCHAR(10),
            password VARCHAR(200),
            reward_point INT8,
            created_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
            created_by UUID,
            updated_date TIMESTAMP WITH TIME ZONE,
            updated_by UUID,
            deleted_date TIMESTAMP WITH TIME ZONE,
            deleted_by UUID,
            remarks TEXT,
            CONSTRAINT ${TableName.USER}_pkey PRIMARY KEY (user_id)
        );
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION notify_user_data_change() 
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          PERFORM pg_notify('user_notify_channal', 
            json_build_object(
              'operation', 'INSERT', 
              'userId', NEW.user_id,
              'newFirstname', NEW.firstname,
              'newLastname', NEW.lastname,
              'newRewardPoint', NEW.reward_point
            )::text
          );
        ELSIF TG_OP = 'UPDATE' THEN
          PERFORM pg_notify('user_notify_channal', 
            json_build_object(
              'operation', 'UPDATE', 
              'userId', NEW.user_id,
              'oldFirstname', OLD.firstname,
              'newFirstname', NEW.firstname,
              'oldLastname', OLD.lastname,
              'newLastname', NEW.lastname,
              'oldRewardPoint', OLD.reward_point,
              'newRewardPoint', NEW.reward_point
            )::text
          );
        ELSIF TG_OP = 'DELETE' THEN
          PERFORM pg_notify('user_notify_channal', 
            json_build_object(
              'operation', 'DELETE', 
              'userId', OLD.user_id, 
              'oldFirstname', OLD.firstname,
              'oldLastname', OLD.lastname,
              'oldRewardPoint', OLD.reward_point
            )::text
          );
        END IF;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER user_change_notify_trigger
      AFTER INSERT OR UPDATE OR DELETE ON public.${TableName.USER}
      FOR EACH ROW
      EXECUTE FUNCTION notify_user_data_change();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS user_change_notify_trigger ON public.${TableName.USER};`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS notify_user_data_change();`);
    await queryRunner.dropTable(TableName.USER, true);
  }
}
