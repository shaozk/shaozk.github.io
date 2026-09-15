#!/usr/bin/env python3
"""拉取微信读书每日阅读时长，生成/更新 static/weread-stats.json。

数据来自微信读书官方 Agent Gateway（https://weread.qq.com/r/weread-skills），
需要环境变量 WEREAD_API_KEY（wrk-...）。

用法:
    WEREAD_API_KEY=wrk-... ./scripts/weread_stats.py            # 增量更新
    WEREAD_API_KEY=wrk-... ./scripts/weread_stats.py --full     # 强制全量拉取
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT = REPO_ROOT / "static" / "weread-stats.json"

API_URL = "https://i.weread.qq.com/api/agent/gateway"
SKILL_VERSION = "1.7.0"
CST = timezone(timedelta(hours=8))
STALE_DAYS = 20
FULL_MONTHS = 13


def call_gateway(key: str, mode: str, base_time: int) -> dict:
    body = json.dumps(
        {"api_name": "/readdata/detail", "skill_version": SKILL_VERSION, "mode": mode, "baseTime": base_time}
    ).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        if exc.code in (401, 403):
            sys.exit("错误: WEREAD_API_KEY 无效或已过期，请到 https://weread.qq.com/r/weread-skills 重新获取。")
        raise

    if "upgrade_info" in result:
        msg = result["upgrade_info"].get("message", "技能版本需升级")
        sys.exit(f"错误: {msg}（需更新脚本中的 SKILL_VERSION）")

    errcode = result.get("errcode", 0)
    if errcode != 0:
        sys.exit(f"错误: 微信读书 API 返回 errcode={errcode}: {result.get('errmsg', '未知错误')}")

    return result


def fetch_month(key: str, year: int, month: int) -> dict[str, int]:
    base_time = int(datetime(year, month, 15, tzinfo=CST).timestamp())
    result = call_gateway(key, "monthly", base_time)
    daily: dict[str, int] = {}
    for ts, secs in (result.get("readTimes") or {}).items():
        day = datetime.fromtimestamp(int(ts), CST).strftime("%Y-%m-%d")
        daily[day] = daily.get(day, 0) + int(secs)
    return daily


def month_shift(base: datetime, offset: int) -> tuple[int, int]:
    total = base.year * 12 + (base.month - 1) + offset
    return total // 12, total % 12 + 1


def main() -> None:
    parser = argparse.ArgumentParser(description="生成/更新 static/weread-stats.json")
    parser.add_argument("--full", action="store_true", help="忽略已有数据，全量拉取最近 13 个月")
    args = parser.parse_args()

    key = os.environ.get("WEREAD_API_KEY", "")
    if not key:
        sys.exit("错误: WEREAD_API_KEY 未设置，请 export WEREAD_API_KEY=wrk-...")

    now = datetime.now(CST)
    data: dict = {}
    if OUTPUT.exists() and not args.full:
        try:
            data = json.loads(OUTPUT.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            data = {}

    daily: dict[str, int] = data.get("daily") or {}
    updated = data.get("updated") or ""
    stale = True
    if updated:
        try:
            updated_date = datetime.strptime(updated, "%Y-%m-%d").date()
            stale = (now.date() - updated_date).days > STALE_DAYS
        except ValueError:
            stale = True

    if args.full or stale or not daily:
        offsets = range(-FULL_MONTHS + 1, 1)
        mode = f"全量（最近 {FULL_MONTHS} 个月）"
    else:
        offsets = (-1, 0)
        mode = "增量（当月 + 上月）"

    for offset in offsets:
        year, month = month_shift(now, offset)
        fetched = fetch_month(key, year, month)
        daily.update(fetched)
        print(f"已拉取 {year}-{month:02d}: {len(fetched)} 天")

    total_minutes = sum(daily.values()) // 60
    output = {"updated": now.strftime("%Y-%m-%d"), "daily": dict(sorted(daily.items()))}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    print(f"完成（{mode}）: {len(daily)} 天, 累计阅读 {total_minutes // 60} 小时 {total_minutes % 60} 分钟")
    print(f"已写入 {OUTPUT}")


if __name__ == "__main__":
    main()
