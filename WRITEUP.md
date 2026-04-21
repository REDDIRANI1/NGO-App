# NGO Impact Tracker - Technical Writeup

## Approach & Architectural Decisions

### Tech Stack Selection
- **Backend**: FastAPI (Python) - Chosen for async support, built-in validation, and automatic OpenAPI docs
- **Database**: PostgreSQL with async SQLAlchemy 2.0 - ACID compliance, proper relationship handling
- **Frontend**: Next.js 14 with App Router - Modern React framework with SSR capabilities

### Key Architectural Decisions

#### 1. Async Background Processing
CSV uploads are processed asynchronously using FastAPI's `BackgroundTasks`. This prevents:
- Request timeouts for large files
- Blocking the API for other users
- Cold start issues on serverless部署

The job is created immediately with status "pending", then processed in the background with progress updates stored in PostgreSQL.

#### 2. Idempotent Report Submission
Implemented using PostgreSQL's `UNIQUE(ngo_id, month)` constraint:
- First submission creates a new record
- Subsequent submissions for same NGO+month UPDATE the existing record
- This ensures no duplicate data while allowing updates

#### 3. Partial Failure Handling
CSV processor:
- Validates each row individually
- Records failed rows in `job.errors` JSON array (row number + error message)
- Continues processing valid rows
- Returns final counts: processed vs failed

#### 4. Retry Logic (Bonus)
Each failed CSV row is retried up to 3 times before being marked as failed.
This handles transient database issues gracefully.

### AI Tools Used
- **Code Generation**: Used during initial project scaffolding to accelerate boilerplate creation
- **Debugging**: Used to identify and fix Pydantic serialization issues

### Production Improvements (With More Time)

1. **Authentication**
   - Add JWT/Session auth for admin routes
   - Protect dashboard with login

2. **Data Validation**
   - Validate NGO IDs against a registered NGO table
   - Add region/state fields for filtering

3. **Performance**
   - Add database indexes on `month` column
   - Redis caching for dashboard queries
   - Pagination for large result sets

4. **Observability**
   - Structured logging (JSON logs)
   - Metrics (Prometheus/Grafana)
   - Distributed tracing

5. **Deployment**
   - CI/CD pipeline (GitHub Actions)
   - Container orchestration (Kubernetes)
   - Blue-green deployments

6. **Error Handling**
   - Dead letter queue for permanently failed rows
   - Email notifications for admin
   - Automatic retry with exponential backoff

### Challenges Overcome

1. **Async SQLAlchemy with FastAPI**: Required careful session management (get_db dependency)
2. **CSV Processing**: Non-blocking background tasks needed for proper progress updates
3. **Pydantic Serialization**: Had to manually serialize ORM objects to dicts

### Lessons Learned

1. FastAPI's `BackgroundTasks` is simple but limited - for production, Celery or a proper job queue would be better
2. Next.js App Router requires careful handling of client/server components
3. PostgreSQL async drivers require different patterns than sync drivers