const crypto = require("node:crypto");
const { usersTableClient, ensureTables } = require("../shared/tableClient");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  }

  return body;
}

module.exports = async function (context, req) {
  try {
    const body = parseBody(req.body);
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      context.res = {
        status: 400,
        headers,
        body: { error: "A name is required." },
      };
      return;
    }

    await ensureTables();

    const id = crypto.randomUUID();
    await usersTableClient.createEntity({
      partitionKey: "user",
      rowKey: id,
      Name: name,
    });

    context.res = {
      status: 201,
      headers,
      body: { id, name },
    };
  } catch (error) {
    if (error.statusCode === 400) {
      context.res = {
        status: 400,
        headers,
        body: { error: "Request body must be valid JSON." },
      };
      return;
    }

    context.log.error("Failed to create user.", error);
    context.res = {
      status: 500,
      headers,
      body: { error: "Failed to create user." },
    };
  }
};
