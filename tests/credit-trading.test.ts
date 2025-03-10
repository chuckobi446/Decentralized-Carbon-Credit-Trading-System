import { describe, it, expect, vi } from "vitest"

// Mock Clarity values and functions
const mockClarityValue = (type: string, value: any) => ({ type, value })
const uint = (value: number) => mockClarityValue("uint", value)
const bool = (value: boolean) => mockClarityValue("bool", value)
const principal = (value: string) => mockClarityValue("principal", value)
const ok = (value: any) => ({ type: "response", value: { type: "ok", value } })
const err = (value: any) => ({ type: "response", value: { type: "err", value } })

// Mock contract calls
const mockContractCall = vi.fn()

describe("Credit Trading Contract", () => {
  it("creates a sell order", () => {
    mockContractCall.mockReturnValueOnce(ok(uint(1)))
    const result = mockContractCall("create-sell-order", [uint(100), uint(50)])
    expect(result).toEqual(ok(uint(1)))
    expect(mockContractCall).toHaveBeenCalledWith("create-sell-order", [uint(100), uint(50)])
  })
  
  it("buys credits from an order", () => {
    mockContractCall.mockReturnValueOnce(ok(bool(true)))
    const result = mockContractCall("buy-credits", [uint(1)])
    expect(result).toEqual(ok(bool(true)))
    expect(mockContractCall).toHaveBeenCalledWith("buy-credits", [uint(1)])
  })
  
  it("retrieves credit balance", () => {
    const balance = { balance: uint(100) }
    mockContractCall.mockReturnValueOnce(balance)
    const result = mockContractCall("get-credit-balance", [principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")])
    expect(result).toEqual(balance)
    expect(mockContractCall).toHaveBeenCalledWith("get-credit-balance", [
      principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"),
    ])
  })
  
  it("retrieves order details", () => {
    const orderDetails = {
      seller: principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"),
      amount: uint(100),
      price: uint(50),
    }
    mockContractCall.mockReturnValueOnce(orderDetails)
    const result = mockContractCall("get-order", [uint(1)])
    expect(result).toEqual(orderDetails)
    expect(mockContractCall).toHaveBeenCalledWith("get-order", [uint(1)])
  })
})

