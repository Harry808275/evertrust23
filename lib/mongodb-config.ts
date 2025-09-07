export const mongodbConfig = {
  development: {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    bufferCommands: true
  },
  production: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    bufferCommands: false
  }
};

export function getMongoConfig() {
  const env = process.env.NODE_ENV || 'development';
  return mongodbConfig[env as keyof typeof mongodbConfig] || mongodbConfig.development;
}
