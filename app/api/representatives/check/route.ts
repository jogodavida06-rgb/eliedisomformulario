import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const repId = searchParams.get('id');

    if (!repId) {
      return NextResponse.json(
        { authorized: false, message: 'ID do representante não fornecido' },
        { status: 400 }
      );
    }

    const representativeId = parseInt(repId);

    if (isNaN(representativeId)) {
      return NextResponse.json(
        { authorized: false, message: 'ID inválido' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/representatives?id=eq.${representativeId}&is_active=eq.true&select=id,whatsapp,is_active`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    );

    if (!response.ok) {
      console.error('Error checking representative:', response.statusText);
      return NextResponse.json(
        { authorized: false, message: 'Erro ao verificar autorização' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          authorized: false,
          message: 'Você não está autorizado a abrir esse formulário. Procure seu líder ou representante oficial para obter um link válido.'
        },
        { status: 403 }
      );
    }

    const representative = data[0];

    return NextResponse.json({
      authorized: true,
      representative: {
        id: representative.id,
        whatsapp: representative.whatsapp
      }
    });

  } catch (error) {
    console.error('Error in representative check:', error);
    return NextResponse.json(
      { authorized: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
