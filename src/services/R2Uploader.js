/**
 * Cloudflare R2 Uploader Service
 * Uploads GPX files to Cloudflare R2 storage using S3-compatible API
 */

import CryptoJS from 'crypto-js';
import { R2_CONFIG, isR2Configured } from '../config/r2Config';

/**
 * Uploads a GPX file to Cloudflare R2 storage
 * @param {string} filename - The filename to use in R2
 * @param {string} content - The GPX file content
 * @returns {Promise<boolean>} - Returns true on success, false on failure
 */
export const uploadToR2 = async (filename, content) => {
  try {
    // Validate configuration
    if (!isR2Configured()) {
      console.warn('R2 configuration not set, skipping upload');
      return false;
    }

    const endpoint = `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;
    const url = `${endpoint}/${R2_CONFIG.bucketName}/${filename}`;

    const date = new Date();
    const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    // Prepare headers
    const headers = {
      'Content-Type': 'application/gpx+xml',
      'x-amz-date': amzDate,
      'x-amz-content-sha256': CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex),
    };

    // Create canonical request
    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map((key) => `${key.toLowerCase()}:${headers[key]}`)
      .join('\n');

    const signedHeaders = Object.keys(headers)
      .sort()
      .map((key) => key.toLowerCase())
      .join(';');

    const canonicalRequest = [
      'PUT',
      `/${R2_CONFIG.bucketName}/${filename}`,
      '',
      canonicalHeaders + '\n',
      signedHeaders,
      headers['x-amz-content-sha256'],
    ].join('\n');

    // Create string to sign
    const credentialScope = `${dateStamp}/${R2_CONFIG.region}/s3/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex),
    ].join('\n');

    // Calculate signature
    const signingKey = getSignatureKey(
      R2_CONFIG.secretAccessKey,
      dateStamp,
      R2_CONFIG.region,
      's3'
    );
    const signature = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(CryptoJS.enc.Hex);

    // Create authorization header
    const authorization = `AWS4-HMAC-SHA256 Credential=${R2_CONFIG.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    // Add authorization to headers
    headers['Authorization'] = authorization;

    // Upload to R2
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: content,
    });

    if (!response.ok) {
      console.error('R2 upload failed:', response.status, response.statusText);
      return false;
    }

    console.log('Successfully uploaded to R2:', filename);
    return true;
  } catch (error) {
    // Silent failure - no user indication
    console.error('Error uploading to R2:', error);
    return false;
  }
};

/**
 * Generates AWS signature key
 */
const getSignatureKey = (key, dateStamp, regionName, serviceName) => {
  const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
  const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
  const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
  const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
  return kSigning;
};

/**
 * Silently uploads a recording to R2
 * This is a fire-and-forget operation with no user feedback
 * @param {string} filename - The filename to use
 * @param {string} content - The GPX content
 */
export const silentUploadToR2 = (filename, content) => {
  // Fire and forget - no await, no user feedback
  uploadToR2(filename, content).catch((error) => {
    // Silently log errors without showing to user
    console.error('Silent upload error:', error);
  });
};
