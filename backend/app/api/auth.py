import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User, Student, Parent, StudentProfile, Preference
from app.schemas.schemas import UserRegister, UserLogin, Token, UserResponse
from app.auth.security import (
    verify_password, get_password_hash, create_access_token, get_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

def generate_student_code() -> str:
    digits = ''.join(random.choices(string.digits, k=5))
    return f"STU-{digits}"

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    if user_in.confirm_password and user_in.password != user_in.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    valid_roles = ["student", "parent", "admin"]
    role = user_in.role.lower() if user_in.role else "student"
    if role not in valid_roles:
        role = "student"

    new_user = User(
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.name,
        phone=user_in.phone,
        role=role,
        education_level=user_in.education_level or "10th Standard",
        state=user_in.state or "Karnataka",
        preferred_language=user_in.preferred_language or "English"
    )
    db.add(new_user)
    db.flush()

    student_code = None
    if role == "student":
        student_code = generate_student_code()
        student = Student(user_id=new_user.id, student_code=student_code)
        db.add(student)
        db.flush()

        # Initialize student profile & preferences
        profile = StudentProfile(
            student_id=student.id,
            education_level=user_in.education_level or "10th Standard"
        )
        pref = Preference(student_id=student.id)
        db.add(profile)
        db.add(pref)

    elif role == "parent":
        parent = Parent(user_id=new_user.id)
        db.add(parent)

    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.email, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role,
            "student_code": student_code
        }
    }

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    student_code = None
    if user.role == "student" and user.student_profile:
        student_code = user.student_profile.student_code

    token = create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "student_code": student_code
        }
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    student_code = None
    if current_user.role == "student" and current_user.student_profile:
        student_code = current_user.student_profile.student_code

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "role": current_user.role,
        "education_level": current_user.education_level,
        "state": current_user.state,
        "preferred_language": current_user.preferred_language,
        "student_code": student_code
    }
