"""Lossless prerequisite migration from the recorded lightweight bootstrap graph.

Retains legacy snapshot and never authorizes task execution. Review before merge.
"""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
p = root / "artifacts/planner/research/remaining-work-graph.json"
graph = json.loads(p.read_text())
if graph.get("graph_id"):
    print("already migrated")
    raise SystemExit(0)
assert graph.get("version") == 1
assert graph == json.loads((root / "docs/governance/legacy-bootstrap-graph.json").read_text())
graph["graph_id"] = "littlelink-remaining-work-graph-20260505"
graph["created_at"] = graph["last_updated"]
graph["ordering_policy"] = {
    "ready_statuses": ["ready"],
    "ready_sort_fields": ["ready_order", "tie_breaker", "node_id"],
    "reorder_requires_explicit_action": True,
    "board_projection_authority": "projection_only",
}
graph["edges"] = []
for node in graph["nodes"]:
    status = node["status"]
    if node.get("type") == "initiative":
        assert status == "in_progress"
        node["legacy_status"] = status
        node["goal_area"] = "reference"
        node["status"] = "decision_gated"
        node["status_reason"] = "Legacy in_progress container has no canonical execution grant; preserved conservatively pending review"
        node["gating_class"] = "decision_gated"
        node["target_execplan_id"] = "initiative:" + node["initiative_branch"].removeprefix("initiative/")
        node.setdefault("conflict_domains", [])
        node.setdefault("ordering", {})
    else:
        assert status in {"completed", "decision_gated", "ready"}
        node.setdefault("gating_class", "decision_gated" if status == "decision_gated" else "auto_runnable")
        node.setdefault("conflict_domains", [])
        if status == "decision_gated":
            node.setdefault("status_reason", "Legacy queued task remains decision gated; no execution authority inferred")
        if node["node_id"] in {"rwg-002", "rwg-003"}:
            node.setdefault("ordering", {"queue_position": int(node["node_id"][-1]) - 1, "tie_breaker": node["target_execplan_id"]})
graph["queue_projection"]["path"] = "docs/queued-execplans.md"
p.write_text(json.dumps(graph, indent=2) + "\n")
queue = root / "docs/queued-execplans.md"
text = queue.read_text()
if "## Mirror Metadata" not in text:
    text += "\n## Mirror Metadata\n\n- canonical_last_graph_action_id: `" + graph["queue_projection"]["last_reconciled_action_id"] + "`\n- canonical_ready_order: ``\n- projection_authority: `projection_only`\n"
queue.write_text(text)
print("migrated metadata; all task statuses preserved and legacy container conservatively gated")
