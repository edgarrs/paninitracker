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
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const newPin = typeof body.newPin === "string" ? body.newPin.trim() : "";
    const currentPin =
      typeof body.currentPin === "string" ? body.currentPin.trim() : "";

    if (!userId) {
      context.res = {
        status: 400,
        headers,
        body: { error: "userId is required." },
      };
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      context.res = {
        status: 400,
        headers,
        body: { error: "newPin must be exactly 4 digits." },
      };
      return;
    }

    await ensureTables();

    let userEntity;
    try {
      userEntity = await usersTableClient.getEntity("user", userId);
    } catch (error) {
      if (error.statusCode === 404 || error.code === "ResourceNotFound") {
        context.res = {
          status: 404,
          headers,
          body: { error: "User not found." },
        };
        return;
      }
      throw error;
    }

    // If user already has a PIN, require the current one
    if (userEntity.Pin) {
      if (currentPin !== userEntity.Pin) {
        context.res = {
          status: 403,
          headers,
          body: { error: "Current PIN is incorrect." },
        };
        return;
      }
    }

    // Update the PIN
    await usersTableClient.updateEntity(
      {
        partitionKey: "user",
        rowKey: userId,
        Pin: newPin,
      },
      "Merge"
    );

    context.res = {
      status: 200,
      headers,
      body: { success: true },
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

    context.log.error("Failed to set PIN.", error);
    context.res = {
      status: 500,
      headers,
      body: { error: "Failed to set PIN." },
    };
  }
};
