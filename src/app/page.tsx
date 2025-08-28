'use client'
import {
    useEffect, useState, useRef, useCallback
} from "react";

import {
    Typography, Box, Grid, Container,
    TextField, InputAdornment, CircularProgress
} from '@mui/material';

import { GameCard, GameCardSkeleton, Game } from "@/components/gameCard";
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
    const [games, setGames] = useState<Game[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const loader = useRef<HTMLDivElement | null>(null);
    const initialLoad = useRef(true);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setGames([]); setOffset(0); setHasMore(true); initialLoad.current = true;
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const loadMoreGames = useCallback(async (isNewSearch = false) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        const url = `/api/games?offset=${isNewSearch ? 0 : offset}${debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ""}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch");
            const newGames: Game[] = await response.json();

            setGames(prev => {
                const allGames = isNewSearch ? newGames : [...prev, ...newGames];
                const uniqueGamesMap = new Map<number, Game>();
                allGames.forEach(game => {
                    uniqueGamesMap.set(game.id, game);
                });
                return Array.from(uniqueGamesMap.values());
            });

            setOffset(prev => isNewSearch ? newGames.length : prev + newGames.length);
            if (newGames.length < 10) setHasMore(false);

        } catch (err) { console.error(err); }
        finally {
            setIsLoading(false);
            if (initialLoad.current) initialLoad.current = false;
        }
    }, [offset, isLoading, hasMore, debouncedSearchTerm]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isLoading) loadMoreGames();
        }, { rootMargin: '0px 0px 400px 0px' });
        const currentLoader = loader.current;
        if (currentLoader) observer.observe(currentLoader);
        return () => { if (currentLoader) observer.unobserve(currentLoader) };
    }, [loadMoreGames, hasMore, isLoading]);

    useEffect(() => { loadMoreGames(true); }, [debouncedSearchTerm]);

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'radial-gradient(circle, #313131ff, #1a1a1aff)',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* HERO titulo subtitulo e searchbar*/}
                <Box sx={{
                    textAlign: 'center',
                    py: { xs: 4, md: 8 },
                    mb: 6
                }}>
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
                            background: 'linear-gradient(90deg, #8360c3, #2ebf91)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Jogateca
                    </Typography>

                    <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{ mt: 1, mb: 4 }}
                    >
                        Sua biblioteca de jogos infinita (ou quase)
                    </Typography>

                    <TextField
                        variant="outlined"
                        placeholder="Procure por um jogo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            width: '100%',
                            maxWidth: '500px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px',
                                transition: 'all 0.3s ease',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 10px 2px #90caf9'
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>


                <Grid container spacing={4} sx={{ justifyContent: "center" }}>
                    {initialLoad.current && isLoading
                        ? Array.from(new Array(10)).map((_, index) => (
                            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{display: 'flex', justifyContent:'center'}}>
                                <GameCardSkeleton />
                            </Grid>
                        ))
                        : games.map((game) => (
                            <Grid key={`${game.id}-${game.name}`} container sx={{ justifyContent: "center" }} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <GameCard game={game} />
                            </Grid>
                        ))
                    }
                </Grid>

                <Box ref={loader} sx={{ display: 'flex', justifyContent: 'center', p: 4, height: '80px' }}>
                    {!initialLoad.current && isLoading && <CircularProgress />}
                    {!hasMore && games.length > 0 && (
                        <Typography>Parabéns, você viu tudo 👋</Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
}