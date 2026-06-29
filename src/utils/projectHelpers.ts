export const getOwnerIdString = (ownerId: unknown): string => {
  if (!ownerId) return "";
  if (typeof ownerId === "string") return ownerId;
  if (typeof ownerId === "object") {
    const owner = ownerId as { _id?: { toString(): string }; id?: string };
    return owner._id?.toString() || owner.id || "";
  }
  return String(ownerId);
};
