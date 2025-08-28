import { NextResponse } from 'next/server';
import { getTwitchToken } from '@/lib/twitchAuth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params;
    const game_id = id;


    const accessToken = await getTwitchToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Could not retrieve Twitch token' },
        { status: 500 }
      );
    }

    const url = 'https://api.igdb.com/v4/games';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
      } as HeadersInit,
      body: `fields name, summary, similar_games, screenshots.url, first_release_date, videos.video_id, cover.url, total_rating, aggregated_rating, genres.name, platforms.abbreviation; 
        where id = ${game_id};`,
    });


    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`IGDB API Error: ${response.status}`, errorBody);
      return NextResponse.json(
        { error: `Failed to fetch data from IGDB. Status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();


    return NextResponse.json(data[0]);

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}