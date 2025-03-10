;; Retirement Contract

;; Define data maps
(define-map credit-balances
  { owner: principal }
  { balance: uint }
)

(define-map retired-credits
  { owner: principal }
  { amount: uint }
)

;; Define public functions
(define-public (retire-credits (amount uint))
  (let (
    (caller tx-sender)
    (balance (get balance (get-credit-balance caller)))
  )
    (if (>= balance amount)
      (begin
        (map-set credit-balances { owner: caller } { balance: (- balance amount) })
        (map-set retired-credits { owner: caller }
          { amount: (+ amount (default-to u0 (get amount (map-get? retired-credits { owner: caller })))) }
        )
        (ok true)
      )
      (err u1) ;; Insufficient balance
    )
  )
)

;; Define read-only functions
(define-read-only (get-credit-balance (owner principal))
  (default-to { balance: u0 } (map-get? credit-balances { owner: owner }))
)

(define-read-only (get-retired-credits (owner principal))
  (default-to { amount: u0 } (map-get? retired-credits { owner: owner }))
)

