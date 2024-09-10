import { API_V1 } from "./constants";

export async function safeFetch<T>(
  path: string,
  noop: T,
  headers?: HeadersInit
): Promise<T> {
  try {
    const res = await fetch(`${API_V1}${path}`, {
      headers: headers || {},
    });
    if (!res.ok) {
      return noop;
    }

    return res.json();
  } catch (error) {
    return noop;
  }
}

export const fetchAuth = async (
  request: {
    url: RequestInfo | URL;
    init?: RequestInit | undefined;
    fullpath?: string;
  },
  headersOrJwt: HeadersInit | string
) => {
  if (!headersOrJwt) {
    throw Error("Login required");
  }

  return fetch(request?.fullpath || API_V1.concat(request?.url?.toString()), {
    ...request?.init,
    headers:
      typeof headersOrJwt !== "string"
        ? headersOrJwt
        : {
            Authorization: `Bearer ${headersOrJwt}`,
            "Content-Type": "application/json",
          },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error: ", error);
    });
};
