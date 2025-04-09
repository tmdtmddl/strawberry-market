import { GiStrawberry } from "react-icons/gi";

const SplashScreen = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center text-pink-500 gap-2.5 animate-pulse bg-white">
      <GiStrawberry className="text-6xl" />
      <h1 className="text-2xl font-black">딸기마켓</h1>
    </div>
  );
};

export default SplashScreen;
