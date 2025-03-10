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

describe("Retirement Contract", () => {
  it("retires credits", () => {
    mockContractCall.mockReturnValueOnce(ok(bool(true)))
    const result = mockContractCall("retire-credits", [uint(100)])
    expect(result).toEqual(ok(bool(true)))
    expect(mockContractCall).toHaveBeenCalledWith("retire-credits", [uint(100)])
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
  
  it("retrieves retired credits", () => {
    const retiredCredits = { amount: uint(50) }
    mockContractCall.mockReturnValueOnce(retiredCredits)
    const result = mockContractCall("get-retired-credits", [principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")])
    expect(result).toEqual(retiredCredits)
    expect(mockContractCall).toHaveBeenCalledWith("get-retired-credits", [
      principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"),
    ])
  })
})

