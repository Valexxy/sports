import { NextRequest, NextResponse } from 'next/server';
import { FailureAlertService } from '../../../../lib/failure-alert-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { taskName, errorMessage, stack, context, recipientEmail } = body;

    const result = await FailureAlertService.dispatchFailureNotice({
      taskName: taskName || 'Manual Test Failure Alert',
      errorMessage: errorMessage || 'Test verification of independent application failure mailer.',
      stack,
      context,
      recipientEmail,
    });

    return NextResponse.json({
      success: true,
      message: 'Independent failure notification dispatched successfully (Not GitHub / Not Vercel)',
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const result = await FailureAlertService.dispatchFailureNotice({
    taskName: 'Diagnostic Ping',
    errorMessage: 'Health verification of independent failure mailer and emergency telegram channel.',
  });

  return NextResponse.json({
    success: true,
    message: 'Diagnostic failure ping dispatched.',
    result,
  });
}
