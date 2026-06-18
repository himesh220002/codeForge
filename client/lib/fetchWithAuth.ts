export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("accessToken");
  
  // Prepare headers, injecting the token if it exists
  const headers = new Headers(options.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Attempt the request
  let res = await fetch(url, { ...options, headers });

  // If the token is invalid/expired, we get a 401
  if (res.status === 401) {
    try {
      // Attempt to refresh the token using the http-only refreshToken cookie
      const refreshRes = await fetch("/codeforge/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        
        if (data.accessToken) {
          // Save the new token
          localStorage.setItem("accessToken", data.accessToken);
          if (data.name) {
            localStorage.setItem("userName", data.name);
          }

          // Retry the original request with the new token
          headers.set("Authorization", `Bearer ${data.accessToken}`);
          res = await fetch(url, { ...options, headers });
        } else {
        // Failed to get a new access token, clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("adminUnlocked");
        localStorage.removeItem("nvidia_api_key");
        localStorage.removeItem("uploaded_pdf_text");
        localStorage.removeItem("saved_multiple_cvs");
        localStorage.removeItem("profile_history");
      } else {
        // Refresh token is expired or invalid, clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("adminUnlocked");
        localStorage.removeItem("nvidia_api_key");
        localStorage.removeItem("uploaded_pdf_text");
        localStorage.removeItem("saved_multiple_cvs");
        localStorage.removeItem("profile_history");
      }
    } catch (error) {
      console.error("Failed to refresh token", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("adminUnlocked");
      localStorage.removeItem("nvidia_api_key");
      localStorage.removeItem("uploaded_pdf_text");
      localStorage.removeItem("saved_multiple_cvs");
      localStorage.removeItem("profile_history");
    }
  }

  return res;
}
