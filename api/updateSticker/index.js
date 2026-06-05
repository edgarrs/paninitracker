const {
  collectionTableClient,
  usersTableClient,
  ensureTables,
} = require("../shared/tableClient");

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

async function getStickerEntity(userId, stickerCode) {
  try {
    return await collectionTableClient.getEntity(userId, stickerCode);
  } catch (error) {
    if (error.statusCode === 404 || error.code === "ResourceNotFound") {
      return null;
    }

    throw error;
  }
}

module.exports = async function (context, req) {
  try {
    const body = parseBody(req.body);
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const stickerCode =
      typeof body.stickerCode === "string" ? body.stickerCode.trim() : "";
    const action = typeof body.action === "string" ? body.action.trim() : "";

    if (!userId || !stickerCode || !action) {
      context.res = {
        status: 400,
        headers,
        body: {
          error: "userId, stickerCode, and action are required.",
        },
      };
      return;
    }

    if (action !== "add" && action !== "remove") {
      context.res = {
        status: 400,
        headers,
        body: { error: 'action must be "add" or "remove".' },
      };
      return;
    }

    await ensureTables();

    // Validate PIN if the user has one set
    try {
      const userEntity = await usersTableClient.getEntity("user", userId);
      if (userEntity.Pin) {
        const pin = typeof body.pin === "string" ? body.pin.trim() : "";
        if (pin !== userEntity.Pin) {
          context.res = {
            status: 403,
            headers,
            body: { error: "Invalid PIN." },
          };
          return;
        }
      }
    } catch (error) {
      if (error.statusCode === 404 || error.code === "ResourceNotFound") {
        // User not found in table — allow operation (local-only users)
      } else {
        throw error;
      }
    }

    const existing = await getStickerEntity(userId, stickerCode);

    if (action === "add") {
      const count = Number(existing && existing.count ? existing.count : 0) + 1;
      await collectionTableClient.upsertEntity(
        {
          partitionKey: userId,
          rowKey: stickerCode,
          count,
        },
        "Replace"
      );

      context.res = {
        status: 200,
        headers,
        body: { stickerCode, count },
      };
      return;
    }

    if (!existing) {
      context.res = {
        status: 404,
        headers,
        body: { error: "Sticker not found in collection." },
      };
      return;
    }

    const nextCount = Number(existing.count || 0) - 1;

    if (nextCount <= 0) {
      await collectionTableClient.deleteEntity(userId, stickerCode);
      context.res = {
        status: 200,
        headers,
        body: { stickerCode, count: 0 },
      };
      return;
    }

    await collectionTableClient.upsertEntity(
      {
        partitionKey: userId,
        rowKey: stickerCode,
        count: nextCount,
      },
      "Replace"
    );

    context.res = {
      status: 200,
      headers,
      body: { stickerCode, count: nextCount },
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

    context.log.error("Failed to update sticker.", error);
    context.res = {
      status: 500,
      headers,
      body: { error: "Failed to update sticker." },
    };
  }
};
