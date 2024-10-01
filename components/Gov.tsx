import { Progress } from "./ui/Progress";

const Governance = () => {
    return (
        <div className="p-4 block rounded-lg transition-colors duration-300 mt-2 ml-1 mr-2 bg-gray-800 hover:bg-gray-700 text-gray-100">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Proposal Id</h3>
                <p className="text-sm text-gray-100">#106</p>
            </div>
            {/* <p className="text-sm">[Non-Constitutional] Arbitrum DAO Delegate Incentive Program</p> */}
            <div className="flex justify-between text-sm mt-2">
                <span>Votes</span>
                <span>FOR - DIP V1.5</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>121.4M (3329 Voters)</span>
                <span>87.2M</span>
            </div>
            <Progress value={72} className="mt-2" />
            <div className="flex justify-between text-sm mt-2">
                <span>Quorum</span>
                <span>Progress</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>121.4M</span>
                <Progress value={20} className="w-24" />
            </div>
        </div>
    );
};

export default Governance;