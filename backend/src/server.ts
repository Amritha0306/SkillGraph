import { createApp } from './app';
import { config } from './config/env';
import { db } from './db/neo4j';

const app = createApp();

const server = app.listen(config.port, async () => {
  console.log(`====================================================`);
  console.log(`🚀 SkillGraph API Server running on port ${config.port}`);
  console.log(`🌐 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API Base URL: http://localhost:${config.port}/api`);
  console.log(`====================================================`);

  // Check database connectivity on boot
  try {
    const health = await db.verifyConnectivity();
    if (health.connected) {
      console.log(` CognoDB Connected: ${health.message}`);
    } else {
      console.warn(`⚠️ CognoDB Warning: ${health.message}`);
    }
  } catch (err: any) {
    console.warn(`⚠️ CognoDB Connection Error on startup: ${err.message}`);
  }
});

// Graceful shutdown handling
const handleShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Closing SkillGraph server gracefully...`);
  server.close(async () => {
    await db.close();
    console.log('SkillGraph server shut down successfully.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
