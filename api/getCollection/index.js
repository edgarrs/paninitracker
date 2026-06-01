const {
  collectionTableClient,
  ensureTables,
} = require("../shared/tableClient");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function escapeODataValue(value) {
  return String(value).replace(/'/g, "''");
}

module.exports = async function (context, req) {
  try {
    const userId = (req.query && req.query.userId ? req.query.userId : "").trim();

    if (!userId) {
      context.res = {
        status: 400,
        headers,
        body: { error: "A userId query parameter is required." },
      };
      return;
    }

    await ensureTables();

    const collection = {};
    const entities = collectionTableClient.listEntities({
      queryOptions: {
        filter: `PartitionKey eq '${escapeODataValue(userId)}'`,
      },
    });

    for await (const entity of entities) {
      collection[entity.rowKey] = Number(entity.count || 0);
    }

    context.res = {
      status: 200,
      headers,
      body: { collection },
    };
  } catch (error) {
    context.log.error("Failed to get collection.", error);
    context.res = {
      status: 500,
      headers,
      body: { error: "Failed to get collection." },
    };
  }
};
