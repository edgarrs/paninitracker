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

async function getCollection(userId) {
  const collection = {};
  const entities = collectionTableClient.listEntities({
    queryOptions: {
      filter: `PartitionKey eq '${escapeODataValue(userId)}'`,
    },
  });

  for await (const entity of entities) {
    collection[entity.rowKey] = Number(entity.count || 0);
  }

  return collection;
}

module.exports = async function (context, req) {
  try {
    const user1 = (req.query && req.query.user1 ? req.query.user1 : "").trim();
    const user2 = (req.query && req.query.user2 ? req.query.user2 : "").trim();

    if (!user1 || !user2) {
      context.res = {
        status: 400,
        headers,
        body: { error: "user1 and user2 query parameters are required." },
      };
      return;
    }

    await ensureTables();

    const [user1Collection, user2Collection] = await Promise.all([
      getCollection(user1),
      getCollection(user2),
    ]);

    const user1Offers = Object.keys(user1Collection).filter(
      (code) => user1Collection[code] > 1 && !user2Collection[code]
    );
    const user2Offers = Object.keys(user2Collection).filter(
      (code) => user2Collection[code] > 1 && !user1Collection[code]
    );

    context.res = {
      status: 200,
      headers,
      body: { user1Offers, user2Offers },
    };
  } catch (error) {
    context.log.error("Failed to get trades.", error);
    context.res = {
      status: 500,
      headers,
      body: { error: "Failed to get trades." },
    };
  }
};
