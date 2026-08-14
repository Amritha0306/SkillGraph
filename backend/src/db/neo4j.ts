import neo4j, { Driver, Session, QueryResult, Record as Neo4jRecord } from 'neo4j-driver';
import { config } from '../config/env';

class DatabaseManager {
  private driver: Driver | null = null;
  private isConnecting = false;

  public getDriver(): Driver {
    if (this.driver) {
      return this.driver;
    }

    if (!config.isDbConfigured()) {
      throw new Error(
        'CognoDB is not configured. Please provide COGNODB_URI, COGNODB_USERNAME, and COGNODB_PASSWORD in .env'
      );
    }

    try {
      // Detect if URI uses an encrypted scheme (bolt+s:// or neo4j+s://)
      const isEncrypted =
        config.cognodb.uri.startsWith('bolt+s://') ||
        config.cognodb.uri.startsWith('neo4j+s://');

      this.driver = neo4j.driver(
        config.cognodb.uri,
        neo4j.auth.basic(config.cognodb.username, config.cognodb.password),
        {
          maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
          maxConnectionPoolSize: 50,
          connectionAcquisitionTimeout: 20000, // 20 seconds
          connectionTimeout: 20000,
          disableLosslessIntegers: true, // converts neo4j Integers directly to JS numbers
          // Explicitly set TLS when using bolt+s:// or neo4j+s:// to avoid ECONNRESET on Render
          encrypted: isEncrypted ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF',
          trust: isEncrypted ? 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES' : 'TRUST_ALL_CERTIFICATES',
        }
      );
      console.log(`[CognoDB] Initialized driver connection to ${config.cognodb.uri}`);
      return this.driver;
    } catch (err: any) {
      console.error('[CognoDB] Failed to initialize Neo4j driver:', err.message);
      throw err;
    }
  }

  public async verifyConnectivity(): Promise<{ connected: boolean; message: string; details?: any }> {
    if (!config.isDbConfigured()) {
      return {
        connected: false,
        message: 'CognoDB credentials not configured in environment variables.',
      };
    }

    let session: Session | null = null;
    try {
      const driver = this.getDriver();
      session = driver.session();
      const result = await session.run('RETURN 1 AS ping, datetime() AS serverTime');
      const ping = result.records[0]?.get('ping');
      const serverTime = result.records[0]?.get('serverTime')?.toString();

      return {
        connected: ping === 1,
        message: 'Successfully connected to CognoDB Cloud via Bolt protocol.',
        details: { serverTime, uri: config.cognodb.uri }
      };
    } catch (error: any) {
      console.error('[CognoDB Connectivity Check Failed]:', error.message);
      return {
        connected: false,
        message: `Database unreachable: ${error.message}`,
        details: { code: error.code }
      };
    } finally {
      if (session) {
        await session.close();
      }
    }
  }

  public async runQuery<T = any>(
    cypher: string,
    params: Record<string, any> = {},
    database?: string
  ): Promise<Neo4jRecord[]> {
    const driver = this.getDriver();
    const session: Session = driver.session(database ? { database } : {});

    try {
      const result: QueryResult = await session.run(cypher, params);
      return result.records;
    } catch (error: any) {
      console.error('[CognoDB Query Error]:', {
        cypher: cypher.trim(),
        params,
        error: error.message,
      });
      throw error;
    } finally {
      await session.close();
    }
  }

  public async close(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
      console.log('[CognoDB] Driver connection closed cleanly.');
    }
  }
}

export const db = new DatabaseManager();
