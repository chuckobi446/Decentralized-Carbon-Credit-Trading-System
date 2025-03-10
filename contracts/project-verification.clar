;; Project Verification Contract

;; Define data maps
(define-map projects
  { project-id: uint }
  { owner: principal, status: (string-ascii 20), verifier: (optional principal) }
)

(define-map verifiers
  { address: principal }
  { name: (string-ascii 50), active: bool }
)

;; Define public functions
(define-public (register-project (project-id uint))
  (let ((caller tx-sender))
    (if (is-some (map-get? projects { project-id: project-id }))
      (err u1) ;; Project already exists
      (begin
        (map-set projects { project-id: project-id } { owner: caller, status: "pending", verifier: none })
        (ok true)
      )
    )
  )
)

(define-public (assign-verifier (project-id uint) (verifier-address principal))
  (let (
    (project (unwrap! (map-get? projects { project-id: project-id }) (err u2))) ;; Project not found
    (verifier (unwrap! (map-get? verifiers { address: verifier-address }) (err u3))) ;; Verifier not found
  )
    (if (and (is-eq tx-sender (get owner project)) (get active verifier))
      (begin
        (map-set projects { project-id: project-id } (merge project { status: "verifying", verifier: (some verifier-address) }))
        (ok true)
      )
      (err u4) ;; Not project owner or verifier not active
    )
  )
)

(define-public (verify-project (project-id uint) (approved bool))
  (let (
    (project (unwrap! (map-get? projects { project-id: project-id }) (err u2))) ;; Project not found
    (verifier (unwrap! (get verifier project) (err u5))) ;; No verifier assigned
  )
    (if (is-eq tx-sender verifier)
      (begin
        (map-set projects
          { project-id: project-id }
          (merge project { status: (if approved "verified" "rejected"), verifier: none })
        )
        (ok true)
      )
      (err u6) ;; Not assigned verifier
    )
  )
)

(define-public (register-verifier (name (string-ascii 50)))
  (let ((caller tx-sender))
    (map-set verifiers { address: caller } { name: name, active: true })
    (ok true)
  )
)

;; Define read-only functions
(define-read-only (get-project-status (project-id uint))
  (map-get? projects { project-id: project-id })
)

(define-read-only (get-verifier-details (address principal))
  (map-get? verifiers { address: address })
)

