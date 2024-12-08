import DexList from "../components/layout/DexList";
import Meme from "../components/page/Meme";

export default function Page() {
  return (
    <div className="md:flex">
      <DexList />
      <Meme />
    </div>
  );
}
