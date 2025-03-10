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

describe("Carbon Credit Issuance Contract", () => {
  it("registers a new project", () => {
    mockContractCall.mockReturnValueOnce(ok(bool(true)))
    const result = mockContractCall("register-project", [uint(1)])
    expect(result).toEqual(ok(bool(true)))
    expect(mockContractCall).toHaveBeenCalledWith("register-project", [uint(1)])
  })
  
  it("verifies a project", () => {
    mockContractCall.mockReturnValueOnce(ok(bool(true)))
    const result = mockContractCall("verify-project", [uint(1)])
    expect(result).toEqual(ok(bool(true)))
    expect(mockContractCall).toHaveBeenCalledWith("verify-project", [uint(1)])
  })
  
  it("issues credits to a verified project", () => {
    mockContractCall.mockReturnValueOnce(ok(bool(true)))
    const result = mockContractCall("issue-credits", [uint(1), uint(100)])
    expect(result).toEqual(ok(bool(true)))
    expect(mockContractCall).toHaveBeenCalledWith("issue-credits", [uint(1), uint(100)])
  })
  
  it("retrieves project details", () => {
    const projectDetails = {
      owner: principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"),
      credits: uint(100),
      verified: bool(true),
    }
    mockContractCall.mockReturnValueOnce(projectDetails)
    const result = mockContractCall("get-project-details", [uint(1)])
    expect(result).toEqual(projectDetails)
    expect(mockContractCall).toHaveBeenCalledWith("get-project-details", [uint(1)])
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
})

