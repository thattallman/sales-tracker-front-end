const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 text-center px-4">
      <h1 className="text-7xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2">
        The page you are looking for might have been removed or does not exist.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition duration-300 ease-in-out"
      >
        Go to Home Page
      </a>
    </div>
  );
};

export default PageNotFound;
