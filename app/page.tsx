import Meme from "../components/page/Meme";
import DexList from "../components/page/Meme/DexList";

export default function Page() {
  return (
    <div className="md:flex">
      <DexList />
      <Meme />
    </div>
  );
}
