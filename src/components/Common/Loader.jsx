// Loader.jsx
const Loader = ({ className }) => (
    <div className={`flex justify-center ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  export default Loader;
  