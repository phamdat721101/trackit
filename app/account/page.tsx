const table_head = [
    'Version #',
    'Block',
    'Age',
    'Sender',
    'Receiver',
    'Fee',
    'Amount'
]

export default function AccountPage() {
    return (
        <main className="flex-grow px-20 py-8">
            <section className="flex flex-col gap-6">
                <div>
                    <div className="text-2xl leading-normal font-semibold">Account</div>
                    <div>address</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="mb-1 text-xs leading-normal font-bold text-[#76808f]">Aptos Balance</h2>
                    <div className="flex justify-between items-end">
                        <p className="text-xl font-semibold leading-6">aptBalance APT</p>
                        <p className="text-xs ">5 $</p>
                    </div>
                </div>
                <div>
                    <div className="relative flex flex-col gap-4 px-6 py-4 w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                        <h2 className="text-sm">TRANSACTIONS</h2>
                        <p className="text-sm	text-[#aeb4bc]">Latest 16 from a total of 16 transactions</p>
                        <table className="w-full text-left table-auto min-w-max">
                            <thead>
                                <tr>
                                    {table_head.map((head, index) => (

                                        <th key={index} className="p-4 border-b border-slate-300 bg-customBlue">
                                            <p className="block text-sm font-normal leading-none text-white">
                                                {head}
                                            </p>
                                        </th>

                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* {tableData?.map((token, index) => {
                                    return (
                                        <tr key={index} className="">
                                            <td className="p-4 border-b border-slate-200">
                                                <p className="block text-sm">
                                                    {token.name}
                                                </p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                                <p className="block text-sm">
                                                    {token.symbol}
                                                </p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                                <p className="block text-sm">
                                                    {Number(token.amount / 100000000).toFixed(3)}
                                                </p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                            </td>
                                        </tr>
                                    )
                                })} */}
                            </tbody>
                        </table>
                        {/* <Pagination align="center" current={currentPage} onChange={onChange} total={50} /> */}
                    </div>
                </div>
            </section>
        </main >
    );
}