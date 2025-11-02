const PageNotFound = () => {
  return (
    <div className="h-screen bg-[#101828] flex flex-col items-center justify-center text-white text-center">
      <h1 className="text-9xl font-extrabold text-blue-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-sm">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Go Home
      </a>
    </div>
  );
};

export default PageNotFound;
