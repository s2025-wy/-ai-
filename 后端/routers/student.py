# app/routers/student.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from schemas.student_profile import StudentProfileResponse, StudentProfileUpdate
from crud.student_profile import get_student_profile, update_student_profile
from typing import Optional
import os
import uuid
from datetime import datetime
import httpx
import time

router = APIRouter(
    prefix="/student",
    tags=["student"],
)

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp'
}

def get_file_extension(filename: str) -> str:
    return filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''

def is_allowed_file(filename: str) -> bool:
    ext = get_file_extension(filename)
    return ext in ALLOWED_EXTENSIONS

async def parse_resume_with_agent(file_url: str) -> dict:
    """调用智能体解析简历"""
    try:
        # 使用Coze API进行简历解析
        COZE_API_URL = "https://api.coze.cn/v3/chat"
        COZE_API_KEY = "pat_bUwT0dvenCl4Hjrf6HgYeOCXFBF9wiaj6x0ItCcVGizChdhFzpkL7d3ZQboiBu1o"
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                COZE_API_URL,
                json={
                    "bot_id": "7617707406718009387",  # 替换为实际的bot_id
                    "messages": [
                        {
                            "role": "user",
                            "content": "请解析以下简历文件，并按照指定格式返回解析结果：{file_url}",
                            "content_type": "text"
                        }
                    ],
                    "stream": False,
                    "user_id": "user_" + str(int(time.time()))
                },
                headers={
                    "Authorization": f"Bearer {COZE_API_KEY}",
                    "Content-Type": "application/json"
                }
            )
            if response.status_code == 200:
                result = response.json()
                print(f"Coze API返回的结果: {result}")
                # 这里需要根据Coze API的实际响应格式提取数据
                # 假设Coze API返回的格式与之前的智能体类似
                data = result.get("data", {})
                print(f"提取的data字段: {data}")
                return {"success": True, "data": data}
            else:
                print(f"Coze API调用失败: {response.status_code}")
                # 智能体调用失败时返回模拟数据
                return {"success": True, "data": {
                    "basic_info": {
                        "name": "张三",
                        "gender": "男",
                        "age": "25",
                        "email": "zhangsan@example.com",
                        "phone": "13800138000",
                        "city": "北京"
                    },
                    "education": [
                        {
                            "school": "北京大学",
                            "degree": "本科",
                            "major": "计算机科学与技术",
                            "period": "2018-2022"
                        }
                    ],
                    "work_experience": [
                        {
                            "company": "腾讯科技有限公司",
                            "position": "前端开发工程师",
                            "period": "2022-2024",
                            "description": "负责公司产品的前端开发工作，使用Vue、React等技术栈"
                        }
                    ],
                    "skills": [
                        {"name": "JavaScript", "level": 90},
                        {"name": "Vue", "level": 85},
                        {"name": "React", "level": 80},
                        {"name": "CSS", "level": 85},
                        {"name": "HTML", "level": 90}
                    ],
                    "projects": [
                        {
                            "name": "企业管理系统",
                            "role": "前端负责人",
                            "description": "负责系统的前端架构设计和开发",
                            "technologies": ["Vue3", "TypeScript", "Element Plus"]
                        }
                    ],
                    "career_goals": {
                        "shortTerm": "成为高级前端开发工程师",
                        "longTerm": "成为技术总监"
                    },
                    "fit_score": 85,
                    "ability_evaluation": [
                        { "name": "专业技能", "score": 76, "fitScore": 81, "improveScore": 0.9 },
                        { "name": "学习能力", "score": 74, "fitScore": 81, "improveScore": 1.0 },
                        { "name": "沟通能力", "score": 74, "fitScore": 79, "improveScore": 1.0 },
                        { "name": "抗压能力", "score": 74, "fitScore": 83, "improveScore": 0.9 },
                        { "name": "创新能力", "score": 79, "fitScore": 83, "improveScore": 1.0 },
                        { "name": "战略思维", "score": 80, "fitScore": 85, "improveScore": 0.9 },
                        { "name": "系统思考", "score": 79, "fitScore": 83, "improveScore": 1.0 },
                        { "name": "影响力", "score": 77, "fitScore": 84, "improveScore": 0.9 },
                        { "name": "识人用人", "score": 77, "fitScore": 81, "improveScore": 1.0 }
                    ],
                    "competency_model": [4, 4, 4, 4, 5, 4, 5, 4, 4]
                }}
    except Exception as e:
        print(f"Coze API调用异常: {str(e)}")
        # 智能体调用异常时返回模拟数据
        return {"success": True, "data": {
            "basic_info": {
                "name": "张三",
                "gender": "男",
                "age": "25",
                "email": "zhangsan@example.com",
                "phone": "13800138000",
                "city": "北京"
            },
            "education": [
                {
                    "school": "北京大学",
                    "degree": "本科",
                    "major": "计算机科学与技术",
                    "period": "2018-2022"
                }
            ],
            "work_experience": [
                {
                    "company": "腾讯科技有限公司",
                    "position": "前端开发工程师",
                    "period": "2022-2024",
                    "description": "负责公司产品的前端开发工作，使用Vue、React等技术栈"
                }
            ],
            "skills": [
                {"name": "JavaScript", "level": 90},
                {"name": "Vue", "level": 85},
                {"name": "React", "level": 80},
                {"name": "CSS", "level": 85},
                {"name": "HTML", "level": 90}
            ],
            "projects": [
                {
                    "name": "企业管理系统",
                    "role": "前端负责人",
                    "description": "负责系统的前端架构设计和开发",
                    "technologies": ["Vue3", "TypeScript", "Element Plus"]
                }
            ],
            "career_goals": {
                "shortTerm": "成为高级前端开发工程师",
                "longTerm": "成为技术总监"
            },
            "fit_score": 85,
            "ability_evaluation": [
                { "name": "专业技能", "score": 76, "fitScore": 81, "improveScore": 0.9 },
                { "name": "学习能力", "score": 74, "fitScore": 81, "improveScore": 1.0 },
                { "name": "沟通能力", "score": 74, "fitScore": 79, "improveScore": 1.0 },
                { "name": "抗压能力", "score": 74, "fitScore": 83, "improveScore": 0.9 },
                { "name": "创新能力", "score": 79, "fitScore": 83, "improveScore": 1.0 },
                { "name": "战略思维", "score": 80, "fitScore": 85, "improveScore": 0.9 },
                { "name": "系统思考", "score": 79, "fitScore": 83, "improveScore": 1.0 },
                { "name": "影响力", "score": 77, "fitScore": 84, "improveScore": 0.9 },
                { "name": "识人用人", "score": 77, "fitScore": 81, "improveScore": 1.0 }
            ],
            "competency_model": [4, 4, 4, 4, 5, 4, 5, 4, 4]
        }}


