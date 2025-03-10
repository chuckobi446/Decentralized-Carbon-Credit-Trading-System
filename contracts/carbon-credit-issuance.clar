;; Carbon Credit Issuance Contract

;; Define data maps
(define-map projects
  { project-id: uint }
  { owner: principal, credits: uint, verified: bool }
)

(define-map credit-balances
  { owner: principal }
  { balance: uint }
)

;; Define public functions
(define-public (register-project (project-id uint))
  (let ((caller tx-sender))
    (if (is-some (map-get? projects { project-id: project-id }))
      (err u1) ;; Project already exists
      (begin
        (map-set projects { project-id: project-id } { owner: caller, credits: u0, verified: false })
        (ok true)
      )
    )
  )
)

(define-public (verify-project (project-id uint))
  (let ((project (unwrap! (map-get? projects { project-id: project-id }) (err u2)))) ;; Project not found
    (if (is-eq tx-sender (get owner project))
      (begin
        (map-set projects { project-id: project-id } (merge project { verified: true }))
        (ok true)
      )
      (err u3) ;; Not project owner
    )
  )
)

(define-public (issue-credits (project-id uint) (amount uint))
  (let (
    (project (unwrap! (map-get? projects { project-id: project-id }) (err u2))) ;; Project not found
    (owner (get owner project))
  )
    (if (get verified project)
      (begin
        (map-set projects { project-id: project-id } (merge project { credits: (+ (get credits project) amount) }))
        (map-set credit-balances { owner: owner } { balance: (+ (default-to u0 (get balance (map-get? credit-balances { owner: owner }))) amount) })
        (ok true)
      )
      (err u4) ;; Project not verified
    )
  )
)

;; Define read-only functions
(define-read-only (get-project-details (project-id uint))
  (map-get? projects { project-id: project-id })
)

(define-read-only (get-credit-balance (owner principal))
  (default-to { balance: u0 } (map-get? credit-balances { owner: owner }))
)

