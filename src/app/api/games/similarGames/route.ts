//Para não dar problema de CORS e como a API não suporta colocar a url do app,
//A chamada é feita do lado do backend

import { NextRequest, NextResponse } from 'next/server';
import { getTwitchToken } from '@/lib/twitchAuth';

export async function POST(req: NextRequest) {
    try {
        const accessToken = await getTwitchToken();

        if (!accessToken) {
            return NextResponse.json(
                {
                    error: "Could not retrieve Twitch token"
                },
                {
                    status: 500
                }
            )
        }
        const { similarGames } = await req.json();
        const idsString = similarGames.join(',');

        if (!similarGames) {
        return NextResponse.json(
            { message: "similarGames field is required" },
            { status: 400 }
        );
        }


        const url = "https://api.igdb.com/v4/games";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`,
            } as HeadersInit,
            body: `fields rating, name, summary, total_rating, cover.url, aggregated_rating, genres.id, genres.name,platforms.id, platforms.abbreviation;
             limit 6;
              where id = (${idsString});
             `,
        });

        const data = await response.json();
        console.log(data);
        return NextResponse.json(data)

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 });
    };
}

