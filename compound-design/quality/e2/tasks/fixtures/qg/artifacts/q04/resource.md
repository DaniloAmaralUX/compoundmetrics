# Resource: db-hygiene-agent v0.9.0

Detects duplicate and orphaned rows in production databases. When its duplicate-confidence score is at least 0.9 it executes the DELETE itself and then reports what it removed. Runs nightly with production write credentials.
