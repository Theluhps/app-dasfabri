from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_marketing():
    return {"message": "Marketing route funcionando!"}
