/**
 * Cloudflare R2 Configuration
 *
 * To enable R2 uploads, set these values:
 * 1. Create a Cloudflare R2 bucket
 * 2. Generate API tokens with write permissions
 * 3. Update the values below or set environment variables
 *
 * Environment variables (recommended for production):
 * - R2_ACCOUNT_ID: Your Cloudflare account ID
 * - R2_ACCESS_KEY_ID: R2 API token access key
 * - R2_SECRET_ACCESS_KEY: R2 API token secret key
 * - R2_BUCKET_NAME: The name of your R2 bucket
 */

export const R2_CONFIG = {
  // Cloudflare account ID (found in R2 dashboard)
  accountId: process.env.R2_ACCOUNT_ID || '',

  // R2 API token credentials
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',

  // R2 bucket name
  bucketName: process.env.R2_BUCKET_NAME || 'snowtrails-recordings',

  // Region (always 'auto' for R2)
  region: 'auto',
};

/**
 * Check if R2 is properly configured
 * @returns {boolean} True if all required config values are set
 */
export const isR2Configured = () => {
  return !!(
    R2_CONFIG.accountId &&
    R2_CONFIG.accessKeyId &&
    R2_CONFIG.secretAccessKey &&
    R2_CONFIG.bucketName
  );
};
