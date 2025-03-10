;; Credit Trading Contract

;; Define data maps
(define-map credit-balances
  { owner: principal }
  { balance: uint }
)

(define-map orders
  { order-id: uint }
  { seller: principal, amount: uint, price: uint }
)

;; Define variables
(define-data-var order-nonce uint u0)

;; Define public functions
(define-public (create-sell-order (amount uint) (price uint))
  (let (
    (seller tx-sender)
    (seller-balance (get balance (get-credit-balance seller)))
    (order-id (var-get order-nonce))
  )
    (if (>= seller-balance amount)
      (begin
        (map-set orders { order-id: order-id } { seller: seller, amount: amount, price: price })
        (var-set order-nonce (+ order-id u1))
        (ok order-id)
      )
      (err u1) ;; Insufficient balance
    )
  )
)

(define-public (buy-credits (order-id uint))
  (let (
    (buyer tx-sender)
    (order (unwrap! (map-get? orders { order-id: order-id }) (err u2))) ;; Order not found
    (seller (get seller order))
    (amount (get amount order))
    (price (get price order))
    (buyer-balance (get balance (get-credit-balance buyer)))
    (seller-balance (get balance (get-credit-balance seller)))
  )
    (if (>= buyer-balance price)
      (begin
        (map-set credit-balances { owner: buyer } { balance: (- buyer-balance price) })
        (map-set credit-balances { owner: seller } { balance: (+ seller-balance price) })
        (map-set credit-balances { owner: buyer } { balance: (+ (get balance (get-credit-balance buyer)) amount) })
        (map-set credit-balances { owner: seller } { balance: (- seller-balance amount) })
        (map-delete orders { order-id: order-id })
        (ok true)
      )
      (err u3) ;; Insufficient balance to buy
    )
  )
)

;; Define read-only functions
(define-read-only (get-credit-balance (owner principal))
  (default-to { balance: u0 } (map-get? credit-balances { owner: owner }))
)

(define-read-only (get-order (order-id uint))
  (map-get? orders { order-id: order-id })
)

