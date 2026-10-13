import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from main import app
from app.database.connection import SessionLocal, Base, engine
from app.database.models import User, Student, Career, AptitudeQuestion, Course
from app.database.seed import seed_database
from app.ai.recommendation_engine import recommendation_engine
from app.ai.rules_engine import EligibilityEngine
from app.config import settings

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

def test_api_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

    health_res = client.get("/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "healthy"

def test_auth_login_student():
    res = client.post("/api/auth/login", json={
        "email": "student@example.com",
        "password": "student123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "student"

def test_auth_login_parent():
    res = client.post("/api/auth/login", json={
        "email": "parent@example.com",
        "password": "parent123"
    })
    assert res.status_code == 200
    assert res.json()["user"]["role"] == "parent"

def test_auth_login_admin():
    res = client.post("/api/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    assert res.status_code == 200
    assert res.json()["user"]["role"] == "admin"

def test_student_profile_and_options():
    # Login as student
    login_res = client.post("/api/auth/login", json={
        "email": "student@example.com",
        "password": "student123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get options
    opt_res = client.get("/api/profile/options", headers=headers)
    assert opt_res.status_code == 200
    options = opt_res.json()
    assert len(options["skills"]) > 0
    assert len(options["interests"]) > 0

    # Get student profile
    prof_res = client.get("/api/profile", headers=headers)
    assert prof_res.status_code == 200
    prof = prof_res.json()
    assert prof["student_code"].startswith("STU-")
    assert prof["has_profile"] is True

def test_aptitude_questions_and_scoring():
    login_res = client.post("/api/auth/login", json={
        "email": "student@example.com",
        "password": "student123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch questions
    q_res = client.get("/api/assessment/questions", headers=headers)
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) >= 30

    # Submit sample answers
    answers = {q["id"]: "B" for q in questions[:10]}
    sub_res = client.post("/api/assessment/submit", json={"answers": answers}, headers=headers)
    assert sub_res.status_code == 200
    result = sub_res.json()
    assert "logical_score" in result
    assert "percentage" in result
    assert "category_breakdown" in result

def test_recommendation_generation_and_weighted_scoring():
    login_res = client.post("/api/auth/login", json={
        "email": "student@example.com",
        "password": "student123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Generate recommendations
    gen_res = client.post("/api/recommendations/generate", headers=headers)
    assert gen_res.status_code == 200
    recs = gen_res.json()
    assert len(recs) >= 20

    # Check top recommendation structure
    top = recs[0]
    assert "overall_score" in top
    assert 0 <= top["overall_score"] <= 100
    assert "interest_match" in top
    assert "skill_match" in top
    assert "aptitude_match" in top
    assert "academic_match" in top
    assert "reasons" in top
    assert "skill_gaps" in top

def test_career_comparison():
    login_res = client.post("/api/auth/login", json={
        "email": "student@example.com",
        "password": "student123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Compare first 2 careers
    comp_res = client.post("/api/careers/compare", json={"career_ids": [1, 2]}, headers=headers)
    assert comp_res.status_code == 200
    comp_list = comp_res.json()
    assert len(comp_list) == 2
    assert "overall_score" in comp_list[0]
    assert "average_course_cost" in comp_list[0]

def test_family_report_and_parent_access():
    # Student view
    stu_login = client.post("/api/auth/login", json={
        "email": "student@example.com",
        "password": "student123"
    })
    stu_token = stu_login.json()["access_token"]
    stu_headers = {"Authorization": f"Bearer {stu_token}"}

    fam_res = client.get("/api/family/report", headers=stu_headers)
    assert fam_res.status_code == 200
    fam_data = fam_res.json()
    assert fam_data["student_name"] == "Aarav Sharma (Student)"

    # Student votes for career 1
    vote_res = client.post("/api/family/preference", json={
        "career_id": 1,
        "notes": "Student loves this career."
    }, headers=stu_headers)
    assert vote_res.status_code == 200

    # Parent view
    parent_login = client.post("/api/auth/login", json={
        "email": "parent@example.com",
        "password": "parent123"
    })
    parent_token = parent_login.json()["access_token"]
    parent_headers = {"Authorization": f"Bearer {parent_token}"}

    parent_fam_res = client.get("/api/family/report", headers=parent_headers)
    assert parent_fam_res.status_code == 200
    assert parent_fam_res.json()["student_preferred_career"]["id"] == 1

def test_admin_portal_protection():
    # Student cannot access admin
    stu_login = client.post("/api/auth/login", json={
        "email": "student@example.com",
        "password": "student123"
    })
    stu_headers = {"Authorization": f"Bearer {stu_login.json()['access_token']}"}
    res = client.get("/api/admin/stats", headers=stu_headers)
    assert res.status_code == 403

    # Admin can access admin stats
    adm_login = client.post("/api/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    adm_headers = {"Authorization": f"Bearer {adm_login.json()['access_token']}"}
    adm_res = client.get("/api/admin/stats", headers=adm_headers)
    assert adm_res.status_code == 200
    assert adm_res.json()["total_careers"] >= 20

def test_skill_first_non_it_transition_pathway():
    # Login as student
    login_res = client.post("/api/auth/login", json={
        "email": "student@example.com",
        "password": "student123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Update profile to non-IT stream, low academic marks, dropout status, and tech transition
    update_res = client.put("/api/profile", json={
        "education_status": "Dropout",
        "background_stream": "Arts / Humanities",
        "career_transition": "I am from Arts / Commerce / Non-IT background and want to enter Tech / IT",
        "gpa_or_percentage": 42.0,
        "education_level": "10th Standard",
        "stream": "Arts",
        "interests": [{"interest_id": 1, "interest_level": 5}],
        "skills": [{"skill_id": 1, "proficiency_level": 1}]
    }, headers=headers)
    assert update_res.status_code == 200
    prof_data = update_res.json()
    assert prof_data["education_status"] == "Dropout"
    assert prof_data["background_stream"] == "Arts / Humanities"
    assert "Non-IT" in prof_data["career_transition"]

    # Generate recommendations
    gen_res = client.post("/api/recommendations/generate", headers=headers)
    assert gen_res.status_code == 200
    recs = gen_res.json()

    # Find Web Developer
    web_dev = next((r for r in recs if r["career_title"] == "Web Developer"), None)
    assert web_dev is not None
    assert web_dev["is_skill_first"] is True
    assert web_dev["is_eligible"] is True  # Must NOT be marked ineligible
    assert len(web_dev["learning_roadmap"]) >= 4
    assert len(web_dev["alternative_pathways"]) >= 1
    assert "Degree" in web_dev["qualification_guidance"] or "employer" in web_dev["qualification_guidance"]

    # Verify absence of negative labeling
    notes = (web_dev.get("eligibility_notes") or "") + " ".join(web_dev.get("reasons") or [])
    assert "rejected" not in notes.lower()
    assert "low student" not in notes.lower()
    assert "poor marks" not in notes.lower()
    assert "Skill-First" in notes or "portfolio" in notes.lower()
