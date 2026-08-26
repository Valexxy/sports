import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://srv.adstxtmanager.com/19390/mivaj.com', {
    status: 301,
  });
}
