export const safeRandomId = (): string => {
  // Browser may not support crypto.randomUUID (older environments) or may block crypto access.
  try {
    const maybeCrypto = globalThis.crypto as Crypto | undefined;
    const uuidFn = maybeCrypto?.randomUUID;
    if (typeof uuidFn === "function") return uuidFn.call(maybeCrypto);
  } catch {
    // ignore and fallback
  }
  // Fallback: good enough for local prototype identifiers.
  return `${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
};

