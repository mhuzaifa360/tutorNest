function PageContainer({ children, className = "" }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-8 pb-24 sm:px-6 lg:px-8 ${className}`}>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

export default PageContainer;
