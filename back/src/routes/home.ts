import { Router } from 'express';
import fetch from 'node-fetch';
import { authCheck } from './auth';

export default function HomeRoutes(): Router {
    const router = Router();

    router.post('/:page/:limit', authCheck, async (req: any, res: any) => {
        try {
            const genderList = [
                'comedy',
                'sci-fi',
                'horror',
                'romance',
                'action',
                'thriller',
                'drama',
                'mystery',
                'crime',
                'animation',
                'adventure',
                'fantasy',
            ];

            let sortBy = req.body.sortBy;
            let filterGender = '';
            let search = '';

            // Check sort input
            if (
                sortBy !== 'title' &&
                sortBy !== 'rating' &&
                sortBy !== 'year'
            ) {
                sortBy = 'download_count';
            } else if (
                sortBy !== 'title' &&
                sortBy !== 'rating' &&
                sortBy !== 'year'
            ) {
                sortBy = 'title';
            }

            // Check gender list input
            if (genderList.find(e => e === req.body.filterGender)) {
                filterGender = `&genre=${req.body.filterGender}`;
            }

            if (req.body.search !== undefined) {
                search = `&query_term=${encodeURI(req.body.search)}`;
            }

            //SOURCE 1: YTS
            const url = `https://yts.mx/api/v2/list_movies.json?sort_by=${sortBy}&page=${req.params.page}&limit=${req.params.limit}${filterGender}${search}`;
            const result = await fetch(url)
                .then(res => res.json())
                .then(res => res);
            if (result === null || result.data.movies === undefined) {
                res.json({ error: 'no result' });
                res.status(200);
                return;
            }

            //SOURCE 2: POPCORN
            const url2 = `https://tv-v2.api-fetch.website/movies/${req.params.page}?sort=last%20added&order=1`;
            const result2 = await fetch(url2)
                .then(res => res.json())
                .then(res => res);

            if (result === null || result.data.movies === undefined) {
                res.json({ error: 'no result' });
                res.status(200);
                return;
            }

            if (result2 === null) {
                res.json({ error: 'no result' });
                res.status(200);
                return;
            }

            // sort by gender
            if (req.body.sortBy === 'gender') {
                result.data.movies.sort((a: any, b: any) => {
                    return a.genres[0].localeCompare(b.genres[0]);
                });
            }

            // filter by rating and years
            let ratingMin = isNaN(Number(req.body.ratingMin))
                ? 0
                : Number(req.body.ratingMin);
            let ratingMax = isNaN(Number(req.body.ratingMax))
                ? 10
                : Number(req.body.ratingMax);
            let yearMin = isNaN(Number(req.body.yearMin))
                ? 1900
                : Number(req.body.yearMin);
            let yearMax = isNaN(Number(req.body.yearMax))
                ? 2050
                : Number(req.body.yearMax);

            if (!(ratingMin < ratingMax)) {
                ratingMin = 0;
                ratingMax = 10;
            }

            if (!(yearMin < yearMax)) {
                yearMin = 1900;
                yearMax = 2050;
            }

            const filtered = result.data.movies.filter(
                (movie: any) =>
                    movie.rating >= ratingMin &&
                    movie.rating <= ratingMax &&
                    movie.year >= yearMin &&
                    movie.year <= yearMax
            );

            // is seen and format with a MAP
            const final = filtered.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                year: movie.year,
                rating: movie.rating,
                image: movie.medium_cover_image,
                isSeen:
                    req.user.seenMovies === undefined ||
                    req.user.seenMovies === null
                        ? false
                        : req.user.seenMovies.find((e: any) => e === movie.id)
                        ? true
                        : false,
                imbId: movie.imdb_code,
            }));

            res.json(final);
        } catch (e) {
            res.json({ status: 'ERROR' });
            res.status(400);
        }
    });
    return router;
}
