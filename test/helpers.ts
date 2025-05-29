import { Cell, beginCell, Address } from "ton-contract-executor/node_modules/ton";

export function internalMessage(from: Address, to: Address, body: Cell): Cell {
    return beginCell()
        .storeUint(0, 1) // internal message
        .storeUint(1, 1) // IHR disabled
        .storeUint(1, 1) // bounce
        .storeUint(0, 1) // bounced
        .storeAddress(from)
        .storeAddress(to)
        .storeCoins(0)
        .storeUint(0, 1) // no extra currencies
        .storeCoins(0) // IHR fee
        .storeCoins(0) // forward fee
        .storeUint(0, 64) // created_lt
        .storeUint(0, 32) // created_at
        .storeUint(0, 1) // no init
        .storeUint(1, 1) // body as ref
        .storeRef(body)
        .endCell();
}

export function randomAddress(seed: string): Address {
    const hash = Buffer.alloc(32);
    for (let i = 0; i < seed.length && i < 32; i++) {
        hash[i] = seed.charCodeAt(i);
    }
    return new Address(0, hash);
} 