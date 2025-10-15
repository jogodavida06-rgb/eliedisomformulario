import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, whatsapp } = body;

    if (!id || !whatsapp) {
      return NextResponse.json(
        { success: false, message: 'ID e WhatsApp são obrigatórios' },
        { status: 400 }
      );
    }

    const representativeId = parseInt(id);

    if (isNaN(representativeId)) {
      return NextResponse.json(
        { success: false, message: 'ID deve ser um número válido' },
        { status: 400 }
      );
    }

    const cleanWhatsapp = whatsapp.replace(/\D/g, '');

    if (cleanWhatsapp.length < 10) {
      return NextResponse.json(
        { success: false, message: 'WhatsApp inválido' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/representatives`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation,resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: representativeId,
          whatsapp: cleanWhatsapp,
          is_active: true,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      console.error('Error adding representative:', response.statusText);
      return NextResponse.json(
        { success: false, message: 'Erro ao adicionar representante' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const representative = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({
      success: true,
      message: 'Representante adicionado com sucesso!',
      representative
    });

  } catch (error) {
    console.error('Error in add representative:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
