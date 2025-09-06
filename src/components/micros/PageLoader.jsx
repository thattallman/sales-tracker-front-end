import { ThreeDots } from "react-loader-spinner";

const PageLoader = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-white">
      <ThreeDots 
        color="#000000"   // Set loader color to black
        height={100} 
        width={100} 
        strokeWidth={4} 
      />
    </div>
  );
};

export default PageLoader;
