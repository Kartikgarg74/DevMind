"""DevMind API initialization."""
import logging
import os
from collections import defaultdict
from datetime import datetime, timedelta
from urllib.parse import urlparse

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.auth import router as auth_router
from app.api.v1 import router as api_v1_router

logger = logging.getLogger(__name__)


def _parse_cors_origins(origins_str: str) -> list[str]:
    """Parse and validate CORS origins from comma-separated string."""
    origins = [o.strip() for o in origins_str.split(",") if o.strip()]
    validated = []
    for origin in origins:
        try:
            parsed = urlparse(origin)
            if parsed.scheme and parsed.netloc:
                validated.append(origin)
            else:
                logger.warning("Invalid CORS origin skipped: %s", origin)
        except Exception:
            logger.warning("Failed to parse CORS origin: %s", origin)
    return validated if validated else ["http://localhost:3000"]


# Rate limiting state
_rate_store: dict[str, list[datetime]] = defaultdict(list)
_RATE_LIMIT = int(os.getenv("API_RATE_LIMIT", "60"))  # per minute
_RATE_WINDOW = timedelta(minutes=1)


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description="DevMind API with authentication and advanced features",
    )

    # Configure CORS with validated origins
    cors_origins = _parse_cors_origins(
        os.getenv("CORS_ORIGINS", "http://localhost:3000")
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type", "Authorization", "X-Api-Key"],
    )

    # Rate limiting middleware
    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = datetime.now()

        _rate_store[client_ip] = [
            ts for ts in _rate_store[client_ip] if now - ts < _RATE_WINDOW
        ]

        if len(_rate_store[client_ip]) >= _RATE_LIMIT:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Try again later."},
            )

        _rate_store[client_ip].append(now)
        return await call_next(request)

    # Include routers
    app.include_router(auth_router, prefix=settings.API_V1_STR)
    app.include_router(api_v1_router, prefix=settings.API_V1_STR)

    return app

# Create application instance
app = create_app()
