import { describe, expect, it } from "vitest";
import { groupStatuses } from ".";

describe("groupStatuses", () => {
  it("keeps the persisted group status order", () => {
    expect(groupStatuses).toEqual(["OPEN", "CLOSED", "DRAWN"]);
  });
});