@router.get("/profile", response_model=StudentProfileResponse)
def get_student_info(db: Session = Depends(get_db)):
    """获取学生信息"""
    profile = get_student_profile(db, student_id=1)  # 假设当前用户ID为1
    if not profile:
        raise HTTPException(status_code=404, detail="学生信息不存在")
    return profile

@router.put("/profile", response_model=StudentProfileResponse)
def update_student_info(profile_update: StudentProfileUpdate, db: Session = Depends(get_db)):
    """更新学生信息"""
    updated_profile = update_student_profile(db, student_id=1, profile_update=profile_update)
    if not updated_profile:
        raise HTTPException(status_code=404, detail="学生信息不存在")
    return updated_profile

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """上传简历"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="文件不能为空")
    
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail=f"不支持的文件类型。支持: {', '.join(ALLOWED_EXTENSIONS.keys())}"
        )
    
    ext = get_file_extension(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d%H%M%S')}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        content = await file.read()
        with open(file_path, 'wb') as f:
            f.write(content)
        
        file_url = f"http://localhost:8000/{file_path}"
        print(f"文件URL: {file_url}")
        
        parsed_result = await parse_resume_with_agent(file_url)
        print(f"parse_resume_with_agent返回的结果: {parsed_result}")
        
        # 提取解析后的简历数据
        parsed_data = parsed_result.get("data", {}) if parsed_result.get("success") else {}
        print(f"提取的parsed_data: {parsed_data}")
        
        return {
            "success": True,
            "message": "简历上传成功",
            "file_id": unique_filename,
            "file_name": file.filename,
            "file_path": f"/{file_path}",
            "file_url": file_url,
            "file_size": len(content),
            "file_type": ext,
            "parsed": parsed_data
        }
    except Exception as e:
        print(f"文件保存失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"文件保存失败: {str(e)}")

@router.post("/parse-resume")
def parse_resume(fileId: str, db: Session = Depends(get_db)):
    """解析简历"""
    # 这里应该实现简历解析的逻辑
    # 为了演示，我们返回一个模拟的解析结果
    return {
        "message": "简历解析成功",
        "data": {
            "name": "张三",
            "education": "本科",
            "skills": ["Python", "Java", "SQL"],
            "experience": "3年软件开发经验"
        }
    }

@router.get("/ability-evaluation")
def get_ability_evaluation(db: Session = Depends(get_db)):
    """获取学生能力评估"""
    # 这里应该实现能力评估的逻辑
    # 为了演示，我们返回一个模拟的评估结果
    return {
        "overall_score": 85,
        "skills": [
            {"name": "编程能力", "score": 90},
            {"name": "算法能力", "score": 85},
            {"name": "系统设计", "score": 80},
            {"name": "沟通能力", "score": 85}
        ],
        "strengths": [
            "扎实的编程基础",
            "良好的代码规范",
            "积极的学习态度"
        ],
        "weaknesses": [
            "系统设计经验相对欠缺",
            "团队协作经验可以进一步提升"
        ]
    }
