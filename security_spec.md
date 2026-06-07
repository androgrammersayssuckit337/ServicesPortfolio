# Security Spec

1. Data Invariants:
- Anyone can create an inquiry.
- Users cannot read other inquiries.
- Inquiries cannot be updated or deleted once created.
- createdAt must be the server time.

2. The "Dirty Dozen" Payloads:
- Missing required field (name)
- Extra field (isAdmin)
- createdAt not server timestamp
- Updating an inquiry
- Deleting an inquiry
- Reading inquiries
- Message too long
- Name too long
- workType invalid format
- email invalid format (if possible, fallback to size check)
- Payload without createdAt
- Payload where name is not string
...
