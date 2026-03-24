# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db  # 导入数据库会话依赖
from models.user import User  # 导入用户模型
from schemas.user import UserCreate, UserResponse, LoginRequest, LoginResponse, UserUpdate, PasswordChange
from crud.user import get_user_by_username, get_user_by_email, get_user_by_id, update_user, change_password, verify_password, get_password_hash  # 导入CRUD函数
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
import os
from typing import Optional

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

# JWT配置
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # 检查用户名是否已被注册
        db_user = get_user_by_username(db, username=user.username)
        if db_user:
            raise HTTPException(status_code=400, detail="用户名已被注册")
        
        # 检查邮箱是否已被注册
        db_user_by_email = get_user_by_email(db, email=user.email)
        if db_user_by_email:
            raise HTTPException(status_code=400, detail="邮箱已被注册")
        
        # 创建用户
        db_user = User(
            username=user.username,
            email=user.email,
            name=user.name,
            gender=user.gender,
            age=user.age,
            phone=user.phone,
            major=user.major,
            grade=user.grade,
            role=user.role,
            avatar=user.avatar,
            hashed_password=get_password_hash(user.password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"注册失败: {e}")
        # 处理数据库约束错误
        if "UNIQUE constraint failed" in str(e):
            if "users.username" in str(e):
                raise HTTPException(status_code=400, detail="用户名已被注册")
            elif "users.email" in str(e):
                raise HTTPException(status_code=400, detail="邮箱已被注册")
        # 处理其他错误
        raise HTTPException(status_code=400, detail="注册失败，请稍后重试")

@router.post("/login", response_model=LoginResponse)
def login(user: LoginRequest, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, username=user.username)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {
        "token": access_token,
        "user": db_user
    }

@router.post("/logout")
def logout():
    return {"message": "退出登录成功"}

@router.get("/user", response_model=UserResponse)
def get_user_info(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.put("/user", response_model=UserResponse)
def update_user_info(user_update: UserUpdate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    updated_user = update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return updated_user

@router.get("/profile-step")
def get_profile_step(current_user: UserResponse = Depends(get_current_user)):
    return {"step": current_user.profile_step or 1}

@router.put("/profile-step")
def update_profile_step(step: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    from crud.user import update_user
    from schemas.user import UserUpdate
    user_update = UserUpdate(profile_step=step)
    updated_user = update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return {"step": updated_user.profile_step}

@router.post("/change-password")
def change_password_endpoint(password_data: PasswordChange, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    if password_data.newPassword != password_data.confirmPassword:
        raise HTTPException(status_code=400, detail="两次输入的密码不一致")
    
    success = change_password(db, current_user.id, password_data.oldPassword, password_data.newPassword)
    if not success:
        raise HTTPException(status_code=400, detail="原密码错误")
    
    return {"message": "密码修改成功"}

@router.post("/upload-avatar")
def upload_avatar(file: UploadFile = File(...), current_user: UserResponse = Depends(get_current_user)):
    # 这里应该实现文件上传逻辑，保存文件并更新用户头像URL
    # 为了演示，我们只返回一个成功消息
    return {"message": "头像上传成功", "avatar_url": "https://example.com/avatar.jpg"}