const PRIVATE_IPV4_RANGES = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./
];

const PRIVATE_HOSTS = new Set(["localhost", "0.0.0.0", "::1", "[::1]"]);

export function localNetworkOnlyEnabled(): boolean {
  return process.env.LOCAL_NETWORK_ONLY !== "false";
}

export function isPrivateHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase().replace(/^\[/, "").replace(/\]$/, "");

  if (PRIVATE_HOSTS.has(normalized) || normalized.endsWith(".local")) {
    return true;
  }

  if (PRIVATE_IPV4_RANGES.some((range) => range.test(normalized))) {
    return true;
  }

  if (normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:")) {
    return true;
  }

  return false;
}

export function isAllowedLocalOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  try {
    return isPrivateHostname(new URL(origin).hostname);
  } catch {
    return false;
  }
}

export function configuredSocketOrigins(): string[] | boolean {
  const configured = process.env.SOCKET_CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean);

  if (configured?.length) {
    return configured;
  }

  return localNetworkOnlyEnabled() ? true : ["http://localhost:3000"];
}
