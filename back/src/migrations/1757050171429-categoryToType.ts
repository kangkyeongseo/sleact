import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoryToType1757050171429 implements MigrationInterface {
  name = 'categoryToType1757050171429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `mentions` RENAME COLUMN `category` To `type`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `mentions` RENAME COLUMN `type` To `category`');
  }
}
