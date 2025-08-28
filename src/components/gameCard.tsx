import { useState, useRef, MouseEvent } from 'react';
import {
    Card, CardContent, CardMedia, Typography, Box, Chip, Stack, Skeleton
} from '@mui/material';

import Link from 'next/link';


//Tipo Game com os dados que vem da API
export type Game = {
    id: number; name: string; cover?: { url?: string; };
    genres?: { id: number; name: string; }[];
    platforms?: { id: number; abbreviation: string; }[];
    aggregated_rating?: number;
    total_rating?: number;
};
export type GameCardProps = { game: Game; };


export const GameCard = ({ game }: GameCardProps) => {
    const imageUrl = game.cover?.url
        ? game.cover.url.replace('/t_thumb/', '/t_cover_big/')
        : 'no-cover.jpg';


    const [transformStyle, setTransformStyle] = useState({});
    
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const { left, top, width, height } = card.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        // Calcula a rotação com base na posição do mouse a partir do centro
        const rotateY = 6 * ((mouseX - width / 2) / (width / 2));
        const rotateX = -6 * ((mouseY - height / 2) / (height / 2));

        setTransformStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
        });
    };

    const handleMouseLeave = () => {
        setTransformStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
        });
    };

    return (
        <Link 
            href={`/${game.id}`}
            style={{ 
                textDecoration: 'none', 
                width: '100%',
                perspective: '1000px',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Card
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                sx={{
                    height: '100%',
                    width:'100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    minWidth: 300,
                    maxWidth: 300,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(40, 40, 40, 0.5)', 
                    // Transição suave para a transformação e a sombra
                    transition: 'transform 0.1s linear, box-shadow 0.3s ease',
                    // O `transformStyle` dinâmico será aplicado aqui
                    ...transformStyle,
                    '&:hover': {
                        cursor : 'pointer',
                        boxShadow: '0 8px 32px 0 rgba(144, 202, 249, 0.37)', // Mantém o brilho
                    },
                }}
            >
                <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={`Cover for ${game.name}`}
                    sx={{ height: 373, objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h3" title={game.name} noWrap>
                        {game.name}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ my: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                        {game.genres?.slice(0, 2).map((genre) => (
                            <Chip key={genre.id} label={genre.name} size="small" variant="outlined" />
                        ))}
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    {game.aggregated_rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {Math.round(game.aggregated_rating)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Rating
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
};


//Skeleton de carregamento das cards do jogos
export const GameCardSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 300, maxWidth: 300, borderRadius: 3, justifyContent: 'center'}}>
        <Skeleton variant="rectangular" height={373}  sx={{borderRadius: 3, display: 'flex', justifyContent: 'center'}}  />
        <CardContent>
            <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
            <Skeleton variant="text" width="60%" />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Skeleton variant="rounded" width={50} height={24} />
                <Skeleton variant="rounded" width={50} height={24} />
            </Box>
        </CardContent>
    </Card>
);