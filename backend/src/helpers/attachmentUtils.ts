import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoStorage {

    s3Client: AWS.S3;
    s3BucketName: string;
    signedUrlExpiration: number;

    constructor() {
        this.s3Client = new XAWS.S3({ signatureVersion: 'v4' });
        this.s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
        this.signedUrlExpiration = Number(process.env.SIGNED_URL_EXPIRATION);
    }

    async getAttachmentUrl(attachmentId: string): Promise<string> {
        const attachmentUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${attachmentId}`
        return attachmentUrl;
    }

    async getSignedUploadUrl(attachmentId: string): Promise<string> {
        const uploadUrl = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: attachmentId,
            Expires: this.signedUrlExpiration
        })
        return uploadUrl;
    }
}