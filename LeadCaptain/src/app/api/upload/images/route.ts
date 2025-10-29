import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const files: File[] = []

    // Extrair todos os arquivos do FormData
    const entries = Array.from(data.entries())
    for (const [key, value] of entries) {
      if (key.startsWith('image-') && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma imagem encontrada' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    // Criar diretório de uploads se não existir
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'landing-pages')
    
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Diretório já existe
    }

    // Processar cada arquivo
    for (const file of files) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        continue
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        continue
      }

      // Gerar nome único usando timestamp
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${random}.${extension}`
      const filepath = join(uploadsDir, filename)

      // Converter para buffer e salvar
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      // Adicionar URL pública
      uploadedUrls.push(`/uploads/landing-pages/${filename}`)
    }

    return NextResponse.json({
      message: 'Upload realizado com sucesso',
      urls: uploadedUrls
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}