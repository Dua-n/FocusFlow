"use client";
import Form from "@/components/Form";
import Notice from "@/components/Notice";
import { ModeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function Home() {
    const [weblnEnabled, setWebLnEnabled] = useState<"loading" | boolean>(
        "loading",
    );

    useEffect(() => {
        setWebLnEnabled(typeof window.webln !== "undefined");
    }, []);

    return (
        <main className="flex min-h-screen flex-col">
            <div className="flex justify-end p-2 border-b border-border">
                <ModeToggle />
            </div>
            {typeof weblnEnabled === "string" ? (
                <div className="flex items-center justify-center p-4 grow">
                    <div className="flex flex-col gap-4">
                        <Skeleton className="w-[280px] h-[24px]"></Skeleton>
                        <Skeleton className="w-[280px] h-[24px]"></Skeleton>
                        <Skeleton className="w-[280px] h-[24px]"></Skeleton>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center p-4 grow">
                    {weblnEnabled ? <Form /> : <Notice />}
                </div>
            )}
        </main>
    );
}

// TODOs:

// 1. Detect WebLN ✅
// 2. Form with:
//         a. toggle "Send To" / "Receive From" ✅
//         b. Dropdown select "USDCETH"/"USDTETH"/"USDCTRX"/"USDTTRX" ✅
//         c. Input for amount ✅
//         d. Input for address (Only on send to) ✅

// 3. Camera button, opens a camera to read a QR code, which will populate the form fields instead


// API Flow (just do send for now)

// 1. User selects currency -> hit /exchange-rate , returns min and max amounts for amount field
// 2. User inputs amount and destination address
// 3. User clicks send -> hit create order, returns the lightning invoice to send to, pass that into webln.sendPayment

// what send looks like for send 5 USD to USDC from  Lightning

// -d '{"fromCcy":"BTCLN","toCcy":"USDCETH","amount":5,direction":"to","type":"fixed","toAddress":"your_metamask_address"}'


// convert this to javascript:

// import hmac
// import json
// import hashlib
// import requests

// def sign(data):
//   return hmac.new(
//     key=YOUR_API_SECRET.encode(),
//     msg=data.encode(),
//     digestmod=hashlib.sha256
//   ).hexdigest()


// def request(method, params={}):
//   url = 'https://ff.io/api/v2/' + method
//   data = json.dumps(params)
//   headers = {
//     'X-API-KEY': YOUR_API_KEY,
//     'X-API-SIGN': sign(data)
//   }
//   r = requests.post(url, data=data, headers=headers)
//   return r.json()

// request(METHOD, DATA)


// ethereum:0xCONTRACT_ADDRESS/transfer?address=0xRECIPIENT_ADDRESS&uint256=1

// const currenciesData = [
//   {
//     code: "USDCETH",
//     contract_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//     logo: "https://fixedfloat.com/assets/images/coins/svg/usdceth.svg",
//     name: "USDCETH",
//     network: "ETH",
//   },
//   {
//     code: "USDCTRC",
//     contract_address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
//     logo: "https://fixedfloat.com/assets/images/coins/svg/usdctrc.svg",
//     name: "USDCTRC",
//     network: "TRX",
//   },
//   {
//     code: "USDT",
//     contract_address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
//     logo: "https://fixedfloat.com/assets/images/coins/svg/usdt.svg",
//     name: "USDTETH",
//     network: "ETH",
//   },
//   {
//     code: "USDTTRC",
//     contract_address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
//     logo: "https://fixedfloat.com/assets/images/coins/svg/usdttrc.svg",
//     name: "USDTTRC",
//     network: "TRX",
//   },
// ];