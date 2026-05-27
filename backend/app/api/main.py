from fastapi import APIRouter

from app.api.routes import items, login, private, users, utils, categories, expenses, budgets, incomes, analytics,dashboard
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(categories.router)
api_router.include_router(expenses.router)
api_router.include_router(budgets.router)
api_router.include_router(incomes.router)
api_router.include_router(analytics.router)
api_router.include_router(dashboard.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
