import {S3Client,PutObjectCommand,GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import sharp from 'sharp';
const bucketAccessFile = process.env.BUCKET_ACCESS_FILE;
const credentialsFile = JSON.parse(fs.readFileSync(bucketAccessFile, 'utf8'));
const credentials = {
    accessKeyId: credentialsFile.accessKeyId,
    secretAccessKey: credentialsFile.secretAccessKey,
  };
const region = process.env.REGION;
const bucketName = process.env.BUCKET_NAME;
const s3 = new S3Client({ region:'il-central-1', credentials:credentials });

const uploadProfilePic = async (file) => {
    const buffer = await sharp(file.buffer).resize({width:500,fit:'contain'}).toBuffer();
    const params = {
        Bucket: bucketName,
        Key: `profilePics/${file.originalname}`,
        Body: buffer,
        ContentType: file.mimetype,
        LocationConstraint: region,
    };
    const command = new PutObjectCommand(params);
    try{
    await s3.send(command);
    }catch(error){
        console.log("error in upload file",error);
    }
}
const getProfilePicUrl = async (fileName) => {
    if(!fileName) return "";
    const params = {
        Bucket: bucketName,
        Key: `profilePics/${fileName}`,
        Expires: 60 * 60 * 24 * 7,
    };
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 * 7 });
    return signedUrl;
}
export default {uploadProfilePic,getProfilePicUrl};