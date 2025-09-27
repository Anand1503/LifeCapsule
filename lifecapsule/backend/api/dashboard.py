from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from loguru import logger
from ..services.diary_service import get_all_entries
from ..services.sentiment_service import analyze_sentiment

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

class DashboardSummary(BaseModel):
    total_entries: int
    assistant_queries: int
    avg_entry_length: int
    mood_trend: str
    entries_over_time: List[Dict[str, str]]
    mood_distribution: Dict[str, int]
    weekly_activity: Dict[str, int]

@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary():
    """Get aggregated dashboard data."""
    try:
        entries = await get_all_entries()
        if not entries:
            return DashboardSummary(
                total_entries=0,
                assistant_queries=0,
                avg_entry_length=0,
                mood_trend="neutral",
                entries_over_time=[],
                mood_distribution={"positive": 0, "negative": 0, "neutral": 0},
                weekly_activity={"Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0}
            )

        parsed_entries = []
        for entry in entries:
            if ":\n" in entry:
                date_str, text = entry.split(":\n", 1)
                try:
                    date = datetime.strptime(date_str.strip(), "%B %d, %Y")
                    word_count = len(text.split())
                    parsed_entries.append({"date": date, "text": text.strip(), "word_count": word_count})
                except ValueError:
                    logger.warning(f"Invalid date format: {date_str}")
                    continue

        if not parsed_entries:
            return DashboardSummary(
                total_entries=0,
                assistant_queries=0,
                avg_entry_length=0,
                mood_trend="neutral",
                entries_over_time=[],
                mood_distribution={"positive": 0, "negative": 0, "neutral": 0},
                weekly_activity={"Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0}
            )

        # total_entries
        total_entries = len(parsed_entries)

        # avg_entry_length
        total_words = sum(e["word_count"] for e in parsed_entries)
        avg_entry_length = total_words // total_entries if total_entries > 0 else 0

        # assistant_queries (not tracked, set to 0)
        assistant_queries = 0

        # mood_distribution
        mood_counts = {"positive": 0, "negative": 0, "neutral": 0}
        for e in parsed_entries:
            polarity = await analyze_sentiment(e["text"])
            if polarity > 0.1:
                mood_counts["positive"] += 1
            elif polarity < -0.1:
                mood_counts["negative"] += 1
            else:
                mood_counts["neutral"] += 1

        # mood_trend: most common in last 7 entries
        recent_entries = sorted(parsed_entries, key=lambda x: x["date"], reverse=True)[:7]
        recent_moods = []
        for e in recent_entries:
            polarity = await analyze_sentiment(e["text"])
            if polarity > 0.1:
                recent_moods.append("positive")
            elif polarity < -0.1:
                recent_moods.append("negative")
            else:
                recent_moods.append("neutral")
        if recent_moods:
            mood_trend = Counter(recent_moods).most_common(1)[0][0]
        else:
            mood_trend = "neutral"

        # entries_over_time: last 6 months, group by month
        six_months_ago = datetime.now() - timedelta(days=180)
        monthly_counts = defaultdict(int)
        for e in parsed_entries:
            if e["date"] >= six_months_ago:
                month_key = e["date"].strftime("%Y-%m")
                monthly_counts[month_key] += 1
        entries_over_time = [{"date": k, "entries": str(v)} for k, v in sorted(monthly_counts.items())]

        # weekly_activity
        weekday_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        weekly_counts = defaultdict(int)
        for e in parsed_entries:
            weekday = e["date"].weekday()  # 0=Mon, 6=Sun
            weekly_counts[weekday_names[weekday]] += 1
        weekly_activity = {day: weekly_counts.get(day, 0) for day in weekday_names}

        return DashboardSummary(
            total_entries=total_entries,
            assistant_queries=assistant_queries,
            avg_entry_length=avg_entry_length,
            mood_trend=mood_trend,
            entries_over_time=entries_over_time,
            mood_distribution=mood_counts,
            weekly_activity=weekly_activity
        )

    except Exception as e:
        logger.error(f"Error generating dashboard summary: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate dashboard summary.")
