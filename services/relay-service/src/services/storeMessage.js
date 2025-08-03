import { Message } from "../models/message.model.js";
import { assert, BadRequestError } from "../../shared/utils/httpErrors.js";
export async function handleMessage(payload) {
  try {
    assert(
      payload && payload.to && payload.message && payload.from,
      BadRequestError,
      "provide required fields to the json"
    );
    await Message.create(payload);
    console.log("The message is store in to the db");
  } catch (err) {
    console.log("something went wrong", err);
    throw err;
  }
}
