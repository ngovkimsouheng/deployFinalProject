
export const notfoundComponent = () => {
  return `
    <div class="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <h1 class="text-9xl font-extrabold text-teal-800 select-none">404</h1>
      <h2 class="text-4xl font-bold text-secondary mt-4">Page Not Found</h2>
      <p class="text-gray-600 mt-2 max-w-md text-center">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <a
        href="./desti.html"
        class="mt-6 inline-block px-6 py-3 bg-teal-900 text-white font-semibold rounded-lg hover:bg-green-800 transition"
      >
        Go Back 
      </a>
    </div>
  `;
};
