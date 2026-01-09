# Referências à Lovable no Sistema

Este documento lista todas as referências encontradas à plataforma Lovable no código do sistema.

## 1. Dependências

### package.json
- **lovable-tagger** (versão ^1.1.7) - Dependência de desenvolvimento usada para marcar componentes no modo desenvolvimento

**Ação recomendada**: Pode ser removida se não for mais necessária, mas não causa problemas se mantida.

## 2. Configuração do Vite

### vite.config.ts
- Importa e usa `componentTagger` do `lovable-tagger` no modo desenvolvimento

**Status**: ✅ **REMOVIDO** - Comentado no código

## 3. Arquivos de Documentação

### README.md
- Contém informações sobre o projeto Lovable, incluindo URL do projeto e instruções de uso

**Ação recomendada**: Substituir por documentação específica do Dasfabri

## 4. Imagens e Assets

### Pasta `/public/lovable-uploads/`
Contém imagens enviadas através da plataforma Lovable:
- `3f9a329f-a63a-4a0c-a967-3c27735477b0.png` - Usado em Login.tsx e Register.tsx
- `46d968b9-c0f1-4283-9cba-525d7df0845e.png` - Logo usado em DasfabriLogo.tsx

**Arquivos que referenciam**:
- `src/pages/auth/Login.tsx`
- `src/pages/auth/Register.tsx`
- `src/components/DasfabriLogo.tsx`
- `src/components/Testimonials.tsx` (múltiplas referências)
- `src/components/cta/index.tsx`

**Ação recomendada**: 
- Manter as imagens se forem úteis
- Considerar mover para uma pasta mais apropriada (ex: `/public/images/`)
- Atualizar referências se necessário

## 5. Scripts Externos

### index.html
- Não há referências diretas à Lovable no HTML

## Resumo

**Total de referências encontradas**: ~50 (principalmente em package-lock.json e referências a imagens)

**Impacto**: 
- **Baixo** - As referências não afetam o funcionamento do sistema
- O `lovable-tagger` é apenas uma ferramenta de desenvolvimento
- As imagens em `lovable-uploads/` podem ser mantidas ou movidas conforme necessário

**Ações realizadas**:
- ✅ Removido `componentTagger` do vite.config.ts
- ✅ Criado novo favicon com logo DAS
- ✅ Atualizado index.html para usar novo favicon

**Ações recomendadas (opcionais)**:
- [ ] Remover `lovable-tagger` do package.json se não for mais necessário
- [ ] Atualizar README.md com documentação do Dasfabri
- [ ] Considerar mover imagens de `lovable-uploads/` para pasta mais apropriada

