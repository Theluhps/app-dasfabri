from datetime import datetime
from backend.api.access_requests import AccessRequest, AccessRequestStatus

def create_test_user():
    """Cria um usuário de teste com acesso administrativo."""
    test_user = AccessRequest(
        id="TEST-001",
        name="Usuário Teste",
        company="Empresa Teste",
        email="teste@dasfabri.com",
        phone="(11) 99999-9999",
        position="Administrador",
        status=AccessRequestStatus.APPROVED,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        approved_at=datetime.now(),
        approved_by="system",
    )
    
    # Adicionar à lista de solicitações
    from backend.api.access_requests import access_requests_db
    access_requests_db.append(test_user)
    
    print("Usuário de teste criado com sucesso!")
    print(f"Email: {test_user.email}")
    print(f"Status: {test_user.status}")
    print("\nVocê pode usar estas credenciais para acessar o sistema:")
    print("Email: teste@dasfabri.com")
    print("Senha: teste123")

if __name__ == "__main__":
    create_test_user() 