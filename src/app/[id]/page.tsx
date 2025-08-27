'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Box, Container, Typography, Grid, Chip, Paper, Skeleton, Alert, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';


//estrutura dos dados que vem da api para esse pagina(de um jogo especifico)
type GameDetails = {
    id: number;
    name: string;
    summary: string;
    cover: { url: string };
    screenshots?: { url: string }[];
    videos?: { video_id: string }[];
    genres?: { name: string }[];
    platforms?: { abbreviation: string }[];
    first_release_date?: number;
    total_rating?: number;
}

//Skeleton
const GameDetailSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
        <Grid container spacing={4}>
            {/* Left Column Skeleton */}
            <Grid size={{xs:12, md:4}}>
                <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '3/4', borderRadius: 2 }} />
                <Paper sx={{ p: 2, mt: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <Skeleton variant="text" height={40} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        <Skeleton variant="rounded" width={80} height={32} />
                        <Skeleton variant="rounded" width={60} height={32} />
                        <Skeleton variant="rounded" width={70} height={32} />
                    </Box>
                </Paper>
            </Grid>
            {/* Right Column Skeleton */}
            <Grid size={{xs:12, md:8}} >
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="40%" height={40} sx={{ mt: 3 }} />
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{xs:6, md:4}}>
                        <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '16/9', borderRadius: 2 }} />
                    </Grid>
                    <Grid size={{xs:6, md:4}}>
                        <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '16/9', borderRadius: 2 }} />
                    </Grid>
                    <Grid size={{xs:6, md:4}}>
                        <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '16/9', borderRadius: 2 }} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Container>
);


export default function Page() {
    const params = useParams();
    const game_id = params.id;

    const [game, setGame] = useState<GameDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!game_id) return;

        const fetchGameData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/games/${game_id}`);
                if (!response.ok) {
                    throw new Error('Game not found or failed to fetch details.');
                }
                const gameData = await response.json();

                //pega a versão maior da imagem
                if (gameData.cover) {
                    gameData.cover.url = gameData.cover.url.replace('t_thumb', 't_cover_big');
                }
                if (gameData.screenshots) {
                    gameData.screenshots = gameData.screenshots.map((ss: any) => ({
                        ...ss,
                        url: ss.url.replace('t_thumb', 't_screenshot_huge')
                    }));
                }

                setGame(gameData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameData();
    }, [game_id]);


    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle, #313131ff, #1a1a1aff)', color: 'white' }}>
                <GameDetailSkeleton />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'radial-gradient(circle, #313131ff, #1a1a1aff)' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!game) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'radial-gradient(circle, #313131ff, #1a1a1aff)' }}>
                <Typography>Game data could not be loaded.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'radial-gradient(circle, #313131ff, #1a1a1aff)',
            color: 'white',
            pb: 4 
        }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Link href="/" passHref>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 3 }}
                    >
                        Voltar para a Home
                    </Button>
                </Link>
                <Typography variant="h3" component="h1" gutterBottom>
                    {game.name}
                </Typography>

                <Grid container spacing={4}>
                    {/* feft column */}
                    <Grid size={{xs:12, md:4}}>
                        <Box
                            component="img"
                            src={game.cover?.url || '/placeholder.jpg'}
                            alt={`Cover for ${game.name}`}
                            sx={{
                                width: '100%',
                                borderRadius: 2.5,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                aspectRatio: '3/4',
                                objectFit: 'cover'
                            }}
                        />
                        {game.total_rating && (
                            <Chip
                                icon={<StarIcon />}
                                label={`Avaliação: ${Math.round(game.total_rating)} / 100`}
                                color="warning"
                                sx={{ borderRadius:2.5, mt: 2, fontSize: '1rem', p: 2 }}
                            />
                        )}
                        <Paper elevation={3} sx={{ p: 3, borderRadius:2.5, mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(10px)' }}>
                        <Typography variant="h6">Detalhes</Typography>
                        {game.first_release_date && (
                            <Typography variant="body2" sx={{mt: 1}}>
                                <strong>Data de Lançamento:</strong> {new Date(game.first_release_date * 1000).toLocaleDateString()}
                            </Typography>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom><strong>Plataformas:</strong></Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {game.platforms?.map(p => <Chip key={p.abbreviation} label={p.abbreviation} variant="outlined" />)}
                            </Box>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom><strong>Gêneros:</strong></Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {game.genres?.map(g => <Chip key={g.name} label={g.name} color="primary" />)}
                            </Box>
                        </Box>
                        </Paper>
                    </Grid>

                    {/* right column */}
                    <Grid size={{xs:12, md:8}}>
                        {game.summary && (
                            <Box>
                                <Typography variant="h5" component="h2" gutterBottom>Resumo</Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                    {game.summary}
                                </Typography>
                            </Box>
                        )}
                        
                        {game.screenshots && game.screenshots.length > 0 && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h5" component="h2" gutterBottom>Screenshots</Typography>
                                <Grid container spacing={2}>
                                    {game.screenshots.map((ss, index) => (
                                        <Grid key={index} size={{xs:12, sm:6, md:4}}>
                                            <Box
                                                component="img"
                                                src={ss.url}
                                                alt={`${game.name} screenshot ${index + 1}`}
                                                sx={{ width: '100%', borderRadius: 2, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                        
                        {game.videos && game.videos.length > 0 && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h5" component="h2" gutterBottom>Vídeos</Typography>
                                {game.videos.slice(0, 1).map(video => ( 
                                    <Box key={video.video_id} sx={{
                                        position: 'relative',
                                        paddingBottom: '56.25%', 
                                        height: 0,
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                                    }}>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${video.video_id}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Game trailer"
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}