import { Button } from "@/components/ui/button";
import { TokenInputForm } from "@/types/interface";
import { Search, Calendar, ArrowRight, Loader } from "lucide-react";

interface TokenAnalysisFormProps {
  onAnalyze: () => void;
  input: TokenInputForm;
  setInput: React.Dispatch<React.SetStateAction<TokenInputForm>>;
  loading: boolean;
}

export const TokenAnalysisForm = ({
  onAnalyze,
  input,
  setInput,
  loading,
}: TokenAnalysisFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl overflow-hidden p-6 transition-all duration-300 hover:shadow-lg border border-bluesky">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="col-span-1 md:col-span-4 space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Token Address
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800" />
              <input
                type="text"
                value={input.tokenAddress}
                onChange={(e) =>
                  setInput({ ...input, tokenAddress: e.target.value })
                }
                className="w-full py-2.5 pl-10 pr-4 rounded-lg text-sm focus:ring-1 focus:ring-crypto-blue/30 text-gray-800"
                placeholder="0x1::aptos_coin::AptosCoin"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Analysis Period (Days)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800" />
              <input
                type="number"
                value={input.days}
                onChange={(e) =>
                  setInput({ ...input, days: Number(e.target.value) })
                }
                className="w-full py-2.5 pl-10 pr-4 rounded-lg text-sm focus:ring-1 focus:ring-crypto-blue/30 text-gray-800"
                min="1"
                max="365"
              />
            </div>
          </div>

          <div className="col-span-1 flex items-end">
            <Button
              type="submit"
              disabled={loading}
              variant="outline"
              className={`w-32 px-2 flex items-center bg-transparent bg-bluesky hover:bg-bluesky/80 text-gray-50 hover:text-gray-50 border border-bluesky`}
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <Loader className="animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                <span>{loading ? "Analyzing..." : "Analyze"}</span>
              </div>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
