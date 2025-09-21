async function apiRequest(options) {

  // Destructing the options object to get the endpoint, method, include Auth and Body
  const {
    endpoint,
    method = "GET",
    includeAuth = true,
    body = undefined,
  } = options;

  // create a new Headers Object
  const headers = new Headers();

  let requestBody = body;

  // if the body is an object,set the "Content-Type" header to "application/json" and stringify the body
  // console.log(typeof body);
  
  if(body && typeof body === "object"){
    headers.append("Content-Type","application/json");
    requestBody = JSON.stringify(requestBody);
  }

  // if includeAuth is true and there is an access token in LocalStorage, append in "Authorization header with access token"
  
  if(includeAuth && localStorage.getItem("accessToken")){
    headers.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
  }

  // create a new URL object with base url URL from the environment variables and the endpoints
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const url = new URL(endpoint, baseUrl);

  // Make a fetch Request to the API endpoint with specific methos,headres and body

  const response = await fetch(url,{
    method,
    headers,
    body : requestBody,
  });

  // Return the response from API
  return response;
}

export default apiRequest;

