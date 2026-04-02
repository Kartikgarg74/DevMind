"""API dependencies for FastAPI."""
import hmac
import logging
from fastapi import Header, HTTPException
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


async def get_api_key(x_api_key: Optional[str] = Header(None)):
    """Validate API key for protected endpoints. Always required."""
    if not x_api_key:
        raise HTTPException(
            status_code=401,
            detail="API key is required. Pass it via X-Api-Key header."
        )

    if not settings.SECRET_KEY:
        logger.error("SECRET_KEY not configured — rejecting all requests")
        raise HTTPException(
            status_code=500,
            detail="Server misconfigured: SECRET_KEY not set"
        )

    # Use constant-time comparison to prevent timing attacks
    if not hmac.compare_digest(x_api_key, settings.SECRET_KEY):
        raise HTTPException(
            status_code=403,
            detail="Invalid API key"
        )

    return True
