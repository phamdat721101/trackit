const Price = () => {
    return (
        <div className="block rounded-lg transition-colors duration-300 mt-2 ml-1 mr-2 bg-gray-800 hover:bg-gray-700">
            <div className="p-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-gray-50">
                    <div>
                        <h3 className="font-semibold">Solana</h3>
                        <p className="text-xs text-gray-100">SOL</p>
                    </div>
                </div>
                <div className="text-right text-gray-50">
                    <p className="font-semibold">$156.73</p>
                    <p className="text-xs text-green-100">+4.09%</p>
                </div>
            </div>
            <button className="w-full text-gray-100" >Chart</button>
        </div>
    )
}

export default Price;