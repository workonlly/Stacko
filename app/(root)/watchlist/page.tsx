import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { getUserWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";

const WatchlistPage = async () => {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    
    if (!session) {
        redirect("/sign-in");
    }

    const userId = session.user.id;
    const watchlistItems = await getUserWatchlist(userId);

    const handleRemove = async (symbol: string) => {
        'use server';
        await removeFromWatchlist(userId, symbol);
    };

    return (
        <div className="min-h-screen bg-white !text-black">
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-bold mb-8 text-black">My Watchlist</h1>

                {watchlistItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600 mb-4">Your watchlist is empty</p>
                        <a href="/" className="text-blue-600 hover:text-blue-800">
                            Browse stocks to add to your watchlist
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {watchlistItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-black">{item.symbol}</h3>
                                    <p className="text-gray-600">{item.company}</p>
                                    <p className="text-sm text-gray-500">
                                        Added: {new Date(item.addedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`/stocks/${item.symbol}`}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        View
                                    </a>
                                    <form action={async () => {
                                        'use server';
                                        await removeFromWatchlist(userId, item.symbol);
                                        redirect("/watchlist");
                                    }}>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchlistPage;
