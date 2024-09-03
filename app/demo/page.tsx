import Image from "next/image";

export default function Page() {
    return (
        <main className="grid grid-cols-4 gap-3 p-3">
            <div className="col-span-1 border">
                <div className="p-4 flex justify-between items-center border-b text-xs">
                    <h3>Project</h3>
                    <button>Hide</button>
                </div>
                <div className="p-4 border-b text-xs">
                    <input
                        type="text" name="search" id="search" placeholder="Search"
                        className="w-full p-2 border"
                    />
                </div>
                <div className="p-4 flex flex-col gap-4">
                    <div>Token 1</div>
                    <div>Token 2</div>
                    <div>Token 3</div>
                    <div>Token 4</div>
                </div>
            </div>
            <div className="col-span-3 grid gap-3">
                <div className="border">
                    <div className="p-4 flex items-center gap-4 border-b text-xs">
                        <div>Project</div>
                        <div>{">"}</div>
                        <div>{"Token"}</div>
                    </div>
                    <div className="grid grid-cols-10 py-4">
                        <div className="px-4 col-span-2 border-r flex gap-4">
                            <Image src={""} alt="Logo" sizes="54" />
                            <div className="text-xs">
                                <div>TOKEN (TOKEN)</div>
                                <div>Exchanges (DEX)</div>
                            </div>
                        </div>
                        <div className="col-span-3 border-r flex">
                            <div className="px-4 flex flex-col gap-1 text-xs leading-loose border-r">
                                <h3>Price</h3>
                                <p>~$0.0301</p>
                                <p>Live</p>
                            </div>
                            <div className="px-4 flex flex-col gap-1 text-xs leading-loose border-r">
                                <h3>ATH</h3>
                                <p>$50.01</p>
                                <p>3.4y ago</p>
                            </div>
                            <div className="px-4 flex flex-col gap-1 text-xs leading-loose ">
                                <h3>ATL</h3>
                                <p>$0.00</p>
                                <p>1.8y ago</p>
                            </div>
                        </div>
                        <div className="px-4 col-span-5 overflow-x-scroll flex gap-4">
                            <div>
                                <div className="flex gap-2 text-xs leading-loose ">
                                    <div>7d price</div>
                                    <div>+30.7%</div>
                                </div>
                                <Image src={""} alt="Chart" />
                            </div>
                            <div>
                                <div className="flex gap-2 text-xs leading-loose ">
                                    <div>30d price</div>
                                    <div>+191.9%</div>
                                </div>
                                <Image src={""} alt="Chart" />
                            </div>
                            <div>
                                <div className="flex gap-2 text-xs leading-loose ">
                                    <div>90d price</div>
                                    <div>+145.9%</div>
                                </div>
                                <Image src={""} alt="Chart" />
                            </div>
                            <div>
                                <div className="flex gap-2 text-xs leading-loose ">
                                    <div>180d price</div>
                                    <div>+157.7%</div>
                                </div>
                                <Image src={""} alt="Chart" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border">
                    <div className="p-4 flex items-center gap-4 border-b text-xs">
                        Key metrics
                    </div>
                    <div className="p-4">
                        Content
                    </div>
                </div>
                <div className="border h-20">Chart</div>
            </div>
        </main>
    );
}