import {
    Injectable,
    InternalServerErrorException,
    Logger,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { S3 } from 'aws-sdk';
  import { v4 as uuid } from 'uuid';
  import * as path from 'path';




  @Injectable()
  export class S3Service {
    private readonly logger = new Logger(S3Service.name);
    private readonly s3: S3;
    private readonly bucket: string;
  
    constructor(private readonly configService: ConfigService) {
        
      this.bucket = this.configService.get<string>('AWS_BUCKET_NAME');

  
      if (!this.bucket) {
        this.logger.warn(
          '⚠️ AWS_BUCKET_NAME is not defined. Check your .env file or ConfigModule setup.'
        );
      }
  
      this.s3 = new S3({
        region: this.configService.get<string>('AWS_REGION'),
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      });
    }
  
    async uploadFile(file: Express.Multer.File): Promise<string> {

      try {
        const fileExt = path.extname(file.originalname);
        const fileName = `${uuid()}${fileExt}`;
  
        const uploadResult = await this.s3
          .upload({
            Bucket: this.bucket,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
          .promise();
  
        return uploadResult.Location;
      } catch (error) {
        this.logger.error('Failed to upload file to S3', error);
        throw new InternalServerErrorException('Error uploading file');
      }
    }
  
    async deleteFile(fileKey: string): Promise<void> {
      try {
        await this.s3
          .deleteObject({
            Bucket: this.bucket,
            Key: fileKey,
          })
          .promise();
      } catch (error) {
        this.logger.error('Failed to delete file from S3', error);
        throw new InternalServerErrorException('Error deleting file');
      }
    }
  }
  