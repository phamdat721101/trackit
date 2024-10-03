type Props = {
    info: {
        name: string;
        symbol: string;
        price: number;
        change: number;
    }
}

const Price: React.FC<Props> = ({ info }) => {
    return (
        <div className="block rounded-lg transition-colors duration-300 mt-2 ml-1 mr-2 bg-gray-800 hover:bg-gray-700">
            <div className="p-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-gray-50">
                    <div>
                        <h3 className="font-semibold">{info.name}</h3>
                        <p className="text-xs text-gray-100">{info.symbol}</p>
                    </div>
                </div>
                <div className="text-right text-gray-50">
                    <p className="font-semibold">${info.price}</p>
                    <p className="text-xs text-green-100">{info.change}%</p>
                </div>
            </div>
            <button className="w-full text-gray-100" >Chart</button>
        </div>
    )
}

export default Price;