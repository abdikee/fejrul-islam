import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDailyHabits, updateDailyHabits } from '@/lib/db/utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function verifyToken(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    // Verify authentication
    const decoded = await verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    // Get daily habits
    const habits = await getDailyHabits(decoded.userId, date);

    return NextResponse.json({
      success: true,
      habits: habits
    });

  } catch (error) {
    console.error('Get habits API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const decoded = await verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { habits, date } = await request.json();

    // Update daily habits
    const updatedHabits = await updateDailyHabits(decoded.userId, habits, date);

    return NextResponse.json({
      success: true,
      message: 'Habits updated successfully',
      habits: {
        morningAdhkar: updatedHabits.morning_adhkar,
        quranReading: updatedHabits.quran_reading,
        eveningAdhkar: updatedHabits.evening_adhkar,
        sadaqah: updatedHabits.sadaqah
      }
    });

  } catch (error) {
    console.error('Update habits API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}