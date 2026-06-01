const { TableClient, TableServiceClient } = require("@azure/data-tables");

const connectionString =
  process.env.AZURE_STORAGE_CONNECTION_STRING || "UseDevelopmentStorage=true";

const USERS_TABLE_NAME = "users";
const COLLECTION_TABLE_NAME = "collection";

const serviceClient = TableServiceClient.fromConnectionString(connectionString);
const usersTableClient = TableClient.fromConnectionString(
  connectionString,
  USERS_TABLE_NAME
);
const collectionTableClient = TableClient.fromConnectionString(
  connectionString,
  COLLECTION_TABLE_NAME
);

let ensureTablesPromise;

async function ensureTable(tableName) {
  try {
    await serviceClient.createTable(tableName);
  } catch (error) {
    if (error.statusCode !== 409 && error.code !== "TableAlreadyExists") {
      throw error;
    }
  }
}

async function ensureTables() {
  if (!ensureTablesPromise) {
    ensureTablesPromise = (async () => {
      await ensureTable(USERS_TABLE_NAME);
      await ensureTable(COLLECTION_TABLE_NAME);
    })().catch((error) => {
      ensureTablesPromise = undefined;
      throw error;
    });
  }

  return ensureTablesPromise;
}

module.exports = {
  usersTableClient,
  collectionTableClient,
  ensureTables,
};
