import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../lib/database-service';

export async function GET() {
  try {
    const users = await DatabaseService.getAllUsers();
    const referrals = await DatabaseService.getAllReferrals();
    const transactions = await DatabaseService.getAllTransactions();
    const auditLogs = await DatabaseService.getAuditLogs();
    const settings = await DatabaseService.getSettings();

    return NextResponse.json({
      success: true,
      users,
      referrals,
      transactions,
      auditLogs,
      settings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
