// A simple HTML-based redirect using direct HTML content
// This doesn't rely on React rendering or client-side code at all

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/learning">
  <title>Redirecting...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      color: #334155;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.875rem;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Redirecting...</h1>
    <p>Please wait while we redirect you to the Learning Home page.</p>
  </div>
</body>
</html>
`;

export default function DynamicRedirectPage() {
  // This outputs raw HTML directly to the page
  // bypassing React's rendering system
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}