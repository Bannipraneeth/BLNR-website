import { NextResponse } from 'next/server';

export async function GET() {
  const products = [
    { id: 1, name: 'Product A' },
    { id: 2, name: 'Product B' },
    { id: 3, name: 'Product C' },
  ];
  return NextResponse.json(products);
} 