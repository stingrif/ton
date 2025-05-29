import { Cell, beginCell, Address } from "ton-contract-executor/node_modules/ton";

// Operation codes based on imports/constants.fc
const OP_CODES = {
  increment: 1,
  deposit: 2,
  withdraw: 3,
  transfer_ownership: 4
};

export function data(params: { ownerAddress: Address, counter: number }): Cell {
  return beginCell()
    .storeAddress(params.ownerAddress)
    .storeUint(params.counter, 64)
    .endCell();
}

export function increment(params: { queryId?: number } = {}): Cell {
  return beginCell()
    .storeUint(OP_CODES.increment, 32)
    .storeUint(params.queryId || 0, 64)
    .endCell();
}

export function deposit(params: { queryId?: number } = {}): Cell {
  return beginCell()
    .storeUint(OP_CODES.deposit, 32)
    .storeUint(params.queryId || 0, 64)
    .endCell();
}

export function withdraw(params: { queryId?: number, withdrawAmount: number }): Cell {
  return beginCell()
    .storeUint(OP_CODES.withdraw, 32)
    .storeUint(params.queryId || 0, 64)
    .storeCoins(params.withdrawAmount)
    .endCell();
}

export function transferOwnership(params: { queryId?: number, newOwnerAddress: Address }): Cell {
  return beginCell()
    .storeUint(OP_CODES.transfer_ownership, 32)
    .storeUint(params.queryId || 0, 64)
    .storeAddress(params.newOwnerAddress)
    .endCell();
} 