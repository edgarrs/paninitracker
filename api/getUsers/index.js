const { usersTableClient, ensureTables } = require("../shared/tableClient");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

module.exports = async function (context, req) {
  try {
    await ensureTables();

    const users = [];
    const entities = usersTableClient.listEntities({
      queryOptions: {
        filter: "PartitionKey eq 'user'",
      },
    });

    for await (const entity of entities) {
      users.push({
        id: entity.rowKey,
        name: entity.Name || entity.name || "",
      });
    }

    context.res = {
      status: 200,
      headers,
      body: { users },
    };
  } catch (error) {
    context.log.error("Failed to get users.", error);
    context.res = {
      status: 500,
      headers,
      body: { error: "Failed to get users." },
    };
  }
};
