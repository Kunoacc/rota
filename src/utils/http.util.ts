interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

const BASE_PATH = `https://clava.io/api`

export async function http<T>(
  path: RequestInfo
): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch( `${BASE_PATH}/${path}`,{
    credentials: 'omit',
    method: 'GET',
    cache: 'no-cache'
  });

  if (!response.ok || response.status !== 200) {
    throw new Error(response.statusText)
  } else {
    response.parsedBody = await response.json();
  }

  return response;
}