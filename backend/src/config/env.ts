import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root or current directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cognodb: {
    uri: process.env.COGNODB_URI || '',
    username: process.env.COGNODB_USERNAME || '',
    password: process.env.COGNODB_PASSWORD || '',
  },
  isDbConfigured(): boolean {
    return Boolean(this.cognodb.uri && this.cognodb.username && this.cognodb.password);
  }
};
