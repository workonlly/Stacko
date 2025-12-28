'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function addToWatchlist(userId: string, symbol: string, company: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!userId || !symbol || !company) {
      return { success: false, message: 'Missing required fields' };
    }

    await connectToDatabase();

    // Check if already in watchlist
    const existing = await Watchlist.findOne({ userId, symbol });
    if (existing) {
      return { success: false, message: 'Already in watchlist' };
    }

    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    return { success: true, message: 'Added to watchlist' };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, message: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!userId || !symbol) {
      return { success: false, message: 'Missing required fields' };
    }

    await connectToDatabase();
    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });

    return { success: true, message: 'Removed from watchlist' };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, message: 'Failed to remove from watchlist' };
  }
}

export async function getUserWatchlist(userId: string): Promise<any[]> {
  try {
    if (!userId) return [];

    await connectToDatabase();
    const items = await Watchlist.find({ userId }).lean();
    return items;
  } catch (err) {
    console.error('getUserWatchlist error:', err);
    return [];
  }
}
