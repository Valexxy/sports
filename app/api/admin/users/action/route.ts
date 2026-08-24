import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../../lib/database-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, delta, reason, role, tier, status, userData } = body;

    let result = null;

    switch (action) {
      case 'ADJUST_AURA':
        result = await DatabaseService.adjustUserAura(username, delta || 0, reason || 'Admin Adjustment');
        break;
      case 'CHANGE_ROLE':
        result = await DatabaseService.updateUserRoleAndTier(username, role, tier);
        break;
      case 'CHANGE_STATUS':
        result = await DatabaseService.updateUserStatus(username, status, reason);
        break;
      case 'DELETE_USER':
        result = await DatabaseService.deleteUser(username);
        break;
      case 'CREATE_OR_UPDATE':
        result = await DatabaseService.createOrUpdateUser(userData);
        break;
      default:
        return NextResponse.json({ error: 'Invalid PAM action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
