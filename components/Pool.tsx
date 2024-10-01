import { format } from 'date-fns'

type Props = {
    info: {
        coin_type: string;
        name: string;
        price: number;
        change: number;
        transaction_timestamp: string;
        transaction_version_created: number;
    }
}

const Pool: React.FC<Props> = ({ info }) => {
    const formattedDate = format(new Date(info.transaction_timestamp), 'yyyy-MM-dd HH:mm:ss')
    return (
        <div className="block rounded-lg transition-colors duration-300 mt-2 ml-1 mr-2 bg-gray-800 hover:bg-gray-700">
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-6 h-6 flex-shrink-0 mr-3"></div>
                    <div>
                        <h3 className="font-semibold text-gray-50">{info.name}</h3>
                        <p className="text-sm text-gray-100">Created on {formattedDate}</p>
                        <span className="text-xs font-medium block">
                            <span className="text-gray-100">${info.price}</span>
                            <span className="ml-1 text-green-600">+{info.change}%</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pool;